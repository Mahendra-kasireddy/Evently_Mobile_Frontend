import { View } from 'react-native';
import { AppText, EventlyIcon, ThinkingOrbs } from '../../../Components';
import { PUBLIC_EVENTS_COPY } from '../constants';
import { ORG_ACCENT, ORG_ORB_COLORS, WARN_INK } from '../design';
import { fillWidth, overviewStyles as s, styles as screen } from '../styles';
import type { DashboardModel } from '../types';

const COPY = PUBLIC_EVENTS_COPY.overview;

/** The numbers: four big tiles, then how each ticket type is selling. */
export function OverviewTab({
  dashboard,
  failed,
  nextStep,
}: {
  dashboard: DashboardModel | null;
  failed: boolean;
  /** A one-line nudge for a draft ('' for none). */
  nextStep: string;
}) {
  return (
    <View style={screen.section}>
      {nextStep ? (
        <View style={s.hint}>
          <EventlyIcon name="lightbulb-on-outline" size={20} color={WARN_INK} />
          <AppText variant="bodySmall" style={s.hintText}>
            {nextStep}
          </AppText>
        </View>
      ) : null}

      {!dashboard ? (
        failed ? (
          <AppText variant="body" style={screen.muted}>
            {COPY.unavailable}
          </AppText>
        ) : (
          <View style={screen.centered}>
            <ThinkingOrbs size={40} colors={ORG_ORB_COLORS} />
          </View>
        )
      ) : (
        <>
          <View style={s.grid}>
            {dashboard.tiles.map(t => (
              <View
                key={t.key}
                style={s.tile}
                accessible
                accessibilityLabel={`${t.label}: ${t.value}, ${t.sub}`}
              >
                <View style={s.tileIcon}>
                  <EventlyIcon
                    name={t.icon}
                    size={18}
                    color={ORG_ACCENT.saffron}
                  />
                </View>
                <AppText variant="h1" style={s.value}>
                  {t.value}
                </AppText>
                <AppText variant="bodySmall" style={s.label}>
                  {t.label}
                </AppText>
                <AppText variant="caption" style={s.sub}>
                  {t.sub}
                </AppText>
              </View>
            ))}
          </View>

          <AppText variant="h3" style={screen.sectionTitle}>
            {COPY.byType}
          </AppText>
          <View style={s.typeCard}>
            {dashboard.byType.length === 0 ? (
              <AppText variant="bodySmall" style={s.typeLine}>
                {COPY.noTypes}
              </AppText>
            ) : (
              dashboard.byType.map(t => (
                <View key={t.id} style={s.typeRow}>
                  <View style={s.typeHead}>
                    <AppText
                      variant="body"
                      style={s.typeName}
                      numberOfLines={1}
                    >
                      {`${t.name} · ${t.price}`}
                    </AppText>
                    <AppText variant="bodySmall" style={s.typeLine}>
                      {t.line}
                    </AppText>
                  </View>
                  <View style={s.track}>
                    <View style={[s.fill, fillWidth(t.percent)]} />
                  </View>
                </View>
              ))
            )}
          </View>
        </>
      )}
    </View>
  );
}

export default OverviewTab;
