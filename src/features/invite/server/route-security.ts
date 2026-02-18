import { NextResponse } from 'next/server';

type RateLimitResult = {
  ok: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

type RouteSecurityOptions = {
  limit?: number;
  windowMs?: number;
};

const DEFAULT_RATE_LIMIT_LIMIT = 20;
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60_000;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const parseUrlHost = (value: string | null): string | null => {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).host;
  } catch {
    return null;
  }
};

const getRequestHost = (request: Request) => {
  return new URL(request.url).host;
};

export const getClientIp = (request: Request) => {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'unknown';
  }

  return (
    request.headers.get('x-real-ip')
    || request.headers.get('cf-connecting-ip')
    || 'unknown'
  );
};

export const buildRateLimitKey = (scope: string, request: Request) => {
  return `${scope}|${getClientIp(request)}`;
};

export const validateSameOrigin = (request: Request): boolean => {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  const requestHost = getRequestHost(request);
  const originHost = parseUrlHost(request.headers.get('origin'));
  const refererHost = parseUrlHost(request.headers.get('referer'));

  const sourceHost = originHost ?? refererHost;
  if (!sourceHost) {
    return false;
  }

  return sourceHost === requestHost;
};

export const checkRateLimit = (
  key: string,
  options: RouteSecurityOptions = {},
): RateLimitResult => {
  const limit = options.limit ?? DEFAULT_RATE_LIMIT_LIMIT;
  const windowMs = options.windowMs ?? DEFAULT_RATE_LIMIT_WINDOW_MS;
  const now = Date.now();

  const existing = rateLimitStore.get(key);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    rateLimitStore.set(key, {
      count: 1,
      resetAt,
    });

    return {
      ok: true,
      limit,
      remaining: Math.max(limit - 1, 0),
      resetAt,
    };
  }

  if (existing.count >= limit) {
    return {
      ok: false,
      limit,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;

  return {
    ok: true,
    limit,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
};

const toRetryAfterSeconds = (resetAt: number) => {
  return Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
};

export const createRateLimitResponse = (result: RateLimitResult) => {
  return NextResponse.json(
    {
      message: '요청이 너무 빈번합니다. 잠시 후 다시 시도해주세요.',
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(toRetryAfterSeconds(result.resetAt)),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.floor(result.resetAt / 1000)),
      },
    },
  );
};

export const createOriginErrorResponse = () => {
  return NextResponse.json(
    {
      message: '요청 출처가 유효하지 않습니다.',
    },
    { status: 403 },
  );
};
