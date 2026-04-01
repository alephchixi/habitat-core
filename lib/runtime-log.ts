import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DEFAULT_RUNTIME_LOG_ROOT = path.join(os.tmpdir(), "habitat-runtime-logs");
const RUNTIME_LOG_ROOT =
  process.env.HABITAT_RUNTIME_LOG_DIR?.trim() || DEFAULT_RUNTIME_LOG_ROOT;
const RETENTION_DAYS = Number(process.env.RUNTIME_LOG_RETENTION_DAYS || "14");
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
let lastCleanupAt = 0;

function getHashSalt(): string {
  return process.env.RUNTIME_LOG_HASH_SALT || "habitat-runtime-log-salt";
}

function maybeCleanupExpiredLogs() {
  if (!Number.isFinite(RETENTION_DAYS) || RETENTION_DAYS <= 0) {
    return;
  }

  const now = Date.now();
  if (now - lastCleanupAt < CLEANUP_INTERVAL_MS) {
    return;
  }
  lastCleanupAt = now;

  const cutoffMs = now - RETENTION_DAYS * 24 * 60 * 60 * 1000;

  try {
    const entries = fs.readdirSync(RUNTIME_LOG_ROOT, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".ndjson")) {
        continue;
      }

      const fullPath = path.join(RUNTIME_LOG_ROOT, entry.name);
      const stat = fs.statSync(fullPath);
      if (stat.mtimeMs < cutoffMs) {
        fs.rmSync(fullPath, { force: true });
      }
    }
  } catch {
    // Best-effort cleanup; never block runtime writes.
  }
}

export function resolveRuntimeLogPath(filename: string): string {
  return path.join(RUNTIME_LOG_ROOT, filename);
}

export function appendRuntimeNdjson(filename: string, payload: Record<string, unknown>) {
  fs.mkdirSync(RUNTIME_LOG_ROOT, { recursive: true });
  maybeCleanupExpiredLogs();

  const filePath = resolveRuntimeLogPath(filename);
  fs.appendFileSync(filePath, `${JSON.stringify(payload)}\n`, "utf8");
}

export function hashSensitiveValue(value: string): string {
  return crypto
    .createHash("sha256")
    .update(`${getHashSalt()}:${value}`)
    .digest("hex")
    .slice(0, 24);
}

export function anonymizeNullable(value: string | null | undefined): string {
  if (!value) return "none";
  return hashSensitiveValue(value.trim().toLowerCase());
}
