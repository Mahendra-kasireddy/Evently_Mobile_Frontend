import { TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText, OccasionArt } from '../../../Components';
import { colors } from '../../../theme';
import { CATEGORY_GRADIENT } from '../../Home/constants';
import { WORKSPACE_COPY, WORKSPACE_STATUS_COLOR } from '../constants';
import { overviewStyles as s } from '../styles';
import type { WorkspaceViewModel, WorkspaceTab } from '../types';

interface WorkspaceOverviewProps {
  data: WorkspaceViewModel;
  onBack: () => void;
  tab: WorkspaceTab;
  tabs: Array<{ key: WorkspaceTab; label: string }>;
  onSelectTab: (tab: WorkspaceTab) => void;
}

/**
 * The top of the workspace: which event this is, when it is, and where the
 * rest of it lives.
 *
 * The banner is the occasion's own illustration over its gradient — a booking
 * carries no photograph, and the reference's cover image would otherwise be
 * somebody else's event. The countdown on it is in days: a wedding five
 * months out counted in seconds is a number nobody reads, and the workspace
 * already knows how many days are left.
 */
export function WorkspaceOverview({
  data,
  onBack,
  tab,
  tabs,
  onSelectTab,
}: WorkspaceOverviewProps) {
  const insets = useSafeAreaInsets();
  const [start, end] = CATEGORY_GRADIENT[data.art];
  const statusColor = WORKSPACE_STATUS_COLOR[data.status] ?? colors.onPrimaryMuted;
  const dayWord = data.daysToGo === 1 ? 'DAY TO GO' : 'DAYS TO GO';

  return (
    <View>
      <View style={[s.banner, { paddingTop: insets.top + 8 }]}>
        <View style={s.bannerLayer}>
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <Defs>
              <LinearGradient id="wsBanner" x1="15%" y1="0%" x2="85%" y2="100%">
                <Stop offset="0" stopColor={start} />
                <Stop offset="1" stopColor={end} />
              </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width={100} height={100} fill="url(#wsBanner)" />
          </Svg>
        </View>
        <View style={s.bannerArt} pointerEvents="none">
          <OccasionArt art={data.art} />
        </View>

        <View style={[s.topRow, { top: insets.top + 8 }]}>
          <TouchableOpacity
            style={s.back}
            activeOpacity={0.7}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <EventlyIcon name="chevron-left" size={22} color={colors.onPrimary} />
          </TouchableOpacity>
          <EventlyText variant="subtitle" style={s.topTitle} numberOfLines={1}>
            {WORKSPACE_COPY.screenTitle}
          </EventlyText>
        </View>

        <View style={s.countdown}>
          {/* A booking with no date has no countdown — better than "0". */}
          {data.daysToGo != null ? (
            <>
              <EventlyText variant="h1" style={s.countdownValue}>
                {data.daysToGo}
              </EventlyText>
              <EventlyText variant="caption" style={s.countdownLabel}>
                {dayWord}
              </EventlyText>
            </>
          ) : null}

          <View style={s.statusPill}>
            <View style={[s.statusDot, { backgroundColor: statusColor }]} />
            <EventlyText variant="caption" style={s.statusText} numberOfLines={1}>
              {data.statusLabel}
            </EventlyText>
          </View>
        </View>
      </View>

      <View style={s.sheet}>
        <View style={s.titleRow}>
          <EventlyText variant="h1" style={s.title} numberOfLines={2}>
            {data.title}
          </EventlyText>

          {/* What it costs and when it is. Each drops rather than drawing an
              empty chip: a booking with no agreed amount has none to show. */}
          {data.payment.totalLabel ? (
            <View style={s.amountChip}>
              <EventlyText variant="caption" style={s.amountChipText}>
                {data.payment.totalLabel}
              </EventlyText>
            </View>
          ) : null}
          {data.dateChip ? (
            <View style={s.dateChip}>
              <EventlyText variant="caption" style={s.dateChipMonth}>
                {data.dateChip.month}
              </EventlyText>
              <EventlyText variant="subtitle" style={s.dateChipDay}>
                {data.dateChip.day}
              </EventlyText>
            </View>
          ) : null}
        </View>

        {data.organizerName ? (
          <View style={s.byRow}>
            <View
              style={[s.byAvatar, { backgroundColor: data.organizerAvatarColor }]}
            >
              <EventlyText variant="caption" style={s.byAvatarText}>
                {data.organizerInitials || '·'}
              </EventlyText>
            </View>
            <EventlyText variant="caption" style={s.byText} numberOfLines={1}>
              {`Organized by ${data.organizerName}`}
            </EventlyText>
          </View>
        ) : null}

        {data.dateLabel ? (
          <View style={s.factRow}>
            <EventlyIcon
              name="calendar-blank-outline"
              size={18}
              color={colors.textMuted}
            />
            <View style={s.factText}>
              <EventlyText variant="body" style={s.factValue}>
                {data.dateLabel}
              </EventlyText>
            </View>
          </View>
        ) : null}

        {data.venue ? (
          <View style={s.factRow}>
            <EventlyIcon
              name="map-marker-outline"
              size={18}
              color={colors.textMuted}
            />
            <View style={s.factText}>
              <EventlyText variant="body" style={s.factValue} numberOfLines={2}>
                {data.venue}
              </EventlyText>
              {data.ref ? (
                <EventlyText variant="caption" style={s.factNote}>
                  {data.ref}
                </EventlyText>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* Each tile is dropped when its figure does not exist: a booking
            with no date has no countdown, and one with no agreed amount has
            nothing paid. A tile reading "0%" would be an answer to a question
            nobody can ask yet. */}
        <View style={s.stats}>
          {data.daysToGo != null ? (
            <View style={[s.stat, s.statTime]}>
              <EventlyText variant="h2" style={[s.statValue, s.statValueTime]}>
                {data.daysToGo}
              </EventlyText>
              <EventlyText variant="caption" style={s.statLabel}>
                {data.daysToGo === 1 ? 'day to go' : 'days to go'}
              </EventlyText>
            </View>
          ) : null}

          <View style={[s.stat, s.statReady]}>
            <EventlyText variant="h2" style={[s.statValue, s.statValueReady]}>
              {`${data.progress}%`}
            </EventlyText>
            <EventlyText variant="caption" style={s.statLabel}>
              ready
            </EventlyText>
          </View>

          {data.payment.totalLabel ? (
            <View style={[s.stat, s.statPaid]}>
              <EventlyText variant="h2" style={[s.statValue, s.statValuePaid]}>
                {`${data.payment.paidPercent}%`}
              </EventlyText>
              <EventlyText variant="caption" style={s.statLabel}>
                paid
              </EventlyText>
            </View>
          ) : null}
        </View>

        <View style={s.tabs}>
          {tabs.map(item => {
            const active = item.key === tab;
            return (
              <TouchableOpacity
                key={item.key}
                style={[s.tab, active && s.tabActive]}
                activeOpacity={0.8}
                onPress={() => onSelectTab(item.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={item.label}
                testID={`workspace-tab-${item.key}`}
              >
                <EventlyText
                  variant="body"
                  style={[s.tabLabel, active && s.tabLabelActive]}
                >
                  {item.label}
                </EventlyText>
                {active ? <View style={s.tabUnderline} /> : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default WorkspaceOverview;
