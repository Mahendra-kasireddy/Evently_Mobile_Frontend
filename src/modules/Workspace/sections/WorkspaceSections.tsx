import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { TASK_STATUS_COLOR, WORKSPACE_ACCENT, WORKSPACE_COPY } from '../constants';
import {
  factStyles,
  milestoneStyles,
  paymentStyles,
  sectionStyles,
  taskStyles,
  timelineStyles,
} from '../styles';
import type { WorkspaceViewModel } from '../types';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.section}>
      <EventlyText variant="h2" style={sectionStyles.title}>
        {title}
      </EventlyText>
      <View style={sectionStyles.card}>{children}</View>
    </View>
  );
}

/** The four booking milestones, ticked as the organizer completes them. */
export function Milestones({ data }: { data: WorkspaceViewModel }) {
  if (data.steps.length === 0) return null;

  return (
    <Section title={WORKSPACE_COPY.milestones}>
      {data.steps.map((step) => (
        <View
          key={step.label}
          style={milestoneStyles.row}
          accessibilityLabel={`${step.label}: ${step.done ? 'done' : 'not yet'}`}
        >
          <View style={[milestoneStyles.dot, step.done && milestoneStyles.dotDone]}>
            {step.done ? <EventlyIcon name="check" size={12} color={colors.onPrimary} /> : null}
          </View>
          <EventlyText
            variant="body"
            style={[milestoneStyles.label, step.done && milestoneStyles.labelDone]}
          >
            {step.label}
          </EventlyText>
        </View>
      ))}
    </Section>
  );
}

/** Date, place, organizer and reference — whichever the booking carries. */
export function EventFacts({ data }: { data: WorkspaceViewModel }) {
  if (data.facts.length === 0) return null;

  return (
    <Section title={WORKSPACE_COPY.details}>
      {data.facts.map((fact, i) => (
        <View key={fact.label} style={[factStyles.row, i > 0 && factStyles.divider]}>
          <View style={factStyles.iconChip}>
            <EventlyIcon name={fact.icon} size={17} color={WORKSPACE_ACCENT} />
          </View>
          <View style={factStyles.text}>
            <EventlyText variant="caption" style={factStyles.label}>
              {fact.label}
            </EventlyText>
            <EventlyText variant="body" style={factStyles.value} numberOfLines={2}>
              {fact.value}
            </EventlyText>
          </View>
        </View>
      ))}
    </Section>
  );
}

export function Payment({ data }: { data: WorkspaceViewModel }) {
  // No agreed amount means there is nothing honest to show here yet.
  if (!data.payment.totalLabel) return null;

  return (
    <Section title={WORKSPACE_COPY.payment}>
      <View style={paymentStyles.statusRow}>
        <EventlyText variant="body" style={paymentStyles.statusLabel}>
          {data.payment.statusLabel}
        </EventlyText>
        <EventlyText variant="body" style={paymentStyles.total}>
          of {data.payment.totalLabel}
        </EventlyText>
      </View>
      <View style={paymentStyles.track}>
        <View style={[paymentStyles.fill, { width: `${data.payment.paidPercent}%` }]} />
      </View>
      <View style={paymentStyles.amounts}>
        <View>
          <EventlyText variant="caption" style={paymentStyles.amountLabel}>
            Paid
          </EventlyText>
          <EventlyText variant="body" style={paymentStyles.amountValue}>
            {data.payment.paidLabel || '—'}
          </EventlyText>
        </View>
        <View>
          <EventlyText variant="caption" style={paymentStyles.amountLabel}>
            Still due
          </EventlyText>
          <EventlyText variant="body" style={paymentStyles.amountValue}>
            {data.payment.dueLabel || '—'}
          </EventlyText>
        </View>
      </View>
    </Section>
  );
}

export function Tasks({ data }: { data: WorkspaceViewModel }) {
  return (
    <Section title={WORKSPACE_COPY.vendors}>
      {data.tasks.length === 0 ? (
        <EventlyText variant="body" style={sectionStyles.emptyText}>
          {WORKSPACE_COPY.noTasks}
        </EventlyText>
      ) : (
        data.tasks.map((task, i) => {
          const color = TASK_STATUS_COLOR[task.status];
          const meta = [task.assigneeName, task.amountLabel, task.dueLabel].filter(Boolean).join(' · ');
          return (
            <View key={task.id} style={[taskStyles.row, i > 0 && taskStyles.divider]}>
              <View style={taskStyles.headRow}>
                <EventlyText variant="body" style={taskStyles.title} numberOfLines={2}>
                  {task.title}
                </EventlyText>
                <View style={[taskStyles.statusPill, { backgroundColor: `${color}22` }]}>
                  <EventlyText variant="caption" style={[taskStyles.statusText, { color }]}>
                    {task.statusLabel}
                  </EventlyText>
                </View>
              </View>
              {meta ? (
                <EventlyText variant="caption" style={taskStyles.meta}>
                  {meta}
                </EventlyText>
              ) : null}
            </View>
          );
        })
      )}
    </Section>
  );
}

export function Timeline({ data }: { data: WorkspaceViewModel }) {
  return (
    <Section title={WORKSPACE_COPY.timeline}>
      {data.timeline.length === 0 ? (
        <EventlyText variant="body" style={sectionStyles.emptyText}>
          {WORKSPACE_COPY.noTimeline}
        </EventlyText>
      ) : (
        data.timeline.map((entry, i) => (
          <View key={entry.id} style={timelineStyles.row}>
            <View style={timelineStyles.rail}>
              <View style={timelineStyles.dot} />
              {i < data.timeline.length - 1 ? <View style={timelineStyles.line} /> : null}
            </View>
            <View style={timelineStyles.body}>
              <EventlyText variant="body" style={timelineStyles.label}>
                {entry.label}
              </EventlyText>
              {entry.note ? (
                <EventlyText variant="caption" style={timelineStyles.note}>
                  {entry.note}
                </EventlyText>
              ) : null}
              {entry.atLabel ? (
                <EventlyText variant="caption" style={timelineStyles.at}>
                  {entry.atLabel}
                </EventlyText>
              ) : null}
            </View>
          </View>
        ))
      )}
    </Section>
  );
}
