import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";

const ROOT = process.cwd();
const PORT = Number(process.env.WCAG_PORT || "3333");
const BASE_URL = process.env.WCAG_BASE_URL || `http://localhost:${PORT}`;
const USE_EXISTING = process.env.WCAG_USE_EXISTING === "1";
const ROUTES = ["/en", "/en/journal", "/en/journal/cybernetic-habitat-manifesto", "/en/nest", "/en/about"];
const OUT_PATH = path.join(ROOT, "audit", "wcag-keyboard-contrast-report.json");
const BUILD_ID_PATH = path.join(ROOT, ".next", "BUILD_ID");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function startServer() {
  const command = process.platform === "win32" ? "npx.cmd" : "npx";
  return spawn(command, ["next", "start", "-p", String(PORT)], {
    cwd: ROOT,
    stdio: "ignore",
    env: {
      ...process.env,
      NODE_ENV: "production",
    },
  });
}

async function stopServer(child) {
  if (!child || child.killed) return;

  child.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    sleep(4000),
  ]);

  if (!child.killed) {
    child.kill("SIGKILL");
  }
}

async function ensureServer(url) {
  const maxAttempts = 40;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const response = await fetch(`${url}/en`, { redirect: "manual" });
      if (response.ok || response.status === 307 || response.status === 308) {
        return;
      }
    } catch {
      // Retry until timeout.
    }

    await sleep(250);
  }

  throw new Error(`Server not reachable at ${url}`);
}

async function runKeyboardAudit(page, route) {
  await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded" });

  await page.keyboard.press("Tab");
  const firstFocus = await page.evaluate(() => {
    const active = document.activeElement;
    if (!active) return { isSkipLink: false, signature: "none" };

    return {
      isSkipLink: active.matches("a.skip-link"),
      signature: `${active.tagName.toLowerCase()}#${active.id || ""}`,
    };
  });

  await page.keyboard.press("Enter");

  const skipTargetState = await page.evaluate(() => ({
    hashIsMain: window.location.hash === "#main-content",
    mainFocused: document.activeElement?.id === "main-content",
  }));

  const uniqueFocus = new Set();
  let reachedEmail = false;
  let reachedSubmit = false;

  for (let i = 0; i < 36; i += 1) {
    await page.keyboard.press("Tab");
    const active = await page.evaluate(() => {
      const element = document.activeElement;
      if (!element) {
        return {
          signature: "none",
          email: false,
          submit: false,
        };
      }

      const name = element.getAttribute("name");
      const type = element.getAttribute("type");
      const signature = `${element.tagName.toLowerCase()}#${element.id || ""}[name=${name || ""}][type=${type || ""}]`;

      return {
        signature,
        email: element.matches('input[name="email"][type="email"]'),
        submit: element.matches('button[type="submit"]'),
      };
    });

    uniqueFocus.add(active.signature);
    reachedEmail = reachedEmail || active.email;
    reachedSubmit = reachedSubmit || active.submit;
  }

  const basePass =
    firstFocus.isSkipLink && (skipTargetState.hashIsMain || skipTargetState.mainFocused) && uniqueFocus.size >= 3;

  return {
    pass: basePass,
    skipLinkFocused: firstFocus.isSkipLink,
    skipTargetReached: skipTargetState.hashIsMain || skipTargetState.mainFocused,
    uniqueFocusTargets: uniqueFocus.size,
    reachedEmail,
    reachedSubmit,
  };
}

async function runContrastAudit(page, route) {
  await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded" });

  return page.evaluate(() => {
    function parseColor(input) {
      const value = input.trim().toLowerCase();
      if (!value.startsWith("rgb")) return null;

      const match = value.match(/rgba?\(([^)]+)\)/);
      if (!match) return null;

      const parts = match[1].split(",").map((part) => Number(part.trim()));
      const [r, g, b, alpha = 1] = parts;

      if (![r, g, b, alpha].every((part) => Number.isFinite(part))) return null;

      return {
        r,
        g,
        b,
        a: alpha,
      };
    }

    function blend(foreground, background) {
      const fgAlpha = foreground.a;
      const bgAlpha = background.a;
      const outAlpha = fgAlpha + bgAlpha * (1 - fgAlpha);

      if (outAlpha <= 0) {
        return { r: 0, g: 0, b: 0, a: 0 };
      }

      return {
        r: (foreground.r * fgAlpha + background.r * bgAlpha * (1 - fgAlpha)) / outAlpha,
        g: (foreground.g * fgAlpha + background.g * bgAlpha * (1 - fgAlpha)) / outAlpha,
        b: (foreground.b * fgAlpha + background.b * bgAlpha * (1 - fgAlpha)) / outAlpha,
        a: outAlpha,
      };
    }

    function srgbToLinear(value) {
      const normalized = value / 255;
      if (normalized <= 0.04045) return normalized / 12.92;
      return ((normalized + 0.055) / 1.055) ** 2.4;
    }

    function luminance(color) {
      return (
        0.2126 * srgbToLinear(color.r) + 0.7152 * srgbToLinear(color.g) + 0.0722 * srgbToLinear(color.b)
      );
    }

    function contrastRatio(foreground, background) {
      const light = Math.max(luminance(foreground), luminance(background));
      const dark = Math.min(luminance(foreground), luminance(background));
      return (light + 0.05) / (dark + 0.05);
    }

    function resolveBackground(element) {
      let current = element;
      let background = { r: 255, g: 255, b: 255, a: 0 };

      while (current) {
        const color = parseColor(window.getComputedStyle(current).backgroundColor);
        if (color && color.a > 0) {
          background = blend(color, background);
          if (background.a >= 0.99) break;
        }
        current = current.parentElement;
      }

      if (background.a < 0.99) {
        const bodyBg = parseColor(window.getComputedStyle(document.body).backgroundColor) || {
          r: 255,
          g: 255,
          b: 255,
          a: 1,
        };
        background = blend(background, bodyBg);
      }

      return {
        r: background.r,
        g: background.g,
        b: background.b,
      };
    }

    function elementSignature(element) {
      const tag = element.tagName.toLowerCase();
      const id = element.id ? `#${element.id}` : "";
      const name = element.getAttribute("name") ? `[name=${element.getAttribute("name")}]` : "";
      const classes = (typeof element.className === "string" ? element.className : "")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((className) => `.${className}`)
        .join("");

      return `${tag}${id}${name}${classes}`.slice(0, 180);
    }

    const candidates = Array.from(document.querySelectorAll("a, button, input, textarea, select"));
    const violations = [];
    let scanned = 0;

    for (const element of candidates) {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const tag = element.tagName.toLowerCase();
      const type = (element.getAttribute("type") || "").toLowerCase();

      if (
        rect.width < 1 ||
        rect.height < 1 ||
        style.display === "none" ||
        style.visibility === "hidden" ||
        style.opacity === "0" ||
        element.getAttribute("aria-hidden") === "true"
      ) {
        continue;
      }

      if (tag === "input" && ["hidden", "checkbox", "radio", "range", "color", "file", "image"].includes(type)) {
        continue;
      }

      const hasText =
        tag === "input" ||
        Boolean((element.textContent || "").trim()) ||
        Boolean(element.getAttribute("aria-label"));

      if (!hasText) {
        continue;
      }

      const textColor = parseColor(style.color);
      if (!textColor) {
        continue;
      }

      scanned += 1;

      const background = resolveBackground(element);
      const solidTextColor =
        textColor.a < 1 ? blend(textColor, { ...background, a: 1 }) : { ...textColor, a: 1 };

      const ratio = contrastRatio(solidTextColor, background);
      const fontSize = Number.parseFloat(style.fontSize) || 0;
      const fontWeight = Number.parseInt(style.fontWeight, 10) || 400;
      const isLarge = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
      const threshold = isLarge ? 3 : 4.5;

      if (ratio + 0.001 >= threshold) {
        continue;
      }

      violations.push({
        element: elementSignature(element),
        ratio: Number(ratio.toFixed(2)),
        threshold,
        fontSize,
        fontWeight,
        color: style.color,
        background: `rgb(${Math.round(background.r)}, ${Math.round(background.g)}, ${Math.round(background.b)})`,
      });
    }

    return {
      scanned,
      violations,
    };
  });
}

async function main() {
  let server;

  try {
    if (!USE_EXISTING) {
      if (!fs.existsSync(BUILD_ID_PATH)) {
        throw new Error("Missing build artifacts (.next/BUILD_ID). Run `npm run build` first, or set WCAG_USE_EXISTING=1.");
      }

      server = startServer();
    }

    await ensureServer(BASE_URL);

    const browser = await chromium.launch({ headless: process.env.WCAG_HEADLESS !== "0" });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

    const routeResults = [];

    try {
      for (const route of ROUTES) {
        const page = await context.newPage();
        const keyboard = await runKeyboardAudit(page, route);
        const contrast = await runContrastAudit(page, route);

        await page.close();

        routeResults.push({
          route,
          keyboard,
          contrast,
          pass: keyboard.pass && contrast.violations.length === 0,
        });
      }
    } finally {
      await context.close();
      await browser.close();
    }

    const report = {
      generated_at: new Date().toISOString(),
      base_url: BASE_URL,
      routes: routeResults,
      overall_pass: routeResults.every((result) => result.pass),
    };

    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

    console.log("\nWCAG keyboard + contrast audit:\n");
    for (const result of routeResults) {
      const contrastState = result.contrast.violations.length === 0 ? "PASS" : "FAIL";
      const keyboardState = result.keyboard.pass ? "PASS" : "FAIL";
      console.log(`- ${result.route}: keyboard ${keyboardState}, contrast ${contrastState}`);
    }
    console.log(`\nReport written to ${path.relative(ROOT, OUT_PATH)}\n`);

    if (!report.overall_pass) {
      process.exit(1);
    }
  } finally {
    await stopServer(server);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
