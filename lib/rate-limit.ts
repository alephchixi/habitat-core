type MemoryBucket = {
  count: number;
  resetAt: number;
};

type UpstashPipelineResult = Array<{ result?: unknown } | unknown>;

export type RateLimitResult = {
  allowed: boolean;
  count: number;
  remaining: number;
  retryAfterMs: number;
  resetAt: number;
};

export type RateLimitInput = {
  bucket: string;
  key: string;
  limit: number;
  windowMs: number;
};

const memoryStore = new Map<string, MemoryBucket>();
let memoryCleanupAt = 0;

function normalizeRateKey(bucket: string, key: string): string {
  const normalizedBucket = bucket.replace(/[^a-zA-Z0-9:_-]/g, "_");
  const normalizedKey = key.replace(/[^a-zA-Z0-9:_-]/g, "_");
  return `${normalizedBucket}:${normalizedKey}`;
}

function maybeCleanupMemory(now: number) {
  if (now < memoryCleanupAt) return;

  for (const [key, state] of memoryStore.entries()) {
    if (state.resetAt <= now) {
      memoryStore.delete(key);
    }
  }

  memoryCleanupAt = now + 60_000;
}

function consumeMemoryRateLimit(input: RateLimitInput): RateLimitResult {
  const now = Date.now();
  maybeCleanupMemory(now);

  const key = normalizeRateKey(input.bucket, input.key);
  const current = memoryStore.get(key);

  if (!current || now > current.resetAt) {
    const resetAt = now + input.windowMs;
    memoryStore.set(key, { count: 1, resetAt });

    return {
      allowed: true,
      count: 1,
      remaining: Math.max(0, input.limit - 1),
      retryAfterMs: 0,
      resetAt,
    };
  }

  const nextCount = current.count + 1;
  current.count = nextCount;
  memoryStore.set(key, current);

  const allowed = nextCount <= input.limit;
  return {
    allowed,
    count: nextCount,
    remaining: Math.max(0, input.limit - nextCount),
    retryAfterMs: allowed ? 0 : Math.max(0, current.resetAt - now),
    resetAt: current.resetAt,
  };
}

function getUpstashConfig():
  | { url: string; token: string; prefix: string }
  | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  const prefix = process.env.RATE_LIMIT_PREFIX?.trim() || "habitat:ratelimit";
  return {
    url: url.replace(/\/$/, ""),
    token,
    prefix,
  };
}

function readPipelineResult(raw: unknown, index: number): unknown {
  if (!Array.isArray(raw)) return undefined;
  const entry = (raw as UpstashPipelineResult)[index];
  if (entry && typeof entry === "object" && "result" in (entry as Record<string, unknown>)) {
    return (entry as { result?: unknown }).result;
  }

  return entry;
}

async function consumeUpstashRateLimit(input: RateLimitInput): Promise<RateLimitResult | null> {
  const config = getUpstashConfig();
  if (!config) return null;

  const now = Date.now();
  const redisKey = `${config.prefix}:${normalizeRateKey(input.bucket, input.key)}`;

  try {
    const response = await fetch(`${config.url}/pipeline`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${config.token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["PEXPIRE", redisKey, String(input.windowMs), "NX"],
        ["PTTL", redisKey],
      ]),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json().catch(() => null)) as unknown;
    const countRaw = readPipelineResult(payload, 0);
    const ttlRaw = readPipelineResult(payload, 2);

    const count = Number(countRaw);
    const ttlMs = Number(ttlRaw);
    if (!Number.isFinite(count) || count <= 0) {
      return null;
    }

    const retryAfterMs = Number.isFinite(ttlMs) && ttlMs > 0 ? ttlMs : input.windowMs;
    const resetAt = now + retryAfterMs;
    const allowed = count <= input.limit;

    return {
      allowed,
      count,
      remaining: Math.max(0, input.limit - count),
      retryAfterMs: allowed ? 0 : retryAfterMs,
      resetAt,
    };
  } catch {
    return null;
  }
}

export async function consumeRateLimit(input: RateLimitInput): Promise<RateLimitResult> {
  const remoteResult = await consumeUpstashRateLimit(input);
  if (remoteResult) {
    return remoteResult;
  }

  return consumeMemoryRateLimit(input);
}

