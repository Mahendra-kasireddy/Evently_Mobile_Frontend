# Evently mobile — typography refactor

Inter is now the only typeface, every line of copy renders through `<AppText>`, and every text style in a StyleSheet uses a token from `theme/typography.ts` rather than raw values. No features, logic, navigation, API calls or state were touched.

## 1. typography.ts, fonts.ts, textColors.ts and AppText

### src/theme/typography.ts
```ts
import type { TextStyle } from 'react-native';
import { fontFamilies } from './fonts';

/**
 * Evently's type scale. Every piece of text in the app is one of these twelve.
 *
 * | variant     | size | line | weight | tracking |
 * |-------------|------|------|--------|----------|
 * | display     | 32   | 40   | 700    | -0.5     |
 * | h1          | 28   | 34   | 700    | -0.5     |
 * | h2          | 20   | 26   | 600    | -0.25    |
 * | h3          | 17   | 22   | 600    | 0        |
 * | bodyLarge   | 16   | 24   | 400    | 0        |
 * | body        | 14   | 20   | 400    | 0        |
 * | bodySmall   | 13   | 18   | 400    | 0        |
 * | button      | 16   | 20   | 500    | 0.2      |
 * | buttonSmall | 14   | 18   | 500    | 0.2      |
 * | label       | 12   | 16   | 500    | 0.5      |
 * | caption     | 12   | 16   | 400    | 0        |
 * | overline    | 11   | 14   | 600    | 1.0 (UPPERCASE) |
 *
 * Weight is carried by `fontFamily` (one Inter face per weight), never by
 * `fontWeight` — see theme/fonts.ts.
 *
 * Where each one goes:
 *  - display: hero text, event banner title, amounts on checkout/success,
 *    dashboard numbers
 *  - h1: screen titles, Home greeting
 *  - h2: section headings, empty-state titles, profile name, totals
 *  - h3: card titles, navigation header titles, card prices, list names
 *  - bodyLarge: long descriptions, profile menu items
 *  - body: general text; bodySmall: secondary info inside cards
 *  - button / buttonSmall: primary buttons / small buttons and links
 *  - label: chips, tabs, badges, form labels; caption: dates, times, helpers,
 *    errors; overline: the small uppercase kicker above a heading
 */
export type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bodyLarge'
  | 'body'
  | 'bodySmall'
  | 'button'
  | 'buttonSmall'
  | 'label'
  | 'caption'
  | 'overline';

const style = (
  fontSize: number,
  lineHeight: number,
  fontFamily: string,
  letterSpacing: number,
): TextStyle => ({ fontSize, lineHeight, fontFamily, letterSpacing });

export const typography: Record<TypographyVariant, TextStyle> = {
  display: style(32, 40, fontFamilies.bold, -0.5),
  h1: style(28, 34, fontFamilies.bold, -0.5),
  h2: style(20, 26, fontFamilies.semibold, -0.25),
  h3: style(17, 22, fontFamilies.semibold, 0),
  bodyLarge: style(16, 24, fontFamilies.regular, 0),
  body: style(14, 20, fontFamilies.regular, 0),
  bodySmall: style(13, 18, fontFamilies.regular, 0),
  button: style(16, 20, fontFamilies.medium, 0.2),
  buttonSmall: style(14, 18, fontFamilies.medium, 0.2),
  label: style(12, 16, fontFamilies.medium, 0.5),
  caption: style(12, 16, fontFamilies.regular, 0),
  overline: {
    ...style(11, 14, fontFamilies.semibold, 1),
    textTransform: 'uppercase',
  },
};

/** The numeric weight each variant is drawn at — for tests and docs. */
export const typographyWeights: Record<
  TypographyVariant,
  TextStyle['fontWeight']
> = {
  display: '700',
  h1: '700',
  h2: '600',
  h3: '600',
  bodyLarge: '400',
  body: '400',
  bodySmall: '400',
  button: '500',
  buttonSmall: '500',
  label: '500',
  caption: '400',
  overline: '600',
};

/**
 * The same steps for a TextInput. A `lineHeight` on a single-line input
 * shifts the caret and the text off centre on Android, so inputs take the
 * size, face and tracking of a variant and let the field set its own leading.
 */
const withoutLeading = ({ lineHeight: _lh, ...rest }: TextStyle): TextStyle =>
  rest;
export const inputTypography = {
  body: withoutLeading(typography.body),
  bodyLarge: withoutLeading(typography.bodyLarge),
} as const;

/**
 * Bottom tab bar labels: 11 / 500. The navigator draws these itself (no
 * AppText), so it gets its own token rather than a thirteenth variant.
 */
export const tabBarLabel: TextStyle = {
  fontSize: 11,
  lineHeight: 14,
  fontFamily: fontFamilies.medium,
  letterSpacing: 0,
};

/** No text in the app is set smaller than this. */
export const MIN_FONT_SIZE = 11;

/** Text grows with the system font size, but never past 1.5×. */
export const MAX_FONT_SIZE_MULTIPLIER = 1.5;

```

### src/theme/fonts.ts
```ts
import { Platform, type TextStyle } from 'react-native';

/**
 * Inter, bundled with the app — the only typeface Evently's UI uses.
 *
 * Four faces, one per weight the design system allows (400 / 500 / 600 / 700).
 * Android ignores `fontWeight` on a custom family and quietly renders Regular,
 * so every weight is its own face and is always selected by name.
 *
 * The name differs per platform: Android resolves a family by the asset's file
 * name (`Inter_600SemiBold`), iOS by the face's PostScript name
 * (`Inter-SemiBold`).
 */
const face = (ios: string, android: string): string =>
  Platform.select({ ios, android, default: android }) as string;

export const fontFamilies = {
  regular: face('Inter-Regular', 'Inter_400Regular'),
  medium: face('Inter-Medium', 'Inter_500Medium'),
  semibold: face('Inter-SemiBold', 'Inter_600SemiBold'),
  bold: face('Inter-Bold', 'Inter_700Bold'),
} as const;

export type FontWeightName = keyof typeof fontFamilies;

/**
 * Weight-only overrides, for the rare line that must be heavier than its
 * variant (a name inside a sentence, a notification title set in `body`).
 * Spread one after a variant: `{ ...typography.body, ...fontWeights.semibold }`.
 */
export const fontWeights: Record<FontWeightName, TextStyle> = {
  regular: { fontFamily: fontFamilies.regular },
  medium: { fontFamily: fontFamilies.medium },
  semibold: { fontFamily: fontFamilies.semibold },
  bold: { fontFamily: fontFamilies.bold },
};

/**
 * The Inter face for a numeric weight. Only four are bundled, so anything
 * else rounds to the nearest: lighter than 400 → Regular, heavier than 700 →
 * Bold. A missing face on Android falls back to Roboto, which is far more
 * visible than a weight being a step off.
 */
export function fontFor(weight: TextStyle['fontWeight']): string {
  switch (weight) {
    case '500':
    case 500:
      return fontFamilies.medium;
    case '600':
    case 600:
      return fontFamilies.semibold;
    case '700':
    case 700:
    case '800':
    case 800:
    case '900':
    case 900:
    case 'bold':
      return fontFamilies.bold;
    default:
      return fontFamilies.regular;
  }
}

```

### src/theme/textColors.ts
```ts
import { colors } from './colors';

/**
 * Text colours, per appearance. Text never picks its own hex — it names one
 * of these and AppText resolves it for the current scheme.
 */
export const textColors = {
  light: {
    textPrimary: '#1A1A1A',
    textSecondary: '#6B6B6B',
    textDisabled: '#A3A3A3',
    textOnPrimary: '#FFFFFF',
    textLink: colors.primary,
    textError: colors.danger,
  },
  dark: {
    textPrimary: '#E6E6E6',
    textSecondary: '#A0A0A0',
    textDisabled: '#5C5C5C',
    textOnPrimary: '#FFFFFF',
    textLink: '#818CF8',
    textError: '#F87171',
  },
} as const;

export type TextColorToken = keyof (typeof textColors)['light'];
export type TextScheme = keyof typeof textColors;

/**
 * The light palette, for StyleSheets. A StyleSheet is static, so it holds the
 * light value; AppText recognises it and swaps in the dark counterpart when
 * the app is drawn dark.
 */
export const textColor = textColors.light;

/**
 * Which appearance text follows.
 *
 * 'light' until the screens' surfaces (backgrounds, cards, sheets) are themed
 * too: following the system today would put #E6E6E6 text on white cards.
 * Flip to 'system' and AppText follows the device setting with no other change.
 */
export const TEXT_APPEARANCE: 'light' | 'system' = 'light';

```

### src/Components/AppText.tsx
```tsx
import {
  StyleSheet,
  Text,
  useColorScheme,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from 'react-native';
import {
  MAX_FONT_SIZE_MULTIPLIER,
  MIN_FONT_SIZE,
  TEXT_APPEARANCE,
  fontFor,
  fontWeights,
  textColors,
  typography,
  type FontWeightName,
  type TextColorToken,
  type TextScheme,
  type TypographyVariant,
} from '../theme';

export interface AppTextProps extends TextProps {
  /** The type-scale step. Defaults to `body`. */
  variant?: TypographyVariant;
  /**
   * A text colour token (`textSecondary`, `textOnPrimary`…) or, for the few
   * brand-coloured lines, a colour value. Defaults to `textPrimary`.
   */
  color?: TextColorToken | (string & {});
  align?: TextStyle['textAlign'];
  /** A heavier/lighter face inside the same variant — use sparingly. */
  weight?: FontWeightName;
  style?: StyleProp<TextStyle>;
}

const LIGHT = textColors.light as Record<string, string>;
const DARK = textColors.dark as Record<string, string>;
/** light hex → dark hex, so static StyleSheet colours follow the scheme. */
const LIGHT_TO_DARK: Record<string, string> = Object.fromEntries(
  Object.keys(LIGHT).map(k => [String(LIGHT[k]).toLowerCase(), DARK[k]]),
);

/** The scheme text is drawn in — see TEXT_APPEARANCE in theme/textColors. */
export function useTextScheme(): TextScheme {
  const system = useColorScheme();
  if (TEXT_APPEARANCE === 'light') return 'light';
  return system === 'dark' ? 'dark' : 'light';
}

function resolveColor(
  color: string | undefined,
  scheme: TextScheme,
): string | undefined {
  if (color == null) return undefined;
  const palette = scheme === 'dark' ? DARK : LIGHT;
  return palette[color] ?? color;
}

/**
 * The one Text component in the app.
 *
 * Every line of copy goes through here so the type scale, the Inter faces,
 * the text colours and the font-scaling cap are applied the same way on every
 * screen. Screens pick a `variant` and a `color` token; `style` is for layout
 * (margins, flex) and the occasional deliberate override.
 */
export function AppText({
  variant = 'body',
  color = 'textPrimary',
  align,
  weight,
  style,
  allowFontScaling = true,
  maxFontSizeMultiplier = MAX_FONT_SIZE_MULTIPLIER,
  ...rest
}: AppTextProps) {
  const scheme = useTextScheme();
  const override = StyleSheet.flatten<TextStyle>(style) ?? {};

  // Order: variant → weight → colour → alignment → style. `style` is the
  // explicit override and always wins.
  const resolved: TextStyle = {
    ...typography[variant],
    ...(weight ? fontWeights[weight] : null),
    color: resolveColor(color, scheme),
    ...(align ? { textAlign: align } : null),
    ...override,
  };

  // Weight is a face, never a `fontWeight` (Android ignores it on Inter).
  if (override.fontWeight != null && override.fontFamily == null) {
    resolved.fontFamily = fontFor(override.fontWeight);
  }
  delete resolved.fontWeight;

  if (
    typeof resolved.fontSize === 'number' &&
    resolved.fontSize < MIN_FONT_SIZE
  ) {
    resolved.fontSize = MIN_FONT_SIZE;
  }

  // A light-palette colour from a static StyleSheet follows the scheme.
  if (scheme === 'dark' && typeof resolved.color === 'string') {
    resolved.color =
      LIGHT_TO_DARK[resolved.color.toLowerCase()] ?? resolved.color;
  }

  return (
    <Text
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={resolved}
      {...rest}
    />
  );
}

export default AppText;

```

## 2. Files changed (216)

**Booking**
- src/modules/Booking/BookingScreen.tsx
- src/modules/Booking/sections/BookingSectionHead.tsx
- src/modules/Booking/sections/EventCard.tsx
- src/modules/Booking/sections/EventTabs.tsx
- src/modules/Booking/sections/EventTicketsSection.tsx
- src/modules/Booking/sections/JumpToGrid.tsx
- src/modules/Booking/sections/WhatNext.tsx
- src/modules/Booking/styles.ts

**BusinessHome**
- src/modules/BusinessHome/sections/BusinessWebView.tsx
- src/modules/BusinessHome/styles.ts

**BusinessRegister**
- src/modules/BusinessRegister/BusinessRegisterScreen.tsx
- src/modules/BusinessRegister/sections/AuthGateSection.tsx
- src/modules/BusinessRegister/sections/SignupDetailsSection.tsx
- src/modules/BusinessRegister/styles.ts

**Chat**
- src/modules/Chat/ChatScreen.tsx
- src/modules/Chat/ConversationScreen.tsx
- src/modules/Chat/sections/ConversationRow.tsx
- src/modules/Chat/sections/SuggestionBar.tsx
- src/modules/Chat/sections/ThreadHeader.tsx
- src/modules/Chat/styles.ts

**CompareQuotes**
- src/modules/CompareQuotes/CompareQuotesScreen.tsx
- src/modules/CompareQuotes/LineByLineScreen.tsx
- src/modules/CompareQuotes/sections/QuoteCardView.tsx
- src/modules/CompareQuotes/sections/RequestWaiting.tsx
- src/modules/CompareQuotes/styles.ts

**GuestList**
- src/modules/GuestList/GuestListScreen.tsx
- src/modules/GuestList/sections/ContactsSheet.tsx
- src/modules/GuestList/sections/EventPicker.tsx
- src/modules/GuestList/sections/GroupFilter.tsx
- src/modules/GuestList/sections/GuestRow.tsx
- src/modules/GuestList/sections/GuestSheet.tsx
- src/modules/GuestList/sections/GuestStats.tsx
- src/modules/GuestList/styles.ts

**Home**
- src/modules/Home/HomeScreen.tsx
- src/modules/Home/SeeAllScreen.tsx
- src/modules/Home/design.ts
- src/modules/Home/sections/Banner.tsx
- src/modules/Home/sections/BasicsCard.tsx
- src/modules/Home/sections/BookedEventCard.tsx
- src/modules/Home/sections/BudgetToggleCard.tsx
- src/modules/Home/sections/CouponSheet.tsx
- src/modules/Home/sections/CurrentEventCard.tsx
- src/modules/Home/sections/EventHero.tsx
- src/modules/Home/sections/EventRow.tsx
- src/modules/Home/sections/EventSummaryCard.tsx
- src/modules/Home/sections/HomeHeader.tsx
- src/modules/Home/sections/HomeHeroPhoto.tsx
- src/modules/Home/sections/HowItWorks.tsx
- src/modules/Home/sections/OccasionGrid.tsx
- src/modules/Home/sections/Offers.tsx
- src/modules/Home/sections/OtherEventsCarousel.tsx
- src/modules/Home/sections/Packages.tsx
- src/modules/Home/sections/PlanSmarter.tsx
- src/modules/Home/sections/SectionHead.tsx
- src/modules/Home/sections/TopOrganizers.tsx
- src/modules/Home/sections/TrustStrip.tsx
- src/modules/Home/styles.ts

**Invitation**
- src/modules/Invitation/InvitationScreen.tsx
- src/modules/Invitation/sections/CountdownBlock.tsx
- src/modules/Invitation/sections/CoverBlock.tsx
- src/modules/Invitation/sections/InvitationArtwork.tsx
- src/modules/Invitation/sections/InvitationOverview.tsx
- src/modules/Invitation/sections/InvitationParts.tsx
- src/modules/Invitation/sections/LiveBlock.tsx
- src/modules/Invitation/sections/MemoriesBlock.tsx
- src/modules/Invitation/sections/MemorySheets.tsx
- src/modules/Invitation/sections/NextStep.tsx
- src/modules/Invitation/sections/SaveTheDate.tsx
- src/modules/Invitation/sections/SectionSwitch.tsx
- src/modules/Invitation/sections/Sheets.tsx
- src/modules/Invitation/sections/StoryBlock.tsx
- src/modules/Invitation/styles.ts

**Join**
- src/modules/Join/JoinScreen.tsx
- src/modules/Join/sections/RequirementNote.tsx
- src/modules/Join/sections/RoleCard.tsx
- src/modules/Join/styles.ts

**LegalSupport**
- src/modules/LegalSupport/ContactScreen.tsx
- src/modules/LegalSupport/LegalSupportScreen.tsx
- src/modules/LegalSupport/sections/LegalSupportRow.tsx
- src/modules/LegalSupport/styles.ts

**Location**
- src/modules/Location/LocationScreen.tsx
- src/modules/Location/sections/LocationDetails.tsx
- src/modules/Location/sections/LocationErrorState.tsx
- src/modules/Location/styles.ts

**Login**
- src/modules/Login/LoginScreen.tsx
- src/modules/Login/sections/AuthCta.tsx
- src/modules/Login/sections/AuthHero.tsx
- src/modules/Login/sections/BusinessEntryCard.tsx
- src/modules/Login/sections/DialCodeSheet.tsx
- src/modules/Login/sections/OtpArt.tsx
- src/modules/Login/sections/OtpEntry.tsx
- src/modules/Login/sections/OtpSafetyNote.tsx
- src/modules/Login/sections/PhoneEntry.tsx
- src/modules/Login/sections/TermsNote.tsx
- src/modules/Login/styles.ts

**NameCapture**
- src/modules/NameCapture/NameGateSheet.tsx
- src/modules/NameCapture/styles.ts

**Notification**
- src/modules/Notification/NotificationScreen.tsx
- src/modules/Notification/sections/NotificationRow.tsx
- src/modules/Notification/styles.ts

**Onboarding**
- src/modules/Onboarding/OnboardingScreen.tsx
- src/modules/Onboarding/styles.ts

**Organizer**
- src/modules/Organizer/OrganizerScreen.tsx
- src/modules/Organizer/ReviewsScreen.tsx
- src/modules/Organizer/sections/AssuranceCard.tsx
- src/modules/Organizer/sections/AvailabilityCard.tsx
- src/modules/Organizer/sections/CoverBanner.tsx
- src/modules/Organizer/sections/Handles.tsx
- src/modules/Organizer/sections/IdentityCard.tsx
- src/modules/Organizer/sections/LeaveReviewSheet.tsx
- src/modules/Organizer/sections/QuoteFooter.tsx
- src/modules/Organizer/sections/RatingPanel.tsx
- src/modules/Organizer/sections/RecentWork.tsx
- src/modules/Organizer/sections/ReviewCard.tsx
- src/modules/Organizer/sections/ReviewPreview.tsx
- src/modules/Organizer/sections/ReviewSummaryCard.tsx
- src/modules/Organizer/styles.ts

**Payment**
- src/modules/Payment/PaymentScreen.tsx
- src/modules/Payment/PaymentSuccessScreen.tsx
- src/modules/Payment/styles.ts

**Payments**
- src/modules/Payments/PaymentsScreen.tsx
- src/modules/Payments/sections/PaymentRow.tsx
- src/modules/Payments/styles.ts

**Pickers**
- src/modules/Pickers/PickerScreen.tsx
- src/modules/Pickers/sections/GuestsSheet.tsx
- src/modules/Pickers/sections/PickerRow.tsx
- src/modules/Pickers/sections/RangeSheet.tsx
- src/modules/Pickers/styles.ts

**Plan**
- src/modules/Plan/PlanScreen.tsx
- src/modules/Plan/sections/CategoriesStep.tsx
- src/modules/Plan/sections/DatePickerModal.tsx
- src/modules/Plan/sections/EventDetailsForm.tsx
- src/modules/Plan/sections/FindOrganizers.tsx
- src/modules/Plan/sections/IdeasRequests.tsx
- src/modules/Plan/sections/OccasionPicker.tsx
- src/modules/Plan/sections/PlanHero.tsx
- src/modules/Plan/sections/ReviewStep.tsx
- src/modules/Plan/sections/SelectField.tsx
- src/modules/Plan/sections/SelectListModal.tsx
- src/modules/Plan/sections/StepPills.tsx
- src/modules/Plan/sections/Stepper.tsx
- src/modules/Plan/styles.ts

**Profile**
- src/modules/Profile/ProfileScreen.tsx
- src/modules/Profile/sections/ProfileGroup.tsx
- src/modules/Profile/sections/ProfileIdentity.tsx
- src/modules/Profile/styles.ts

**PublicEvents**
- src/modules/PublicEvents/DigitalTicketScreen.tsx
- src/modules/PublicEvents/EventBookingSuccessScreen.tsx
- src/modules/PublicEvents/EventCheckoutScreen.tsx
- src/modules/PublicEvents/EventMemoriesScreen.tsx
- src/modules/PublicEvents/EventTicketSelectionScreen.tsx
- src/modules/PublicEvents/MyTicketsScreen.tsx
- src/modules/PublicEvents/PublicEventDetailScreen.tsx
- src/modules/PublicEvents/PublicEventLiveScreen.tsx
- src/modules/PublicEvents/PublicEventsScreen.tsx
- src/modules/PublicEvents/sections/EventsNearYou.tsx
- src/modules/PublicEvents/sections/FeaturedEvents.tsx
- src/modules/PublicEvents/sections/FilterSheet.tsx
- src/modules/PublicEvents/sections/LiveStreams.tsx
- src/modules/PublicEvents/sections/ui.tsx
- src/modules/PublicEvents/ui.styles.ts

**SavedPackages**
- src/modules/SavedPackages/SavedPackagesScreen.tsx
- src/modules/SavedPackages/sections/SavedPackageCard.tsx
- src/modules/SavedPackages/styles.ts

**Search**
- src/modules/Search/SearchScreen.tsx
- src/modules/Search/sections/FilterSheet.tsx
- src/modules/Search/styles.ts

**Settings**
- src/modules/Settings/SettingsScreen.tsx
- src/modules/Settings/styles.ts

**Splash**
- src/modules/Splash/SplashScreen.tsx
- src/modules/Splash/styles.ts

**UseChoice**
- src/modules/UseChoice/UseChoiceScreen.tsx
- src/modules/UseChoice/styles.ts

**Workspace**
- src/modules/Workspace/IdeaBoardScreen.tsx
- src/modules/Workspace/WorkspaceScreen.tsx
- src/modules/Workspace/premium.styles.ts
- src/modules/Workspace/sections/BoardComposer.tsx
- src/modules/Workspace/sections/BoardFeed.tsx
- src/modules/Workspace/sections/InvitationTab.tsx
- src/modules/Workspace/sections/PinnedHeader.tsx
- src/modules/Workspace/sections/ReviewPrompt.tsx
- src/modules/Workspace/sections/WorkspaceHero.tsx
- src/modules/Workspace/sections/WorkspaceLinks.tsx
- src/modules/Workspace/sections/WorkspaceOverview.tsx
- src/modules/Workspace/sections/WorkspaceSections.tsx
- src/modules/Workspace/sections/WorkspaceTabs.tsx
- src/modules/Workspace/styles.ts

**__tests__/DesignSystem.test.tsx**
- __tests__/DesignSystem.test.tsx

**__tests__/GuestList.test.tsx**
- __tests__/GuestList.test.tsx

**__tests__/HomeSections.test.tsx**
- __tests__/HomeSections.test.tsx

**__tests__/LineByLine.test.tsx**
- __tests__/LineByLine.test.tsx

**__tests__/Payment.test.tsx**
- __tests__/Payment.test.tsx

**android/app**
- android/app/src/main/assets/fonts/Inter_*.ttf (4, generated by react-native-asset)

**android/link-assets-manifest.json**
- android/link-assets-manifest.json

**assets/fonts**
- assets/fonts/Inter_400Regular.ttf
- assets/fonts/Inter_500Medium.ttf
- assets/fonts/Inter_600SemiBold.ttf
- assets/fonts/Inter_700Bold.ttf

**ios/Evently_Mobile_Frontend**
- ios/Evently_Mobile_Frontend/Info.plist

**ios/Evently_Mobile_Frontend.xcodeproj**
- ios/Evently_Mobile_Frontend.xcodeproj/project.pbxproj

**ios/link-assets-manifest.json**
- ios/link-assets-manifest.json

**src/Components**
- src/Components/AppHeader.tsx
- src/Components/AppText.tsx
- src/Components/CalendarSheet.tsx
- src/Components/EventlyButton.tsx
- src/Components/EventlyText.tsx
- src/Components/effects/MetalBadge.tsx
- src/Components/index.ts
- src/Components/styles.ts

**src/navigation**
- src/navigation/EventlyTabBar.tsx
- src/navigation/GooeyBubbles.tsx

**src/theme**
- src/theme/fonts.ts
- src/theme/index.ts
- src/theme/textColors.ts
- src/theme/typography.ts

**test-utils/rn-to-html.ts**
- test-utils/rn-to-html.ts

## 3. Changes by screen / module

The full code for every file is in `typography-refactor.patch` beside this report (`git apply` ready). What changed in each module:

| Module | Text styles converted (by variant) |
|---|---|
| Booking | label 11, h3 10, caption 5, bodySmall 4, body 2, buttonSmall 2, h1 1, overline 1, h2 1 |
| BusinessRegister | label 2, h1 1, bodyLarge 1, h2 1 |
| Chat | body 5, caption 5, label 3, h3 2, bodySmall 2, h1 1 |
| CompareQuotes | bodySmall 10, h3 7, body 7, label 6, h2 3, bodyLarge 3, caption 2, overline 1, h1 1, button 1 |
| Components | bodyLarge 1, body 1, label 1 |
| GuestList | h3 7, bodyLarge 4, label 4, h2 3, bodySmall 2, caption 2, display 1, button 1 |
| Home | label 26, h3 16, caption 15, bodySmall 10, h2 9, overline 8, buttonSmall 7, button 5, body 5, h1 2, display 1, bodyLarge 1 |
| Invitation | label 32, caption 25, bodySmall 21, h3 13, body 12, h2 9, h1 5, overline 5, buttonSmall 4, bodyLarge 2 |
| Join | label 4, h3 3, caption 2, bodySmall 2, display 1, body 1 |
| LegalSupport | h3 1 |
| Location | caption 1 |
| Login | bodySmall 5, bodyLarge 3, h3 3, display 2, caption 2, h2 1, buttonSmall 1 |
| NameCapture | bodyLarge 2, h3 1, display 1, button 1 |
| Notification | caption 2, bodySmall 1, body 1 |
| Organizer | bodySmall 7, h3 6, h2 3, display 2, body 2, h1 1, button 1, bodyLarge 1, label 1, overline 1, caption 1 |
| Payment | bodySmall 7, h3 6, body 5, label 4, h2 1, display 1, h1 1, button 1 |
| Payments | overline 2, caption 2, h3 2, h1 1, label 1, body 1 |
| Pickers | bodyLarge 3, body 1 |
| Plan | label 6, bodyLarge 4, h1 2, bodySmall 2, body 2, buttonSmall 2, overline 1, caption 1, h3 1 |
| Profile | label 3, h3 2, caption 1, overline 1 |
| PublicEvents | label 34, caption 19, h3 17, body 13, bodySmall 13, buttonSmall 5, h2 3, h1 2 |
| SavedPackages | h3 1, caption 1, label 1 |
| Search | body 2, bodySmall 2, label 1, h2 1, overline 1, h3 1 |
| Settings | label 1, h3 1 |
| Splash | display 2 |
| UseChoice | h1 1, bodyLarge 1, h3 1, bodySmall 1, button 1 |
| Workspace | label 22, h3 15, bodySmall 15, caption 14, body 10, display 5, h2 3, buttonSmall 3, h1 2, overline 1, bodyLarge 1, button 1 |
| navigation | label 2 |

## 4. Inconsistencies found (before → after)

| # | Found | Fixed by |
|---|---|---|
| 1 | **Three typefaces**: Poppins for UI, the platform serif (Georgia / Noto Serif) for Home, Login, NameCapture, UseChoice, Workspace and Invitation headings, and a script face on the Plan banner. | Inter only; the serif constants (`SERIF`, `AUTH_SERIF`, `displayType`) are retired. |
| 2 | **37 font sizes**, including half-points (8.5, 9.5, 10.5, 12.5, 13.5, 14.5, 15.5, 16.5, 17.5) and **51 places below 11pt** (down to 8.5). | 12 variants; nothing below 11 (AppText also floors any stray size to 11). |
| 3 | **32 different line heights** and **30 different letter-spacings**, often set without a size. | Each comes only from the variant. |
| 4 | **Weight 800/900 in 110 places**, plus weight set on a custom family (ignored on Android, so "bold" text rendered Regular on some screens). | Four Inter faces, selected by name; `fontWeight` never reaches `<Text>`. |
| 5 | **66 hard-coded text hexes**, ~20 near-identical navies and greys (#101a31, #141c2b, #1a2e5a, #6B7280, #5d6674, #6b7385, #7b8595…). | Mapped to `textPrimary / textSecondary / textDisabled / textOnPrimary / textLink / textError`. The 43 left are deliberate brand and status colours (accent, success green, warning amber) — not greys. |
| 6 | **Variant names said one thing, styles another**: `variant="caption"` (498 uses) was often overridden by the style to anything from 9 to 17pt, bold. | Each `<AppText>`'s `variant` now names the token its style resolves to, so the JSX reads true. |
| 7 | **12 raw `<Text>`** (Home hero, section heads, loading, Login hero, OTP art, Name gate, Use choice, Invitation poster). | All `<AppText>`. |
| 8 | **Header titles at 20/700** instead of nav-title size; **tab labels** bold when active. | Header `h3` (17/600); tab labels 11/500 (`tabBarLabel`), active told by colour. |
| 9 | **Section headings** ranged 15–22pt; **empty states** 15–20pt titles with 12–15pt messages. | Section headings `h2`; empty title `h2`, message `body` + `textSecondary`. Uppercase section labels (Settings, Legal) → `overline`. |
| 10 | **Field errors** at 11–14pt in four reds. | `caption` in `textError`. |
| 11 | **Event card titles** 13–20pt, some clamped to 1 line. | Card titles `h3`, `numberOfLines={2}` (Booking cards, Other events, Near you, Live streams, mini cards, Featured hero → `h1`, 2 lines); venues/organizers 1 line. |
| 12 | **No cap on Dynamic Type** — large accessibility sizes broke cards. | `maxFontSizeMultiplier={1.5}` on every AppText. |
| 13 | **TextInputs** set a lineHeight, which shifts the caret on Android. | Inputs use `inputTypography` (same size and face, no leading). |

### Deliberate exceptions
- **Invitation cover styles** (`Invitation/constants.ts` → `COVER_FONT_STYLE`): the elegant / romantic serif looks are what the host *picks for their card* — content, not UI — so they were left alone.
- **Plan banner script** ("Make it happen ♥"): a hand-lettered illustration, kept.
- **SVG text** inside illustrations (react-native-svg `<Text>` in artwork) — drawing, not copy.

### Things to know before shipping
1. **Native rebuild needed.** Inter is linked (`npx react-native-asset` updated Info.plist, the Xcode project and `android/app/src/main/assets/fonts`). Run `cd ios && pod install`, then rebuild both apps — a Metro reload won't pick up fonts.
2. **Dark mode.** All text tokens have dark values and AppText swaps them automatically (including light colours coming from static StyleSheets). It's held at `TEXT_APPEARANCE = 'light'` in `theme/textColors.ts` because screen backgrounds and cards are still hard-coded white — switching text alone would put #E6E6E6 on white. Theming the surfaces is the follow-up; then flip that one constant to `'system'`.
3. **Poppins files** are still in `assets/fonts` (nothing references them). Delete them and re-run `npx react-native-asset` to drop ~1 MB from the bundle.
4. **Visual shifts to review**: body text went 15 → 14 and captions 11 → 12 per the spec, and several 13–15pt bold card titles are now 17pt `h3`. Tight cards (Home brief tiles, Near-you grid) truncate a little earlier.

### Verification
- `tsc --noEmit`: clean. `eslint`: 0 errors.
- `jest`: 722 / 723 pass. The one failure (`Location › freshness`) was failing before this change.
- New `DesignSystem.test.tsx` pins all 12 variants, the Inter faces, the text colours, and AppText's defaults (body, textPrimary, 1.5× cap, weight→face, 11pt floor).
