export interface UserDetailsDTO {
  id: string;
  name: string;
  phone: string;
  email?: string;
  phoneVerified: boolean;
  city: string;
  roles: string[];
  status: string;
  createdAt: string;
}

export interface ProfileViewModel {
  displayName: string;
  initials: string;
  role: string;
  phone: string;
  city: string;
  memberSince: string;
}
