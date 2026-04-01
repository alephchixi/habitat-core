import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const ROOT = process.cwd();
const PORT = Number(process.env.HEADERS_CHECK_PORT || "3399");
const BASE_URL = process.env.HEADERS_CHECK_BASE_URL || `http://localhost:${PORT}`;
const USE_EXISTING = process.env.HEADERS_CHECK_USE_EXISTING === "1";
const OUT_PATH = path.join(ROOT, "audit", "security-headers-report.json");
const BUILD_ID_PATH = path.join(ROOT, ".next", "BUILD_ID");

const ROUTES = [
  "/en",
  "/en/nest",
  "/en/about",
  "/api/community/intake",
  "/api/newsletter/subscribe",
  "/api/analytics/web-vitals",
];

const CHECKS = [
  {
    header: "x-powered-by",
    description: "x-powered-by disabled",
    check: (value) => value === null,
  },
  {
    header: "x-frame-options",
    description: "DENY framing",
    check: (value) => value === "DENY",
  },
  {
    header: "x-content-type-options",
    description: "nosniff",
    check: (value) => value === "nosniff",
  },
  {
    header: "referrer-policy",
    description: "strict-origin-when-cross-origin",
    check: (value) => value === "strict-origin-when-cross-origin",
  },
  {
    header: "permissions-policy",
    description: "permissions policy present",
    check: (value) => typeof value === "string" && value.includes("camera=()"),
  },
  {
    header: "content-security-policy",
    description: "CSP hardening directives present and script-src blocks unsafe-inline",
    check: (value) => {
      if (typeof value !== "string") return false;

      const scriptSrc = value
        .split(";")
        .map((segment) => segment.trim())
        .find((segment) => segment.startsWith("script-src "));

      return (
        value.includes("default-src 'self'") &&
        value.includes("object-src 'none'") &&
        value.includes("base-uri 'self'") &&
        value.includes("form-action 'self'") &&
        value.includes("frame-ancestors 'none'") &&
        typeof scriptSrc === "string" &&
        !scriptSrc.includes("'unsafe-inline'")
      );
    },
  },
  {
    header: "strict-transport-security",
    description: "HSTS enabled on TLS deploys (optional local)",
    check: (value) => value === null || (typeof value === "string" && value.includes("max-age=31536000")),
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url) {
  const maxAttempts = 80;
  for (let i = 0; i < maxAttempts; i += 1) {
    try {
      const response = await fetch(`${url}/en`, { redirect: "manual" });
      if (response.status >= 200) {
        return;
      }
    } catch {
      // continue
    }
    await sleep(500);
  }

  throw new Error(`Server not reachable at ${url}`);
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

async function stopDevServer(child) {
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

async function main() {
  let devServer;

  try {
    if (!USE_EXISTING) {
      if (!fs.existsSync(BUILD_ID_PATH)) {
        throw new Error("Missing build artifacts (.next/BUILD_ID). Run `npm run build` first, or set HEADERS_CHECK_USE_EXISTING=1.");
      }

      devServer = startServer();
    }

    await waitForServer(BASE_URL);

    const report = {
      generated_at: new Date().toISOString(),
      base_url: BASE_URL,
      routes: [],
    };

    let hasFailure = false;

    console.log("\nSecurity header check:\n");

    for (const route of ROUTES) {
      const response = await fetch(`${BASE_URL}${route}`, { redirect: "manual" });
      const routeResult = {
        route,
        status: response.status,
        checks: [],
      };

      for (const check of CHECKS) {
        const value = response.headers.get(check.header);
        const pass = check.check(value);
        routeResult.checks.push({
          header: check.header,
          description: check.description,
          value,
          pass,
        });

        if (!pass) {
          hasFailure = true;
        }
      }

      report.routes.push(routeResult);

      const missing = routeResult.checks.filter((item) => !item.pass).map((item) => item.header);
      console.log(`- ${route}: ${missing.length === 0 ? "PASS" : `FAIL (${missing.join(", ")})`}`);
    }

    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    console.log(`\nReport written to ${path.relative(ROOT, OUT_PATH)}\n`);

    if (hasFailure) {
      process.exit(1);
    }
  } finally {
    await stopDevServer(devServer);
  }
}

main();
