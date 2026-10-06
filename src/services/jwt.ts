const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** Minimal base64 decode — RN's Hermes runtime has no global `atob`, unlike a browser. */
function base64Decode(input: string): string {
  let str = input.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  let output = '';
  let buffer = 0;
  let bits = 0;
  for (const char of str) {
    if (char === '=') break;
    const idx = BASE64_CHARS.indexOf(char);
    if (idx === -1) continue;
    buffer = (buffer << 6) | idx;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode((buffer >> bits) & 0xff);
    }
  }
  return output;
}

/** Reads the `roles` claim out of a JWT's payload without verifying the signature — the
 * server is the source of truth; this is only used to drive client-side UI branching. */
export function decodeJwtRoles(token: string): string[] {
  try {
    const payloadSegment = token.split('.')[1];
    if (!payloadSegment) return [];
    const json = base64Decode(payloadSegment);
    const payload = JSON.parse(json) as { roles?: unknown };
    return Array.isArray(payload.roles) ? payload.roles.filter((r): r is string => typeof r === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Seconds-since-epoch expiry of a JWT, or null when it carries none or is
 * unreadable. Unverified, like `decodeJwtRoles` — used only to decide whether
 * a token is worth handing to the web dashboard before the server sees it.
 */
export function decodeJwtExp(token: string): number | null {
  try {
    const payloadSegment = token.split('.')[1];
    if (!payloadSegment) return null;
    const payload = JSON.parse(base64Decode(payloadSegment)) as { exp?: unknown };
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
}

/** True when the token has at least `marginSeconds` of life left. */
export function isJwtFresh(token: string, marginSeconds = 60): boolean {
  const exp = decodeJwtExp(token);
  if (exp === null) return true; // nothing to judge by — let the server decide
  return exp - marginSeconds > Date.now() / 1000;
}
