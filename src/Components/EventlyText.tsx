import { Text, type TextProps } from 'react-native';
import { typography } from '../theme';

export type EventlyTextVariant = 'h1' | 'h2' | 'subtitle' | 'body' | 'caption';

interface EventlyTextProps extends TextProps {
  variant?: EventlyTextVariant;
}

/** The one Text component every screen should use, so typography stays consistent app-wide. */
export function EventlyText({ variant = 'body', style, ...rest }: EventlyTextProps) {
  return <Text style={[typography[variant], style]} {...rest} />;
}

export default EventlyText;
