import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EventlyIcon, AppText, FadeInUp, GradientFill } from '../../Components';
import type { JoinRole, RootStackParamList } from '../../navigation/types';
import { selectAuthToken } from '../../store/authSlice';
import { useAppSelector } from '../../store/hooks';
import { brand } from '../../theme';
import { JOIN_COPY, ROLE_CARDS } from './constants';
import { RequirementNote } from './sections/RequirementNote';
import { RoleCard } from './sections/RoleCard';
import { styles } from './styles';

const HERO_GRADIENT: [string, string] = ['#141d3a', '#3a1f5c'];

type JoinNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Registering a business profile: organizer or sub-vendor.
 *
 * Reached from the sign-in screen's business link and from Profile's "List
 * your business", and closed rather than backed out of — it is a detour off
 * the customer flow, not a step in it, which is why the header carries an X
 * and not a back arrow.
 *
 * Both roles continue into BusinessRegister: OTP (when signed out), then the
 * organizer's review status or the sub-vendor sign-up wizard.
 */
export function JoinScreen() {
  const navigation = useNavigation<JoinNavigationProp>();
  const insets = useSafeAreaInsets();
  const isSignedIn = useAppSelector(selectAuthToken) !== null;

  const handleClose = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    // Nothing underneath: a registration that verified the OTP and was then
    // abandoned leaves this as the first screen of the signed-in stack.
    navigation.reset({
      index: 0,
      routes: [{ name: isSignedIn ? 'Main' : 'Login' }],
    });
  };

  const handleSelectRole = (role: JoinRole) => {
    navigation.navigate('BusinessRegister', { role });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <GradientFill colors={HERO_GRADIENT} direction="diagonal" />
        {/* Two soft glows — the warmth of an event at night. */}
        <View style={[styles.glow, styles.glowCoral]} pointerEvents="none" />
        <View style={[styles.glow, styles.glowViolet]} pointerEvents="none" />

        <Pressable
          style={styles.closeButton}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
          testID="join-close"
        >
          <EventlyIcon name="close" size={18} color={brand.onNavy} />
        </Pressable>

        <AppText variant="label" style={styles.eyebrow}>
          {JOIN_COPY.eyebrow}
        </AppText>
        <AppText variant="display" style={styles.title}>
          {JOIN_COPY.title}
        </AppText>
        <AppText variant="body" style={styles.subtitle}>
          {JOIN_COPY.subtitle}
        </AppText>

        <View style={styles.chips}>
          {JOIN_COPY.chips.map(chip => (
            <View key={chip.label} style={styles.chip}>
              <EventlyIcon name={chip.icon} size={12} color="#ffd2c2" />
              <AppText variant="label" style={styles.chipText}>
                {chip.label}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="h3" style={styles.pick}>
          {JOIN_COPY.pick}
        </AppText>
        {ROLE_CARDS.map((role, i) => (
          <FadeInUp key={role.key} delay={80 + i * 80}>
            <RoleCard data={role} onPress={handleSelectRole} />
          </FadeInUp>
        ))}

        <FadeInUp delay={260}>
          <RequirementNote />
        </FadeInUp>
        <AppText variant="caption" style={styles.sameNumber}>
          {JOIN_COPY.sameNumber}
        </AppText>
      </ScrollView>
    </View>
  );
}

export default JoinScreen;
