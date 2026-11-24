import { RefreshControl, ScrollView, StatusBar, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppHeader,
  AppText,
  EventlyButton,
  FadeInUp,
  ThinkingOrbs,
} from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { BADGES_COPY as COPY } from './constants';
import { useBadgesContainer } from './container';
import { ORG_ACCENT, ORG_ORB_COLORS, ORG_PAPER } from './design';
import { HelpCard } from './sections/HelpCard';
import { Perks } from './sections/Perks';
import { Requirements } from './sections/Requirements';
import { TierHero } from './sections/TierHero';
import { TierLadder } from './sections/TierLadder';
import { styles as s } from './styles';

/**
 * Badges & tiers: the organizer's tier, the path to the top, what the next
 * tier asks for and what it unlocks. At Platinum the checklist gives way to a
 * note that there is nothing left to reach.
 */
export function BadgesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const b = useBadgesContainer();

  const openAcademy = () => navigation.navigate('OrganizerAcademy');

  const content = b.isLoading ? (
    <View style={s.centered}>
      <ThinkingOrbs size={56} colors={ORG_ORB_COLORS} label={COPY.loading} />
      <AppText variant="body" style={s.muted}>
        {COPY.loading}
      </AppText>
    </View>
  ) : b.errorMessage || !b.model ? (
    <View style={s.centered}>
      <AppText variant="h3" style={s.title}>
        {COPY.error}
      </AppText>
      {b.errorMessage ? (
        <AppText variant="body" style={s.muted}>
          {b.errorMessage}
        </AppText>
      ) : null}
      <EventlyButton
        title={COPY.retry}
        onPress={b.refresh}
        accentColor={ORG_ACCENT.saffron}
      />
    </View>
  ) : (
    <ScrollView
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={b.isRefreshing}
          onRefresh={b.refresh}
          tintColor={ORG_ACCENT.saffron}
          colors={[ORG_ACCENT.saffron]}
        />
      }
    >
      <FadeInUp>
        <TierHero hero={b.model.hero} />
      </FadeInUp>
      <FadeInUp delay={60}>
        <TierLadder steps={b.model.ladder} />
      </FadeInUp>
      {b.model.nextTier ? (
        <>
          <FadeInUp delay={120}>
            <Requirements
              tier={b.model.nextTier}
              items={b.model.requirements}
              metCount={b.model.metCount}
              onOpenAcademy={openAcademy}
            />
          </FadeInUp>
          {b.model.perks.length ? (
            <FadeInUp delay={180}>
              <Perks tier={b.model.nextTier} perks={b.model.perks} />
            </FadeInUp>
          ) : null}
          <FadeInUp delay={240}>
            <HelpCard
              tier={b.model.nextTier}
              onPress={() => navigation.navigate('Contact')}
            />
          </FadeInUp>
        </>
      ) : (
        <FadeInUp delay={120}>
          <View style={s.card}>
            <AppText variant="h3" style={s.cardTitle}>
              {COPY.topTitle}
            </AppText>
            <AppText variant="body" style={s.cardMeta}>
              {COPY.topBody}
            </AppText>
          </View>
        </FadeInUp>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={ORG_PAPER.canvas} />
      <AppHeader title={COPY.title} />
      {content}
    </SafeAreaView>
  );
}

export default BadgesScreen;
