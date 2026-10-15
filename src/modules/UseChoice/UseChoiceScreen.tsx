import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image, Pressable, ScrollView, StatusBar, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppText,
  EventlyIcon,
  FadeInUp,
  GradientFill,
  PressableScale,
} from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { CHOICE_NAVY, styles as s } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type UseChoice = 'plan' | 'organize';

const LOGO = require('../../assets/images/logo_mark.png');

interface Floater {
  icon: string;
  color: string;
  /** Position inside the art panel. */
  at: { top?: number; bottom?: number; left?: number; right?: number };
}

const CHOICES: Array<{
  key: UseChoice;
  title: string;
  body: string;
  photo: ImageSourcePropType;
  blob: string;
  floaters: Floater[];
}> = [
  {
    key: 'plan',
    title: 'I’m planning an event',
    body: 'Find organizers, get quotes and manage your event',
    photo: require('../../assets/images/use_choice_planner.png'),
    blob: '#ffe2d3',
    floaters: [
      { icon: 'heart', color: '#ff5f8f', at: { top: 8, right: 14 } },
      { icon: 'calendar-month', color: '#7b5cff', at: { top: 30, right: -4 } },
      {
        icon: 'ticket-percent',
        color: '#f59e0b',
        at: { bottom: 18, right: 2 },
      },
    ],
  },
  {
    key: 'organize',
    title: 'I’m an organizer',
    body: 'List your services and get more bookings',
    photo: require('../../assets/images/use_choice_organizer.png'),
    blob: '#e7e2ff',
    floaters: [
      { icon: 'storefront', color: '#ff5f8f', at: { top: 10, left: -2 } },
      { icon: 'calendar-check', color: '#7b5cff', at: { top: 12, right: 0 } },
      { icon: 'room-service', color: '#f59e0b', at: { bottom: 16, right: 0 } },
    ],
  },
];

const CTA_GRADIENT: [string, string] = ['#ff8a4c', '#f0603a'];
const CHECK_GRADIENT: [string, string] = ['#ff8a4c', '#e8533a'];

/**
 * The fork at the start: planning a celebration, or running them.
 *
 * Planning goes to sign-in, which is all a customer needs — a number. An
 * organizer goes to business registration, which also covers sub-vendors and
 * says that an existing business signs in with the same number. Either way the
 * choice is not a lock: a customer can register a business later, and an
 * account holding both switches between them from Profile.
 */
export function UseChoiceScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [choice, setChoice] = useState<UseChoice>('plan');

  const proceed = () => {
    if (choice === 'plan') navigation.navigate('Login');
    else navigation.navigate('Join');
  };

  return (
    <View style={[s.page, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      {/* Soft corner washes and a few confetti marks, as on the splash. */}
      <View style={[s.wash, s.washTop]} pointerEvents="none" />
      <View style={[s.wash, s.washBottom]} pointerEvents="none" />
      <View style={s.confetti} pointerEvents="none">
        <View style={[s.bit, s.bit1]} />
        <View style={[s.bit, s.bit2]} />
        <View style={[s.bit, s.bit3]} />
      </View>

      <View style={s.topBar}>
        {navigation.canGoBack() ? (
          <Pressable
            style={s.back}
            onPress={navigation.goBack}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <EventlyIcon name="chevron-left" size={26} color={CHOICE_NAVY} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        contentContainerStyle={[
          s.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <FadeInUp>
          <View style={s.brandRow}>
            <Image source={LOGO} style={s.brandLogo} />
            <AppText style={s.brandName}>Hypie</AppText>
            <View style={s.brandSpark}>
              <EventlyIcon name="star-four-points" size={11} color="#f5b942" />
            </View>
          </View>

          <AppText variant="h1" style={s.title} accessibilityRole="header">
            How do you want{'\n'}to use Hypie?
          </AppText>
          <AppText variant="bodyLarge" style={s.subtitle}>
            You can change this anytime.
          </AppText>
        </FadeInUp>

        <View style={s.cards} accessibilityRole="radiogroup">
          {CHOICES.map((c, i) => {
            const on = c.key === choice;
            return (
              <FadeInUp key={c.key} delay={120 + i * 90}>
                <PressableScale
                  style={[s.card, on && s.cardOn]}
                  onPress={() => setChoice(c.key)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`${c.title}. ${c.body}`}
                  testID={`use-choice-${c.key}`}
                >
                  <View style={s.art} pointerEvents="none">
                    <View style={[s.blob, { backgroundColor: c.blob }]} />
                    <Image
                      source={c.photo}
                      style={s.photo}
                      resizeMode="contain"
                    />
                    {c.floaters.map(f => (
                      <View key={f.icon} style={[s.floater, f.at]}>
                        <EventlyIcon name={f.icon} size={13} color={f.color} />
                      </View>
                    ))}
                  </View>

                  <View style={s.cardText}>
                    <AppText style={s.cardTitle}>{c.title}</AppText>
                    <AppText style={s.cardBody}>{c.body}</AppText>
                  </View>

                  <View style={[s.radio, on && s.radioOn]}>
                    {on ? (
                      <>
                        <GradientFill
                          colors={CHECK_GRADIENT}
                          direction="diagonal"
                        />
                        <EventlyIcon name="check" size={15} color="#ffffff" />
                      </>
                    ) : null}
                  </View>
                </PressableScale>
              </FadeInUp>
            );
          })}
        </View>

        <View style={s.spacer} />

        <PressableScale
          style={s.cta}
          onPress={proceed}
          accessibilityRole="button"
          testID="use-choice-continue"
        >
          <GradientFill colors={CTA_GRADIENT} direction="across" />
          <AppText style={s.ctaText}>Continue</AppText>
          <EventlyIcon name="arrow-right" size={18} color="#ffffff" />
        </PressableScale>
      </ScrollView>
    </View>
  );
}

export default UseChoiceScreen;
