import {
  DIAL_CODE,
  MOBILE_LENGTH,
  MOBILE_PATTERN,
  OTP_CODE_PATTERN,
  OTP_LENGTH,
} from './constants';

export function isValidMobile(mobile: string): boolean {
  return MOBILE_PATTERN.test(mobile);
}

export function isValidOtpCode(code: string): boolean {
  return OTP_CODE_PATTERN.test(code);
}

/** Keeps digits only, so a paste or an autofill of "+91 98490 12345" still lands as ten digits. */
export function sanitizeDigits(value: string, maxLength: number): string {
  return value.replace(/\D/g, '').slice(0, maxLength);
}

export function appendDigit(
  current: string,
  digit: string,
  maxLength: number,
): string {
  if (current.length >= maxLength) return current;
  return sanitizeDigits(current + digit, maxLength);
}

export function removeLastDigit(current: string): string {
  return current.slice(0, -1);
}

/**
 * 5 + 5, the grouping Indian numbers are read aloud in. Display only — the
 * field's value stays bare digits, so nothing downstream has to strip a space.
 */
export function formatMobile(mobile: string): string {
  const digits = sanitizeDigits(mobile, MOBILE_LENGTH);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

/**
 * What the OTP screen says it texted. Prefers the number the server reports it
 * sent to, because a stub/dev backend may rewrite it — showing the number the
 * customer typed when the code went somewhere else is how "I never got it"
 * turns into an unfixable support ticket.
 */
export function formatSentTo(
  sentTo: string | null,
  fallbackMobile: string,
): string {
  const source = sentTo?.trim()
    ? sentTo.trim()
    : `${DIAL_CODE}${fallbackMobile}`;
  const digits = source.replace(/\D/g, '');
  const local =
    digits.length > MOBILE_LENGTH ? digits.slice(-MOBILE_LENGTH) : digits;
  const dial =
    digits.length > MOBILE_LENGTH
      ? `+${digits.slice(0, digits.length - MOBILE_LENGTH)}`
      : DIAL_CODE;
  return `${dial} ${formatMobile(local)}`.trim();
}

/** `0:07`, never `0:7`. */
export function formatCooldown(seconds: number): string {
  const safe = Math.max(0, seconds);
  return `0:${String(safe).padStart(2, '0')}`;
}

export function otpDigits(code: string): string[] {
  return Array.from({ length: OTP_LENGTH }, (_, index) => code[index] ?? '');
}

/** The cell the next tap fills — the caret, in a field that has no caret. */
export function activeOtpIndex(code: string): number {
  return Math.min(code.length, OTP_LENGTH - 1);
}
