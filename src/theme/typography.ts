import type { TextStyle } from 'react-native';

export const typography: Record<'h1' | 'h2' | 'subtitle' | 'body' | 'caption', TextStyle> = {
  h1: { fontSize: 24, fontWeight: '700' },
  h2: { fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 15, fontWeight: '600' },
  body: { fontSize: 14, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '400' },
};
