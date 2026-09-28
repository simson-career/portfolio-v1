import "server-only";

type RateRecord = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const records = new Map<string, RateRecord>();

export function getRequestIdentity(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return forwarded || realIp || "local";
}

export function checkRateLimit(identity: string) {
  const now = Date.now();
  const existing = records.get(identity);

  if (!existing || now >= existing.resetAt) {
    const fresh = { count: 1, resetAt: now + WINDOW_MS };
    records.set(identity, fresh);
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt: fresh.resetAt };
  }

  if (existing.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;

  if (records.size > 2000) {
    for (const [key, record] of records) {
      if (now >= record.resetAt) records.delete(key);
    }
  }

  return {
    allowed: true,
    remaining: MAX_REQUESTS - existing.count,
    resetAt: existing.resetAt,
  };
}

export const rateLimitPolicy = {
  limit: MAX_REQUESTS,
  windowMs: WINDOW_MS,
};
