import { MOBILE_PATTERN, OTP_CODE_PATTERN } from './constants';

export function isValidMobile(mobile: string): boolean {
  return MOBILE_PATTERN.test(mobile);
}

export function isValidOtpCode(code: string): boolean {
  return OTP_CODE_PATTERN.test(code);
}
