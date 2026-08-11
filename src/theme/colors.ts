export const colors = {
  primary: '#4F46E5',
  primaryDark: '#3730A3',
  accent: '#F59E0B',
  background: '#FFFFFF',
  surface: '#F3F4F6',
  border: '#E5E7EB',
  text: '#111827',
  textMuted: '#6B7280',
  onPrimary: '#FFFFFF',
  onPrimaryMuted: 'rgba(255,255,255,0.8)',
  overlay: 'rgba(255,255,255,0.14)',
  danger: '#DC2626',
  success: '#16A34A',
  tierGold: '#D4AF37',
  tierSilver: '#9CA3AF',
  tierPlatinum: '#8B5CF6',
  inverseBackground: '#0B0B0F',
  inverseText: '#FFFFFF',
  inverseTextMuted: 'rgba(255,255,255,0.7)',
} as const;

export type Colors = typeof colors;
