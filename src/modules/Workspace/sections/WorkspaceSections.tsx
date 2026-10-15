import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, View } from 'react-native';
import {
  EventlyIcon,
  AppText,
  GradientFill,
  useReducedMotion,
} from '../../../Components';
import {
  STAT_RING,
  TASK_STATUS_COLOR,
  WORKSPACE_ACTION_GRADIENT,
  WORKSPACE_COPY,
  WORKSPACE_PREMIUM_COPY as P,
} from '../constants';
import { sectionUi as s } from '../premium.styles';
import type { WorkspaceViewModel } from '../types';

/** A section: a heading with its own gradient mark, then a card. */
function Section({
  title,
  icon,
  colors,
  aside,
  children,
}: {
  title: string;
  icon: string;
  colors: readonly [string, string];
  aside?: string;
  children: ReactNode;
}) {
  return (
    <View style={s.section}>
      <View style={s.head}>
        <View style={s.headMark}>
          <GradientFill colors={colors} direction="diagonal" />
          <EventlyIcon name={icon} size={15} color="#ffffff" />
        </View>
        <AppText variant="h3" style={s.headTitle}>
          {title}
        </AppText>
        {aside ? (
          <AppText variant="label" style={s.headAside}>
            {aside}
          </AppText>
        ) : null}
      </View>
      <View style={s.card}>{children}</View>
    </View>
  );
}

/** Nothing here yet — said warmly, with a picture, never as a blank card. */
function Empty({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={s.empty}>
      <View style={s.emptyBlob}>
        <GradientFill colors={['#fde8ef', '#efe8ff']} direction="diagonal" />
        <EventlyIcon name={icon} size={26} color="#9b7dff" />
      </View>
      <AppText variant="body" style={s.emptyText}>
        {text}
      </AppText>
    </View>
  );
}

/** The step happening now: a ring that breathes. Still with Reduce Motion on. */
function NowMark() {
  const reduceMotion = useReducedMotion();
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduceMotion) return undefined;
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, pulse]);
  return (
    <View style={s.stepMark}>
      <Animated.View
        style={[
          s.nowHalo,
          {
            opacity: pulse.interpolate({
              inputRange: [0, 1],
              outputRange: [0.55, 0],
            }),
            transform: [
              {
                scale: pulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.9],
                }),
              },
            ],
          },
        ]}
      />
      <View style={s.nowCore} />
    </View>
  );
}

/**
 * Where the booking is on its way to the day: done steps lit, the one under
 * way breathing and marked "Now", the rest still to come.
 */
export function Milestones({ data }: { data: WorkspaceViewModel }) {
  if (data.steps.length === 0) return null;
  const finished = ['cancelled', 'rejected', 'expired', 'completed'].includes(
    data.status,
  );
  const nowIndex = finished ? -1 : data.steps.findIndex(step => !step.done);
  const doneCount = data.steps.filter(step => step.done).length;

  return (
    <Section
      title={P.journey}
      icon="map-marker-path"
      colors={WORKSPACE_ACTION_GRADIENT}
      aside={`${doneCount}/${data.steps.length}`}
    >
      {data.steps.map((step, i) => {
        const isNow = i === nowIndex;
        const last = i === data.steps.length - 1;
        return (
          <View
            key={step.label}
            style={s.step}
            accessibilityLabel={`${step.label}: ${
              step.done ? 'done' : isNow ? 'happening now' : 'not yet'
            }`}
          >
            <View style={s.stepRail}>
              {step.done ? (
                <View style={s.stepMark}>
                  <GradientFill colors={STAT_RING.ready} direction="diagonal" />
                  <EventlyIcon name="check" size={14} color="#ffffff" />
                </View>
              ) : isNow ? (
                <NowMark />
              ) : (
                <View style={[s.stepMark, s.stepMarkTodo]} />
              )}
              {!last ? (
                <View style={[s.stepLine, step.done && s.stepLineDone]} />
              ) : null}
            </View>
            <View style={s.stepBody}>
              <AppText
                variant="bodyLarge"
                style={[
                  s.stepLabel,
                  step.done && s.stepLabelDone,
                  isNow && s.stepLabelNow,
                ]}
              >
                {step.label}
              </AppText>
              {isNow ? (
                <View style={s.nowTag}>
                  <AppText variant="label" style={s.nowTagText}>
                    {P.now}
                  </AppText>
                </View>
              ) : null}
            </View>
          </View>
        );
      })}
    </Section>
  );
}

/** The money: what is paid against the total, then the advance and the balance on their own. */
export function Payment({ data }: { data: WorkspaceViewModel }) {
  const p = data.payment;
  // No agreed amount means there is nothing honest to show here yet.
  if (!p.totalLabel) return null;
  const advanceTag =
    p.advanceState === 'paid'
      ? { text: P.advancePaid, style: s.tagPaid, textStyle: s.tagPaidText }
      : p.advanceState === 'cash_due'
      ? { text: P.advanceCashDue, style: s.tagCash, textStyle: s.tagCashText }
      : { text: P.advanceDue, style: s.tagDue, textStyle: s.tagDueText };

  return (
    <Section
      title={WORKSPACE_COPY.payment}
      icon="wallet-outline"
      colors={STAT_RING.paid}
    >
      <View style={s.payHead}>
        <AppText variant="display" style={s.payBig}>
          {p.paidHeadline}
        </AppText>
        <AppText variant="body" style={s.payOf}>
          {P.paidOf(p.totalLabel)}
        </AppText>
      </View>
      <View style={s.payTrack}>
        {p.paidPercent > 0 ? (
          <View style={[s.payFill, { width: `${p.paidPercent}%` }]}>
            <GradientFill colors={STAT_RING.paid} direction="across" />
          </View>
        ) : null}
      </View>

      <View style={s.payTiles}>
        {p.advanceLabel ? (
          <View style={[s.payTile, s.payTileAdvance]}>
            <AppText variant="label" style={s.payTileLabel}>
              {P.advance}
            </AppText>
            <AppText variant="h3" style={s.payTileValue}>
              {p.advanceLabel}
            </AppText>
            <View style={[s.tag, advanceTag.style]}>
              <AppText
                variant="label"
                style={[s.tagText, advanceTag.textStyle]}
              >
                {advanceTag.text}
              </AppText>
            </View>
          </View>
        ) : null}
        {p.balanceLabel ? (
          <View style={[s.payTile, s.payTileBalance]}>
            <AppText variant="label" style={s.payTileLabel}>
              {P.balance}
            </AppText>
            <AppText variant="h3" style={s.payTileValue}>
              {p.balanceLabel}
            </AppText>
            <View style={[s.tag, s.tagLater]}>
              <AppText variant="label" style={[s.tagText, s.tagLaterText]}>
                {P.balanceDue}
              </AppText>
            </View>
          </View>
        ) : null}
      </View>

      <View style={s.payFoot}>
        <EventlyIcon
          name={p.dueLabel ? 'information-outline' : 'check-decagram'}
          size={15}
          color={p.dueLabel ? '#7c5cdb' : '#0e8a68'}
        />
        <AppText variant="bodySmall" style={s.payFootText}>
          {p.dueLabel ? P.stillDue(p.dueLabel) : P.allPaid}
        </AppText>
      </View>
    </Section>
  );
}

export function Tasks({ data }: { data: WorkspaceViewModel }) {
  return (
    <Section
      title={WORKSPACE_COPY.vendors}
      icon="clipboard-check-outline"
      colors={STAT_RING.tasks}
      aside={
        data.tasksTotal > 0 ? `${data.tasksDone}/${data.tasksTotal}` : undefined
      }
    >
      {data.tasks.length === 0 ? (
        <Empty
          icon="clipboard-text-clock-outline"
          text={WORKSPACE_COPY.noTasks}
        />
      ) : (
        data.tasks.map((task, i) => {
          const color = TASK_STATUS_COLOR[task.status];
          const meta = [task.assigneeName, task.amountLabel, task.dueLabel]
            .filter(Boolean)
            .join(' · ');
          return (
            <View key={task.id} style={[s.task, i > 0 && s.taskDivider]}>
              <View style={[s.taskBar, { backgroundColor: color }]} />
              <View style={s.taskBody}>
                <View style={s.taskHead}>
                  <AppText variant="h3" style={s.taskTitle} numberOfLines={2}>
                    {task.title}
                  </AppText>
                  <View style={[s.taskPill, { backgroundColor: `${color}1f` }]}>
                    <AppText
                      variant="label"
                      style={[s.taskPillText, { color }]}
                    >
                      {task.statusLabel}
                    </AppText>
                  </View>
                </View>
                {meta ? (
                  <AppText variant="caption" style={s.taskMeta}>
                    {meta}
                  </AppText>
                ) : null}
              </View>
            </View>
          );
        })
      )}
    </Section>
  );
}

export function Timeline({ data }: { data: WorkspaceViewModel }) {
  return (
    <Section title={P.activity} icon="history" colors={['#5b9bff', '#2554b8']}>
      {data.timeline.length === 0 ? (
        <Empty icon="timeline-clock-outline" text={WORKSPACE_COPY.noTimeline} />
      ) : (
        data.timeline.map((entry, i) => (
          <View key={entry.id} style={s.log}>
            <View style={s.logRail}>
              <View style={[s.logDot, i === 0 && s.logDotLatest]}>
                {i === 0 ? (
                  <GradientFill
                    colors={WORKSPACE_ACTION_GRADIENT}
                    direction="diagonal"
                  />
                ) : null}
              </View>
              {i < data.timeline.length - 1 ? <View style={s.logLine} /> : null}
            </View>
            <View style={s.logBody}>
              <AppText
                variant="body"
                style={[s.logLabel, i === 0 && s.logLabelLatest]}
              >
                {entry.label}
              </AppText>
              {entry.note ? (
                <AppText variant="bodySmall" style={s.logNote}>
                  {entry.note}
                </AppText>
              ) : null}
              {entry.atLabel ? (
                <AppText variant="caption" style={s.logAt}>
                  {entry.atLabel}
                </AppText>
              ) : null}
            </View>
          </View>
        ))
      )}
    </Section>
  );
}
