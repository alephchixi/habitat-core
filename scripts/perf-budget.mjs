import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import zlib from "node:zlib";

const ROOT = process.cwd();
const NEXT_DIR = path.join(ROOT, ".next");
const OUT_PATH = path.join(ROOT, "audit", "perf-budget-report.json");

const TEMPLATE_CONFIG = [
  {
    template: "home",
    manifestPath: path.join(NEXT_DIR, "server", "app", "[locale]", "page_client-reference-manifest.js"),
    rawBudget: 170_000,
    gzipBudget: 50_000,
  },
  {
    template: "listing",
    manifestPath: path.join(NEXT_DIR, "server", "app", "[locale]", "journal", "page_client-reference-manifest.js"),
    rawBudget: 170_000,
    gzipBudget: 50_000,
  },
  {
    template: "article",
    manifestPath: path.join(NEXT_DIR, "server", "app", "[locale]", "journal", "[slug]", "page_client-reference-manifest.js"),
    rawBudget: 171_000,
    gzipBudget: 50_000,
  },
  {
    template: "community",
    manifestPath: path.join(NEXT_DIR, "server", "app", "[locale]", "community", "page_client-reference-manifest.js"),
    rawBudget: 170_000,
    gzipBudget: 50_000,
  },
];

function ensureBuildArtifacts() {
  if (!fs.existsSync(NEXT_DIR)) {
    throw new Error("Missing .next build artifacts. Run `npm run build` first.");
  }
}

function loadManifest(manifestPath) {
  const code = fs.readFileSync(manifestPath, "utf8");
  const sandbox = { globalThis: {} };
  vm.runInNewContext(code, sandbox, { filename: manifestPath });

  const manifests = sandbox.globalThis.__RSC_MANIFEST || {};
  const key = Object.keys(manifests)[0];
  if (!key) {
    throw new Error(`No RSC manifest key found in ${manifestPath}`);
  }

  return manifests[key];
}

function collectAssetPaths(manifest) {
  const assetPaths = new Set();

  for (const list of Object.values(manifest.entryJSFiles || {})) {
    for (const asset of list || []) {
      assetPaths.add(String(asset).replace(/^\/_next\//, ""));
    }
  }

  for (const list of Object.values(manifest.entryCSSFiles || {})) {
    for (const asset of list || []) {
      const assetPath = typeof asset === "string" ? asset : asset?.path;
      if (assetPath) {
        assetPaths.add(String(assetPath).replace(/^\/_next\//, ""));
      }
    }
  }

  for (const clientModule of Object.values(manifest.clientModules || {})) {
    for (const asset of clientModule.chunks || []) {
      assetPaths.add(String(asset).replace(/^\/_next\//, ""));
    }
  }

  return Array.from(assetPaths);
}

function measureAssets(assetPaths) {
  let rawBytes = 0;
  let gzipBytes = 0;
  const missingAssets = [];

  for (const assetPath of assetPaths) {
    const fullPath = path.join(NEXT_DIR, assetPath);
    if (!fs.existsSync(fullPath)) {
      missingAssets.push(assetPath);
      continue;
    }

    const content = fs.readFileSync(fullPath);
    rawBytes += content.length;
    gzipBytes += zlib.gzipSync(content, { level: 9 }).length;
  }

  return { rawBytes, gzipBytes, missingAssets };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function main() {
  ensureBuildArtifacts();

  const generatedAt = new Date().toISOString();
  const report = {
    generated_at: generatedAt,
    templates: [],
  };

  let hasFailure = false;

  console.log("\nPerformance budget check:\n");

  for (const config of TEMPLATE_CONFIG) {
    if (!fs.existsSync(config.manifestPath)) {
      throw new Error(`Missing manifest: ${path.relative(ROOT, config.manifestPath)}`);
    }

    const manifest = loadManifest(config.manifestPath);
    const assetPaths = collectAssetPaths(manifest);
    const { rawBytes, gzipBytes, missingAssets } = measureAssets(assetPaths);

    const rawPass = rawBytes <= config.rawBudget;
    const gzipPass = gzipBytes <= config.gzipBudget;
    const pass = rawPass && gzipPass && missingAssets.length === 0;

    if (!pass) {
      hasFailure = true;
    }

    const row = {
      template: config.template,
      assets: assetPaths.length,
      raw_bytes: rawBytes,
      raw_budget: config.rawBudget,
      gzip_bytes: gzipBytes,
      gzip_budget: config.gzipBudget,
      missing_assets: missingAssets,
      pass,
    };

    report.templates.push(row);

    console.log(
      `- ${config.template}: ${pass ? "PASS" : "FAIL"} | raw ${formatBytes(rawBytes)} / ${formatBytes(
        config.rawBudget
      )} | gzip ${formatBytes(gzipBytes)} / ${formatBytes(config.gzipBudget)} | assets ${assetPaths.length}`
    );

    if (missingAssets.length > 0) {
      console.log(`  missing assets: ${missingAssets.slice(0, 3).join(", ")}${missingAssets.length > 3 ? "..." : ""}`);
    }
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`\nReport written to ${path.relative(ROOT, OUT_PATH)}\n`);

  if (hasFailure) {
    process.exit(1);
  }
}

main();
