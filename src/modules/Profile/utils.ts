import type { ProfileViewModel, UserDetailsDTO } from './types';

function titleizeRole(roles: string[]): string {
  const role = roles[0] ?? 'customer';
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function initialsOf(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return 'U';
  const parts = trimmed.split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

export function mapProfile(user: UserDetailsDTO): ProfileViewModel {
  return {
    displayName: user.name || 'there',
    initials: initialsOf(user.name || user.phone),
    role: titleizeRole(user.roles),
    phone: user.phone,
    city: user.city || 'Not set',
    memberSince: new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
  };
}
