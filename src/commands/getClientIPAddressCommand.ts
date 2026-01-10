import type { Request } from 'express';

export default function (req: Request): string | null {
  const forwarded = req.headers['x-forwarded-for'];

  if (typeof forwarded === 'string') {
    // X-Forwarded-For can be a list: client, proxy1, proxy2
    return forwarded.split(',')[0]!.trim();
  }

  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0]!;
  }

  return req.socket.remoteAddress ?? null;
}
