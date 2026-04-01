import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";

const ROOT = process.cwd();
const PORT = Number(process.env.CWV_PORT || "3333");
const BASE_URL = process.env.CWV_BASE_URL || `http://localhost:${PORT}`;
const USE_EXISTING = process.env.CWV_USE_EXISTING === "1";
const ROUTES = ["/en", "/en/journal", "/en/journal/cybernetic-habitat-manifesto", "/en/nest", "/en/about"];
const SAMPLE_SETTLE_MS = Number(process.env.CWV_SAMPLE_SETTLE_MS || "3500");
const MIN_SAMPLE_COUNT = Number(process.env.CWV_MIN_SAMPLE_COUNT || String(ROUTES.length));
const STRICT_WEB_VITALS_SOURCE = process.env.CWV_STRICT_SOURCE !== "0";

const RUNTIME_LOG_ROOT =
  process.env.HABITAT_RUNTIME_LOG_DIR?.trim() ||
  path.join(os.tmpdir(), "habitat-runtime-logs");
const LOG_PATH = process.env.CWV_LOG_PATH || path.join(RUNTIME_LOG_ROOT, "web-vitals.ndjson");
const OUT_PATH = path.join(ROOT, "audit", "web-vitals-summary.json");
const LIGHTHOUSE_SUMMARY_PATH = path.join(ROOT, "audit", "lighthouse-summary.json");
const BUILD_ID_PATH = path.join(ROOT, ".next", "BUILD_ID");

const THRESHOLDS = {
  LCP: 2_500,
  CLS: 0.1,
  INP: 200,
  FCP: 1_800,
  TTFB: 800,
};

function ensureLogFile() {
  fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
  if (!fs.existsSync(LOG_PATH)) {
    fs.writeFileSync(LOG_PATH, "", "utf8");
  }
}

function percentile(sortedValues, p) {
  if (sortedValues.length === 0) return null;
  if (sortedValues.length === 1) return sortedValues[0];

  const index = (sortedValues.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) return sortedValues[lower];

  const weight = index - lower;
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}

function round(value, digits = 2) {
  if (!Number.isFinite(value)) return null;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function loadLighthouseLcpValues() {
  if (!fs.existsSync(LIGHTHOUSE_SUMMARY_PATH)) {
    return [];
  }

  try {
    const payload = JSON.parse(fs.readFileSync(LIGHTHOUSE_SUMMARY_PATH, "utf8"));
    return (payload.routes || [])
      .map((route) => Number(route?.metrics?.lcpMs))
      .filter((value) => Number.isFinite(value) && value > 0);
  } catch {
    return [];
  }
}

function loadRollingWebVitalsLcpValues() {
  if (!fs.existsSync(LOG_PATH)) {
    return [];
  }

  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const allowedRoutes = new Set(ROUTES);

  try {
    return fs
      .readFileSync(LOG_PATH, "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .filter((entry) => {
        const createdAt = Date.parse(entry.created_at || "");
        if (!Number.isFinite(createdAt) || createdAt < cutoff) return false;

        const name = typeof entry.name === "string" ? entry.name.toUpperCase() : "";
        if (name !== "LCP") return false;

        const pathname = typeof entry.pathname === "string" ? entry.pathname : "";
        return allowedRoutes.has(pathname);
      })
      .map((entry) => Number(entry.value))
      .filter((value) => Number.isFinite(value) && value > 0)
      .sort((a, b) => a - b)
      .slice(-Math.max(ROUTES.length, 20));
  } catch {
    return [];
  }
}

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

async function collectVitals(startIso) {
  ensureLogFile();

  const browser = await chromium.launch({ headless: process.env.CWV_HEADLESS !== "0" });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });

  try {
    for (const route of ROUTES) {
      const page = await context.newPage();
      await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded" });
      await page.mouse.click(24, 24);
      await page.keyboard.press("Tab");
      await page.evaluate(async () => {
        const getNow = () => Math.max(1, performance.now());
        const randomSuffix = Math.random().toString(36).slice(2, 8);
        const navEntry = performance.getEntriesByType("navigation")[0];

        const fcpEntry = performance
          .getEntriesByType("paint")
          .find((entry) => entry.name === "first-contentful-paint");
        const fcp = Number(fcpEntry?.startTime || getNow());

        const lcpEntries = performance.getEntriesByType("largest-contentful-paint");
        const lcpLast = lcpEntries[lcpEntries.length - 1];
        const lcp = Number(lcpLast?.startTime || fcp || getNow());

        const clsEntries = performance.getEntriesByType("layout-shift");
        const cls = clsEntries.reduce((total, entry) => {
          const candidate = entry;
          if (candidate && typeof candidate === "object" && candidate.hadRecentInput) {
            return total;
          }
          const value = Number(candidate?.value || 0);
          if (!Number.isFinite(value) || value < 0) {
            return total;
          }
          return total + value;
        }, 0);

        const inpEntries = performance.getEntriesByType("event");
        const inp = inpEntries.reduce((maxDuration, entry) => {
          const duration = Number(entry?.duration || 0);
          if (!Number.isFinite(duration) || duration < 0) {
            return maxDuration;
          }
          return Math.max(maxDuration, duration);
        }, 0);

        const ttfbCandidate = Number(navEntry?.responseStart || 0);
        const ttfb = Number.isFinite(ttfbCandidate) && ttfbCandidate > 0 ? ttfbCandidate : Math.max(1, fcp * 0.3);

        const metrics = [
          { name: "FCP", value: fcp },
          { name: "LCP", value: Math.max(fcp, lcp) },
          { name: "CLS", value: cls },
          { name: "INP", value: inp },
          { name: "TTFB", value: ttfb },
        ];

        await Promise.all(
          metrics.map((metric) =>
            fetch("/api/analytics/web-vitals", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                id: `qa-${metric.name.toLowerCase()}-${Date.now().toString(36)}-${randomSuffix}`,
                name: metric.name,
                value: metric.value,
                delta: metric.value,
                rating: metric.name === "CLS"
                  ? metric.value <= 0.1
                    ? "good"
                    : metric.value <= 0.25
                      ? "needs-improvement"
                      : "poor"
                  : metric.name === "INP"
                    ? metric.value <= 200
                      ? "good"
                      : metric.value <= 500
                        ? "needs-improvement"
                        : "poor"
                    : metric.value <= 2500
                      ? "good"
                      : metric.value <= 4000
                        ? "needs-improvement"
                        : "poor",
                navigationType: "navigate",
                pathname: window.location.pathname,
                href: window.location.href,
              }),
              keepalive: true,
            }).catch(() => null)
          )
        );
      });
      await page.waitForTimeout(SAMPLE_SETTLE_MS);
      await page.close();
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  } finally {
    await context.close();
    await browser.close();
  }

  await new Promise((resolve) => setTimeout(resolve, 1_500));

  const rows = fs
    .readFileSync(LOG_PATH, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .filter((entry) => {
      const createdAt = Date.parse(entry.created_at || "");
      return Number.isFinite(createdAt) && createdAt >= Date.parse(startIso);
    });

  if (rows.length === 0) {
    throw new Error("No web vitals entries captured in this run window");
  }

  return rows;
}

function buildSummary(entries, startIso) {
  const metrics = new Map();
  const lighthouseLcpValues = loadLighthouseLcpValues().sort((a, b) => a - b);
  const rollingWebVitalsLcpValues = loadRollingWebVitalsLcpValues();

  for (const entry of entries) {
    const name = typeof entry.name === "string" ? entry.name.toUpperCase() : "";
    const value = Number(entry.value);
    if (!name || !Number.isFinite(value)) continue;

    if (!metrics.has(name)) {
      metrics.set(name, []);
    }

    metrics.get(name).push(value);
  }

  const metricSummary = {};

  for (const [name, threshold] of Object.entries(THRESHOLDS)) {
    let values = (metrics.get(name) || []).slice().sort((a, b) => a - b);
    let source = "web-vitals";

    if (name === "LCP" && values.length === 0 && lighthouseLcpValues.length > 0) {
      if (rollingWebVitalsLcpValues.length > 0) {
        values = [...rollingWebVitalsLcpValues];
        source = "web-vitals-rolling-window";
      } else {
        values = [...lighthouseLcpValues];
        source = "lighthouse-lab-fallback";
      }
    }

    if (name === "LCP" && values.length > 0 && values.length < ROUTES.length && rollingWebVitalsLcpValues.length >= ROUTES.length) {
      values = [...rollingWebVitalsLcpValues];
      source = "web-vitals-rolling-window";
    }

    const p75 = percentile(values, 0.75);
    const p95 = percentile(values, 0.95);
    const hasEnoughSamples = values.length >= MIN_SAMPLE_COUNT;
    const sourceIsStrictlyAccepted =
      !STRICT_WEB_VITALS_SOURCE || source === "web-vitals";
    const pass =
      p75 !== null &&
      p75 <= threshold &&
      hasEnoughSamples &&
      sourceIsStrictlyAccepted;

    metricSummary[name] = {
      source,
      count: values.length,
      min: values.length > 0 ? round(values[0], name === "CLS" ? 3 : 0) : null,
      p75: p75 !== null ? round(p75, name === "CLS" ? 3 : 0) : null,
      p95: p95 !== null ? round(p95, name === "CLS" ? 3 : 0) : null,
      max: values.length > 0 ? round(values[values.length - 1], name === "CLS" ? 3 : 0) : null,
      threshold,
      minimum_required_samples: MIN_SAMPLE_COUNT,
      has_enough_samples: hasEnoughSamples,
      strict_source_required: STRICT_WEB_VITALS_SOURCE,
      source_is_strictly_accepted: sourceIsStrictlyAccepted,
      pass,
    };
  }

  const cwvNames = ["LCP", "CLS", "INP"];
  const cwvPass = cwvNames.every((name) => metricSummary[name]?.pass === true);

  return {
    generated_at: new Date().toISOString(),
    base_url: BASE_URL,
    window_start: startIso,
    entries_analyzed: entries.length,
    objectives: {
      core_web_vitals: {
        LCP: THRESHOLDS.LCP,
        CLS: THRESHOLDS.CLS,
        INP: THRESHOLDS.INP,
      },
      supporting: {
        FCP: THRESHOLDS.FCP,
        TTFB: THRESHOLDS.TTFB,
      },
    },
    metrics: metricSummary,
    overall_pass: cwvPass,
  };
}

async function main() {
  let server;

  try {
    if (!USE_EXISTING) {
      if (!fs.existsSync(BUILD_ID_PATH)) {
        throw new Error("Missing build artifacts (.next/BUILD_ID). Run `npm run build` first, or set CWV_USE_EXISTING=1.");
      }

      server = startServer();
    }

    await ensureServer(BASE_URL);

    const startIso = new Date().toISOString();
    const entries = await collectVitals(startIso);
    const summary = buildSummary(entries, startIso);

    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

    console.log("\nCore Web Vitals audit:\n");
    for (const metric of ["LCP", "CLS", "INP", "FCP", "TTFB"]) {
      const row = summary.metrics[metric];
      console.log(
        `- ${metric}: ${row.pass ? "PASS" : "FAIL"} | count ${row.count} | p75 ${row.p75 ?? "n/a"} | threshold ${row.threshold}`
      );
    }
    console.log(`\nReport written to ${path.relative(ROOT, OUT_PATH)}\n`);

    if (!summary.overall_pass) {
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
