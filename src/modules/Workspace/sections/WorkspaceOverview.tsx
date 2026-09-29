import {
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import {
  WORKSPACE_ACCENT,
  WORKSPACE_COPY,
  WORKSPACE_GREEN,
  WORKSPACE_NAVY_DEEP,
  WORKSPACE_STATUS_COLOR,
  WORKSPACE_VIOLET,
} from '../constants';
import { overviewStyles as s } from '../styles';
import type { WorkspaceViewModel, WorkspaceTab, WorkspaceTabItem } from '../types';

/*
 * The artwork behind the header.
 *
 * Bundled rather than fetched: a remote banner leaves the screen grey on a
 * cold start, and the workspace is opened over hotel wifi as often as
 * anywhere else.
 *
 * The picture is composed for this job — the spray sits in the top-right and
 * the rest of it is empty cream — so it is laid in at its own proportions and
 * left alone, rather than cropped to fill the block. Nothing washes across it
 * sideways: the empty half is the artwork doing what a gradient would
 * otherwise have to fake, and a wash over it would only grey the flowers.
 */
const HERO_ART = require('../../../assets/images/flowers_workspace.png');
/** The source is 1536 × 1024. Its own ratio, so nothing is ever stretched. */
const HERO_RATIO = 1536 / 1024;

interface WorkspaceOverviewProps {
  data: WorkspaceViewModel;
  onBack: () => void;
  tab: WorkspaceTab;
  tabs: WorkspaceTabItem[];
  onSelectTab: (tab: WorkspaceTab) => void;
}

/**
 * The top of the workspace: which event this is, when it is, and where the
 * rest of it lives.
 *
 * The picture runs the full width and the whole height of the block — the
 * identity is written over it rather than under it, and a wash carries the
 * photograph from full strength in the top-right corner to plain white by the
 * foot, so the text has paper under it and the page below has nothing to seam
 * against. The three figures ride on a card of their own over the last of it.
 */
export function WorkspaceOverview({
  data,
  onBack,
  tab,
  tabs,
  onSelectTab,
}: WorkspaceOverviewProps) {
  const insets = useSafeAreaInsets();
  const statusColor = WORKSPACE_STATUS_COLOR[data.status] ?? colors.textMuted;
  /*
   * One height, in points, for the picture and for the fade over it.
   *
   * Both used to be given the source's ratio and left to work it out, and
   * they worked it out differently: an Image carries its own intrinsic size,
   * so it ignored the ratio and grew to the block, while the plain View
   * beside it obeyed. The fade then stopped two thirds of the way down the
   * picture and the rest of the flowers came back at full strength under a
   * hard line — the band across the banner.
   *
   * Measured from the screen instead. Nothing is inferred, so nothing can
   * disagree, and the artwork is only ever scaled down to fit its width.
   */
  const { width } = useWindowDimensions();
  const artHeight = Math.round(width / HERO_RATIO);

  return (
    <View>
      <View style={s.top}>
        {/*
          The artwork at the full width and its own 3:2, so it is scaled down
          to fit and never stretched to whatever height the booking's lines
          come to — which is what blew the flowers up and made a sharp
          photograph look like a poor one.

          The fade is a second box of exactly the same measured height, so it
          always covers the picture and nothing but: it reaches solid white
          precisely where the artwork ends, and the page under it is white, so
          there is no line to see. Sized to the block instead, it drifted up
          across the flowers on a short booking and left a hard edge on a
          long one.
        */}
        <Image
          source={HERO_ART}
          style={[s.art, { height: artHeight }]}
          resizeMode="cover"
          accessible={false}
        />
        <View style={[s.art, { height: artHeight }]} pointerEvents="none">
          <Svg width="100%" height="100%" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="wsDown" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0" stopColor="#ffffff" stopOpacity={0} />
                <Stop offset="0.5" stopColor="#ffffff" stopOpacity={0.04} />
                <Stop offset="0.76" stopColor="#ffffff" stopOpacity={0.45} />
                <Stop offset="0.92" stopColor="#ffffff" stopOpacity={0.93} />
                <Stop offset="1" stopColor="#ffffff" stopOpacity={1} />
              </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width="100%" height="100%" fill="url(#wsDown)" />
          </Svg>
        </View>

        <View style={[s.body, { paddingTop: insets.top + 8 }]}>
          {/*
            The way back and the screen's name, on the picture. Navy rather
            than white: the corner they sit in is the pale end of the wash, and
            white on it is invisible. No disc behind the chevron — it was a
            shape to notice for a control in the same corner of every screen.
          */}
          <View style={s.topRow}>
            <TouchableOpacity
              style={s.back}
              activeOpacity={0.7}
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <EventlyIcon name="chevron-left" size={22} color={WORKSPACE_NAVY_DEEP} />
            </TouchableOpacity>
            <EventlyText variant="subtitle" style={s.topTitle} numberOfLines={1}>
              {WORKSPACE_COPY.screenTitle}
            </EventlyText>
          </View>

          {/*
            The name on the left; what it costs and the day it falls on held
            together on the right. Each chip is dropped rather than drawn
            empty — a booking with nothing agreed has no amount to show.
          */}
          <View style={s.titleRow}>
            <EventlyText variant="h1" style={s.title} numberOfLines={2}>
              {data.title}
            </EventlyText>

            <View style={s.chips}>
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
          </View>

          {data.dateLabel ? (
            <View style={s.factRow}>
              <EventlyIcon
                name="calendar-blank-outline"
                size={16}
                color={WORKSPACE_NAVY_DEEP}
              />
              <View style={s.factText}>
                <EventlyText variant="body" style={s.factValue}>
                  {data.dateLabel}
                </EventlyText>
              </View>
            </View>
          ) : null}

          {data.venue ? (
            <View style={[s.factRow, s.factRowTall]}>
              <EventlyIcon
                name="map-marker-outline"
                size={16}
                color={WORKSPACE_NAVY_DEEP}
              />
              {/*
                Wrapped in a box that takes the row's slack, not flexed on the
                text itself. A Text given `flex` in a row lays itself out at
                its natural width on iOS and then spills past the screen — a
                long Hyderabad address ran off the right edge with its tail
                cut off by the block. The box is what the row divides up; the
                text simply fills it.

                Three lines, not two. A real venue line is a building, a road
                and a landmark; clipped at two, addresses became riddles.
              */}
              <View style={s.factText}>
                <EventlyText
                  variant="body"
                  style={s.factValue}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {data.venue}
                </EventlyText>
              </View>
            </View>
          ) : null}

          {/* The booking's reference, set small and quiet under the address —
              it is what you quote on the phone, not something you read. */}
          {data.ref ? (
            <EventlyText variant="caption" style={s.ref}>
              {data.ref}
            </EventlyText>
          ) : null}

          {/* Who is running it, and where it stands. Both are real answers the
              banner used to carry; they keep their place under the facts
              rather than sitting on the photograph. */}
          {data.organizerName || data.statusLabel ? (
            <View style={s.byRow}>
              {data.organizerName ? (
                <View style={s.byWho}>
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

              {data.statusLabel ? (
                <View style={s.statusPill}>
                  <View style={[s.statusDot, { backgroundColor: statusColor }]} />
                  <EventlyText variant="caption" style={s.statusText} numberOfLines={1}>
                    {data.statusLabel}
                  </EventlyText>
                </View>
              ) : null}
            </View>
          ) : null}

          {/*
            The three figures, on a card of their own over the last of the
            photograph. Each is dropped when its figure does not exist yet: a
            booking with no date has no countdown, one with no agreed amount
            has nothing paid, and a tile reading "0%" answers a question
            nobody can ask.
          */}
          <View style={s.stats}>
            {data.daysToGo != null ? (
              <View style={s.stat}>
                <View style={[s.statMark, s.statMarkTime]}>
                  <EventlyIcon
                    name="calendar-blank-outline"
                    size={15}
                    color={WORKSPACE_ACCENT}
                  />
                </View>
                <View style={s.statText}>
                  <EventlyText variant="h2" style={s.statValue}>
                    {data.daysToGo}
                  </EventlyText>
                  <EventlyText variant="caption" style={s.statLabel} numberOfLines={1}>
                    {data.daysToGo === 1 ? 'day to go' : 'days to go'}
                  </EventlyText>
                </View>
              </View>
            ) : null}

            <View style={s.stat}>
              <View style={[s.statMark, s.statMarkReady]}>
                <EventlyIcon name="check-circle-outline" size={15} color={WORKSPACE_GREEN} />
              </View>
              <View style={s.statText}>
                <EventlyText variant="h2" style={s.statValue}>
                  {`${data.progress}%`}
                </EventlyText>
                <EventlyText variant="caption" style={s.statLabel} numberOfLines={1}>
                  ready
                </EventlyText>
              </View>
            </View>

            {data.payment.totalLabel ? (
              <View style={s.stat}>
                <View style={[s.statMark, s.statMarkPaid]}>
                  <EventlyIcon name="database-outline" size={15} color={WORKSPACE_VIOLET} />
                </View>
                <View style={s.statText}>
                  <EventlyText variant="h2" style={s.statValue}>
                    {`${data.payment.paidPercent}%`}
                  </EventlyText>
                  <EventlyText variant="caption" style={s.statLabel} numberOfLines={1}>
                    paid
                  </EventlyText>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      {/*
        One row, every destination. A segmented control rather than a scroll
        of everything, so the sections below are chosen, not passed.

        It scrolls sideways because five of them with their marks come to more
        than a phone is wide. Cutting the words down to fit — "Ideas",
        "Invite" — would have fitted, and neither one says what the tab opens.
      */}
      <View style={s.tabs}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.tabsRow}
        >
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
                <EventlyIcon
                  name={item.icon}
                  size={17}
                  color={active ? WORKSPACE_ACCENT : colors.textMuted}
                />
                <EventlyText
                  variant="body"
                  style={[s.tabLabel, active && s.tabLabelActive]}
                  numberOfLines={1}
                >
                  {item.label}
                </EventlyText>
                {active ? <View style={s.tabUnderline} /> : null}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

export default WorkspaceOverview;
