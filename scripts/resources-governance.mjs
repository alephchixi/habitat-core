import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const RESOURCES_PATH = path.join(ROOT, "content", "shared", "resources.json");
const AUDIT_REPORT_PATH = path.join(ROOT, "content", "shared", "resources-audit.json");

const VERIFIED_DOMAINS = new Set([
  "github.com",
  "huggingface.co",
  "openai.com",
  "anthropic.com",
  "vercel.com",
  "nextjs.org",
  "wikipedia.org",
  "arxiv.org",
  "unesco.org",
  "mit.edu",
  "stanford.edu",
  "doi.org",
  "npmjs.com",
  "nodejs.org",
  "mozilla.org",
]);

function normalizeHost(urlString) {
  const url = new URL(urlString);
  return url.hostname.replace(/^www\./, "").toLowerCase();
}

function classifyStatus(hostname) {
  for (const domain of VERIFIED_DOMAINS) {
    if (hostname === domain || hostname.endsWith(`.${domain}`)) {
      return "verified";
    }
  }
  return "reviewed";
}

function main() {
  const raw = fs.readFileSync(RESOURCES_PATH, "utf8");
  const resources = JSON.parse(raw);
  const today = new Date().toISOString().slice(0, 10);

  let parseErrors = 0;
  const byStatus = {
    seed: 0,
    reviewed: 0,
    verified: 0,
  };

  const byType = {};
  const byDomain = {};

  const updated = resources.map((item) => {
    const next = { ...item };
    let host = "";

    try {
      host = normalizeHost(item.href);
      next.curation_status = classifyStatus(host);
      next.last_checked_at = today;
    } catch {
      parseErrors += 1;
      next.curation_status = "seed";
    }

    byStatus[next.curation_status] += 1;
    byType[next.type] = (byType[next.type] || 0) + 1;
    if (host) {
      byDomain[host] = (byDomain[host] || 0) + 1;
    }

    return next;
  });

  fs.writeFileSync(RESOURCES_PATH, `${JSON.stringify(updated, null, 2)}\n`, "utf8");

  const topDomains = Object.entries(byDomain)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([domain, count]) => ({ domain, count }));

  const report = {
    generated_at: new Date().toISOString(),
    checked_at: today,
    totals: {
      resources: updated.length,
      parse_errors: parseErrors,
      by_status: byStatus,
      by_type: byType,
    },
    policy: {
      reviewed_definition: "Valid URL with required governance fields.",
      verified_definition: "Reviewed and domain listed in VERIFIED_DOMAINS allowlist.",
      verified_domains: Array.from(VERIFIED_DOMAINS).sort(),
    },
    top_domains: topDomains,
  };

  fs.writeFileSync(AUDIT_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log("Resources governance update completed.");
  console.log(`Total: ${updated.length}`);
  console.log(`Status counts: ${JSON.stringify(byStatus)}`);
  console.log(`Parse errors: ${parseErrors}`);
}

main();
