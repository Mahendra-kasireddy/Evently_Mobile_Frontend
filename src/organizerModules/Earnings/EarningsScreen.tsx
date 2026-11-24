import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StatusBar, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppText,
  EventlyButton,
  FadeInUp,
  ThinkingOrbs,
} from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { OrganizerTopBar } from '../Navigation/sections/OrganizerTopBar';
import { EARNINGS_COPY as COPY } from './constants';
import { useEarningsContainer } from './container';
import { ORG_ACCENT, ORG_ORB_COLORS, ORG_PAPER } from './design';
import { CouponsCard } from './sections/CouponsCard';
import { EarningsHero } from './sections/EarningsHero';
import { EventMix } from './sections/EventMix';
import { MonthlyChart } from './sections/MonthlyChart';
import { PaymentsList } from './sections/PaymentsList';
import { PeriodChips } from './sections/PeriodChips';
import { SummaryTiles } from './sections/SummaryTiles';
import { styles as s } from './styles';

/**
 * What the organizer has earned.
 *
 * The period chips drive the money card, the two tiles and the payments list
 * together, so the numbers on screen always add up. The six-month chart and
 * the event mix are the bigger picture, whatever the period.
 */
export function EarningsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const e = useEarningsContainer();

  const frame = (body: ReactNode) => (
    <SafeAreaView style={s.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={ORG_PAPER.canvas} />
      <OrganizerTopBar title={COPY.title} />
      {body}
    </SafeAreaView>
  );

  if (e.isLoading) {
    return frame(
      <View style={s.centered}>
        <ThinkingOrbs size={56} colors={ORG_ORB_COLORS} label={COPY.loading} />
        <AppText variant="body" style={s.muted}>
          {COPY.loading}
        </AppText>
      </View>,
    );
  }

  if (e.errorMessage || !e.summary) {
    return frame(
      <View style={s.centered}>
        <AppText variant="h3" style={s.title}>
          {COPY.error}
        </AppText>
        {e.errorMessage ? (
          <AppText variant="body" style={s.muted}>
            {e.errorMessage}
          </AppText>
        ) : null}
        <EventlyButton
          title={COPY.retry}
          onPress={e.refresh}
          accentColor={ORG_ACCENT.saffron}
        />
      </View>,
    );
  }

  return frame(
    <ScrollView
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={e.isRefreshing}
          onRefresh={e.refresh}
          tintColor={ORG_ACCENT.saffron}
          colors={[ORG_ACCENT.saffron]}
        />
      }
    >
      <PeriodChips period={e.period} onChange={e.setPeriod} />

      <FadeInUp>
        <EarningsHero summary={e.summary} />
      </FadeInUp>

      <FadeInUp delay={60} style={s.section}>
        <SummaryTiles summary={e.summary} />
      </FadeInUp>

      <FadeInUp delay={120} style={s.section}>
        <MonthlyChart bars={e.bars} />
        {e.mix.length > 0 ? <EventMix slices={e.mix} /> : null}
        <CouponsCard onPress={() => navigation.navigate('OrganizerCoupons')} />
      </FadeInUp>

      <FadeInUp delay={180}>
        <PaymentsList payments={e.payments} hasAny={e.hasAny} />
      </FadeInUp>
    </ScrollView>,
  );
}

export default EarningsScreen;
