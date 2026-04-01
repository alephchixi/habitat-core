const LOCAL_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
]);

function normalizeHostCandidate(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return "";

  if (trimmed.includes("://")) {
    try {
      return new URL(trimmed).hostname.toLowerCase();
    } catch {
      return "";
    }
  }

  const first = trimmed.split(",")[0]?.trim() || "";
  if (!first) return "";

  if (first.startsWith("[")) {
    const closing = first.indexOf("]");
    return closing > 1 ? first.slice(1, closing).toLowerCase() : "";
  }

  const colonIndex = first.indexOf(":");
  if (colonIndex === -1) return first;

  return first.slice(0, colonIndex);
}

function isPrivateIpv4(hostname: string): boolean {
  const parts = hostname.split(".");
  if (parts.length !== 4) return false;

  const numbers = parts.map((part) => Number(part));
  if (numbers.some((value) => !Number.isInteger(value) || value < 0 || value > 255)) {
    return false;
  }

  const [a, b] = numbers;

  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;

  return false;
}

export function isLocalNetworkHostname(hostname: string): boolean {
  const normalized = hostname.trim().toLowerCase();
  if (!normalized) return false;

  if (LOCAL_HOSTNAMES.has(normalized)) return true;
  if (isPrivateIpv4(normalized)) return true;

  if (normalized.endsWith(".local")) {
    return true;
  }

  return false;
}

export function isLocalNetworkRequestFromHeaders(
  headersLike: Pick<Headers, "get">
): boolean {
  const candidates = [
    headersLike.get("x-forwarded-host"),
    headersLike.get("host"),
    headersLike.get("origin"),
    headersLike.get("referer"),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    const hostname = normalizeHostCandidate(candidate);
    if (!hostname) continue;

    if (isLocalNetworkHostname(hostname)) {
      return true;
    }
  }

  return false;
}
