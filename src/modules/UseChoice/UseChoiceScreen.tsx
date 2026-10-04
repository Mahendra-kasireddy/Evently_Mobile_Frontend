import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText } from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { CHOICE_ACCENT, CHOICE_NAVY, styles as s } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type UseChoice = 'plan' | 'organize';

const CHOICES: Array<{
  key: UseChoice;
  title: string;
  body: string;
  icon: string;
  badge: string;
}> = [
  {
    key: 'plan',
    title: 'I’m planning an event',
    body: 'Find organizers, get quotes and manage your event',
    icon: 'human-male-female',
    badge: 'heart',
  },
  {
    key: 'organize',
    title: 'I’m an organizer',
    body: 'List your services and get more bookings',
    icon: 'account-tie',
    badge: 'clipboard-text-outline',
  },
];

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
        {/* Serif heading through the platform Text: the app's text component
            always swaps in a Poppins face. */}
        <Text style={s.title} accessibilityRole="header">
          How do you want{'\n'}to use Evently?
        </Text>
        <EventlyText variant="body" style={s.subtitle}>
          You can change this anytime.
        </EventlyText>

        <View style={s.cards} accessibilityRole="radiogroup">
          {CHOICES.map(c => {
            const on = c.key === choice;
            return (
              <Pressable
                key={c.key}
                style={[s.card, on && s.cardOn]}
                onPress={() => setChoice(c.key)}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`${c.title}. ${c.body}`}
                testID={`use-choice-${c.key}`}
              >
                <View
                  style={[s.art, c.key === 'plan' ? s.artPlan : s.artOrganizer]}
                >
                  <EventlyIcon name={c.icon} size={46} color={CHOICE_NAVY} />
                  <View style={s.artBadge}>
                    <EventlyIcon
                      name={c.badge}
                      size={15}
                      color={CHOICE_ACCENT}
                    />
                  </View>
                </View>
                <View style={s.cardText}>
                  <EventlyText variant="body" style={s.cardTitle}>
                    {c.title}
                  </EventlyText>
                  <EventlyText variant="caption" style={s.cardBody}>
                    {c.body}
                  </EventlyText>
                </View>
                <View style={[s.radio, on && s.radioOn]}>
                  {on ? (
                    <EventlyIcon name="check" size={15} color="#ffffff" />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={s.spacer} />

        <Pressable
          style={({ pressed }) => [s.cta, pressed && { opacity: 0.88 }]}
          onPress={proceed}
          accessibilityRole="button"
          testID="use-choice-continue"
        >
          <EventlyText variant="body" style={s.ctaText}>
            Continue
          </EventlyText>
        </Pressable>
      </ScrollView>
    </View>
  );
}

export default UseChoiceScreen;
