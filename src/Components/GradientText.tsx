import { useId, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type NativeSyntheticEvent,
  type StyleProp,
  type TextLayoutEventData,
  type TextLayoutLine,
  type TextStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { fontFor } from '../theme';

interface GradientTextProps {
  children: string;
  /** Two or three stops, left to right. */
  colors: readonly string[];
  /** Size, weight, line height. A colour here is ignored — the gradient is the colour. */
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

/**
 * Text painted with a gradient, wrapping like ordinary text.
 *
 * React Native cannot fill text with a gradient on its own, and the usual
 * answer — a masked view — is a native module and a rebuild. This draws it
 * with the SVG library the app already ships: an invisible copy of the text
 * lays itself out (so wrapping, line height and accessibility are exactly a
 * normal Text's), reports where each line fell, and the same lines are drawn
 * over it in SVG with the gradient as their fill.
 */
export function GradientText({ children, colors, style, numberOfLines }: GradientTextProps) {
  const id = `gt${useId().replace(/:/g, '')}`;
  const [lines, setLines] = useState<TextLayoutLine[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const flat = StyleSheet.flatten(style) ?? {};
  const fontFamily = flat.fontFamily ?? fontFor(flat.fontWeight);
  const fontSize = flat.fontSize ?? 16;
  const letterSpacing = flat.letterSpacing ?? 0;
  // The face carries the weight (see fontFor), and the gradient is the colour.
  const layoutStyle: TextStyle = { ...flat };
  delete layoutStyle.fontWeight;
  delete layoutStyle.color;

  const onTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const next = numberOfLines ? e.nativeEvent.lines.slice(0, numberOfLines) : e.nativeEvent.lines;
    setLines(next);
  };

  const step = colors.length > 1 ? 1 / (colors.length - 1) : 1;

  return (
    <View
      onLayout={e => setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
    >
      {/* The real text: lays out, is read by screen readers, but is not seen. */}
      <Text
        style={[layoutStyle, styles.hidden, { fontFamily }]}
        numberOfLines={numberOfLines}
        onTextLayout={onTextLayout}
      >
        {children}
      </Text>
      {size.width > 0 && lines.length > 0 ? (
        <Svg
          style={StyleSheet.absoluteFill}
          width={size.width}
          height={size.height}
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Defs>
            <LinearGradient id={id} x1="0" y1="0" x2={size.width} y2="0" gradientUnits="userSpaceOnUse">
              {colors.map((c, i) => (
                <Stop key={`${c}${i}`} offset={i * step} stopColor={c} />
              ))}
            </LinearGradient>
          </Defs>
          {lines.map((line, i) => (
            <SvgText
              key={i}
              x={line.x}
              y={line.y + line.ascender}
              fill={`url(#${id})`}
              fontFamily={fontFamily}
              fontSize={fontSize}
              letterSpacing={letterSpacing}
            >
              {line.text.replace(/\s+$/, '')}
            </SvgText>
          ))}
        </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hidden: { color: 'transparent' },
});

export default GradientText;
