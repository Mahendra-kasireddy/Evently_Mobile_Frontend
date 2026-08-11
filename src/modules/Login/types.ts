export type LoginStep = 'phone' | 'otp';

export interface SendOtpResponseDTO {
  requestId: string;
  sentTo: string;
  /** Present only in non-production (stub) mode, so the flow is testable without SMS. */
  devCode?: string;
}

export interface VerifyOtpUserDTO {
  id: string;
  name: string;
  phone: string;
  phoneVerified: boolean;
  city: string;
  roles: string[];
  status: string;
}

export interface VerifyOtpResponseDTO {
  token: string;
  refreshToken: string;
  isNewUser: boolean;
  user: VerifyOtpUserDTO;
}
