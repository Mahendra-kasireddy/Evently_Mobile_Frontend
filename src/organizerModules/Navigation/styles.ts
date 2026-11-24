import { Platform, StyleSheet } from 'react-native';
import { HOME_ACCENT, HOME_INK, HOME_PAPER } from '../../modules/Home/design';
import { textColor, typography } from '../../theme';

/** The organizer shell, on the customer app's canvas and cards. */
export const shellStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: HOME_PAPER.canvas },
  web: { flex: 1 },
});

export const topBarStyles = StyleSheet.create({
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HOME_PAPER.card,
    borderWidth: 1,
    borderColor: HOME_PAPER.hairline,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: HOME_ACCENT.sindoor,
    borderWidth: 1.5,
    borderColor: HOME_PAPER.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: textColor.textOnPrimary, ...typography.label },
});

/* The bar: the customer bar's floating card, without the + notch. */
const BAR_HEIGHT = 66;

export const tabBarStyles = StyleSheet.create({
  wrap: {
    backgroundColor: HOME_PAPER.canvas,
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  bar: {
    height: BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderRadius: 24,
    backgroundColor: HOME_PAPER.card,
    ...Platform.select({
      ios: {
        shadowColor: HOME_INK.night,
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 6,
        borderWidth: 1,
        borderColor: HOME_PAPER.hairline,
      },
    }),
  },
});
