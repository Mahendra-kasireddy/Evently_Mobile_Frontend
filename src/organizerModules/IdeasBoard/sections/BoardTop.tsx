import { View, type ViewStyle } from 'react-native';
import { AppText, EventlyIcon, PressableScale } from '../../../Components';
import { boardStyles as b } from '../../../modules/Workspace/styles';
import { colors } from '../../../theme';
import { IDEAS_COPY } from '../constants';
import { BOARD_ACCENT, BOARD_VIOLET } from '../design';
import { topStyles as s } from '../styles';
import type { ProgressModel, VisionRowModel } from '../types';

const COPY = IDEAS_COPY.progress;
const VISION = IDEAS_COPY.vision;

/**
 * Where the board stands: the customer's ideas, how many have a plan, and
 * how many sign-offs the organizer is waiting on. The same three tinted tiles
 * the customer sees on their side.
 */
export function ProgressCard({ progress }: { progress: ProgressModel }) {
  const fill: ViewStyle = { width: `${progress.plannedPercent}%` };
  const tiles: Array<[number, string, object, object]> = [
    [progress.shared, COPY.shared, b.statShared, b.statValueShared],
    [progress.planned, COPY.planned, b.statPlanned, b.statValuePlanned],
    [progress.waiting, COPY.waiting, b.statAwaiting, b.statValueAwaiting],
  ];
  return (
    <View style={s.card}>
      <AppText variant="h3" style={s.title}>
        {COPY.title}
      </AppText>
      <View style={s.stats}>
        {tiles.map(([value, label, tile, tone]) => (
          <View key={label} style={[b.stat, tile]}>
            <AppText variant="h2" style={[b.statValue, tone]}>
              {value}
            </AppText>
            <AppText variant="label" style={b.statLabel}>
              {label}
            </AppText>
          </View>
        ))}
      </View>
      <View
        style={s.bar}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: progress.plannedPercent }}
      >
        <View style={[s.barFill, fill]} />
      </View>
      <View style={s.summaryRow}>
        <AppText variant="caption" style={s.summary}>
          {progress.summary}
        </AppText>
        {progress.approved > 0 ? (
          <AppText variant="caption" style={s.approved}>
            {COPY.approved(progress.approved)}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

/**
 * The organizer's summary of the event — what the customer reads back on
 * their own board. One button to edit it.
 */
export function VisionCard({
  rows,
  captured,
  onEdit,
}: {
  rows: VisionRowModel[];
  captured: boolean;
  onEdit: () => void;
}) {
  const action = captured ? VISION.edit : VISION.add;
  return (
    <View style={s.card}>
      <View style={s.head}>
        <View style={s.headText}>
          <AppText variant="h3" style={s.title}>
            {VISION.title}
          </AppText>
          <AppText variant="caption" style={s.subtitle}>
            {VISION.subtitle}
          </AppText>
        </View>
        <PressableScale
          style={s.editButton}
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel={action}
        >
          <EventlyIcon
            name={captured ? 'pencil-outline' : 'plus'}
            size={14}
            color={BOARD_VIOLET}
          />
          <AppText variant="label" style={s.editText}>
            {action}
          </AppText>
        </PressableScale>
      </View>

      {!captured ? (
        <AppText variant="body" style={b.visionEmpty}>
          {VISION.empty}
        </AppText>
      ) : (
        rows.map(row => (
          <View key={row.key} style={b.visionRow}>
            <View style={b.visionChip}>
              <EventlyIcon name={row.icon} size={16} color={BOARD_ACCENT} />
            </View>
            <View style={b.visionText}>
              <AppText variant="caption" style={b.visionLabel}>
                {row.label}
              </AppText>
              <View style={s.valueRow}>
                <AppText
                  variant="body"
                  style={row.value ? b.visionValue : b.visionValueEmpty}
                >
                  {row.value || VISION.slotEmpty}
                </AppText>
                {row.locked ? (
                  <View style={s.lock}>
                    <EventlyIcon
                      name="lock-outline"
                      size={13}
                      color={colors.textMuted}
                    />
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );
}
