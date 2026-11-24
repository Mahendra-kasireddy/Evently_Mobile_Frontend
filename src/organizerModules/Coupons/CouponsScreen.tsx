import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppHeader,
  AppText,
  EventlyButton,
  FadeInUp,
  ThinkingOrbs,
} from '../../Components';
import { COUPONS_COPY as COPY } from './constants';
import { useCouponFormContainer, useCouponsContainer } from './container';
import { ORG_ACCENT, ORG_ORB_COLORS, ORG_PAPER } from './design';
import { CouponCard } from './sections/CouponCard';
import { CouponFormSheet } from './sections/CouponFormSheet';
import { CreateButton } from './sections/CreateButton';
import { EmptyState } from './sections/EmptyState';
import { SummaryStrip } from './sections/SummaryStrip';
import { UsageList } from './sections/UsageList';
import { createStyles, styles as s } from './styles';

/**
 * The organizer's coupons.
 *
 * One action — create a coupon — and below it every coupon as a card with a
 * switch, so turning one off for a busy month is a single tap. Who has used
 * them comes last, and only once somebody has.
 */
export function CouponsScreen() {
  const c = useCouponsContainer();
  const form = useCouponFormContainer(c.reloadCoupons);

  const frame = (body: ReactNode) => (
    <SafeAreaView style={s.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={ORG_PAPER.canvas} />
      <AppHeader title={COPY.title} />
      {body}
      <CouponFormSheet f={form} />
    </SafeAreaView>
  );

  if (c.isLoading) {
    return frame(
      <View style={s.centered}>
        <ThinkingOrbs size={56} colors={ORG_ORB_COLORS} label={COPY.loading} />
        <AppText variant="body" style={s.muted}>
          {COPY.loading}
        </AppText>
      </View>,
    );
  }

  if (c.errorMessage) {
    return frame(
      <View style={s.centered}>
        <AppText variant="h3" style={s.title}>
          {COPY.error}
        </AppText>
        <AppText variant="body" style={s.muted}>
          {c.errorMessage}
        </AppText>
        <EventlyButton
          title={COPY.retry}
          onPress={c.refresh}
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
          refreshing={c.isRefreshing}
          onRefresh={c.refresh}
          tintColor={ORG_ACCENT.saffron}
          colors={[ORG_ACCENT.saffron]}
        />
      }
    >
      {c.notice ? (
        <View style={s.notice}>
          <AppText variant="caption" style={s.noticeText}>
            {c.notice}
          </AppText>
        </View>
      ) : null}

      {c.isEmpty ? (
        <FadeInUp>
          <EmptyState onCreate={form.open} />
        </FadeInUp>
      ) : (
        <>
          <FadeInUp>
            <SummaryStrip summary={c.summary} />
          </FadeInUp>

          <FadeInUp delay={60} style={createStyles.wrap}>
            <CreateButton onPress={form.open} />
            <AppText variant="caption" style={createStyles.note}>
              {COPY.liveNote}
            </AppText>
          </FadeInUp>

          <FadeInUp delay={120} style={s.section}>
            <AppText variant="h3" style={s.sectionTitle}>
              {COPY.listTitle}
            </AppText>
            {c.cards.map(card => (
              <CouponCard
                key={card.id}
                coupon={card}
                busy={!!c.pending[card.id]}
                onToggle={c.toggle}
              />
            ))}
          </FadeInUp>

          <FadeInUp delay={180}>
            <UsageList rows={c.usage} />
          </FadeInUp>
        </>
      )}
    </ScrollView>,
  );
}

export default CouponsScreen;
