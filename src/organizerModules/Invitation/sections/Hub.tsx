import { Fragment } from 'react';
import { Pressable, View } from 'react-native';
import {
  AppText,
  EventlyIcon,
  GradientFill,
  PressableScale,
} from '../../../Components';
import { INVITATION_COPY as COPY, SECTION_META } from '../constants';
import {
  CHANGES_TONE,
  DANGER,
  ORG_ACCENT,
  ORG_INK,
  PHASE_TONE,
  WHITE,
} from '../design';
import {
  noticeStyles as n,
  requestStyles as r,
  sectionCardStyles as c,
  statusStyles as s,
} from '../styles';
import type {
  ChangeRequestModel,
  HubModel,
  Notice,
  SectionCardModel,
} from '../types';
import { SecondaryButton } from './Buttons';

/** What just happened — a success, or why something didn't. */
export function NoticeBar({
  notice,
  onDismiss,
}: {
  notice: Notice;
  onDismiss: () => void;
}) {
  const ok = notice.tone === 'ok';
  const ink = ok ? ORG_ACCENT.jade : DANGER.ink;
  return (
    <View style={[n.bar, ok ? n.ok : n.error]} accessibilityLiveRegion="polite">
      <EventlyIcon
        name={ok ? 'check-circle-outline' : 'alert-circle-outline'}
        size={18}
        color={ink}
      />
      <AppText
        variant="bodySmall"
        style={[n.text, ok ? n.textOk : n.textError]}
      >
        {notice.text}
      </AppText>
      <Pressable
        onPress={onDismiss}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={COPY.close}
      >
        <EventlyIcon name="close" size={18} color={ink} />
      </Pressable>
    </View>
  );
}

/** Where the invitation stands: its status, the three steps, and what that means. */
export function StatusCard({ hub, title }: { hub: HubModel; title: string }) {
  const tone = PHASE_TONE[hub.phase];
  const chipTone = { backgroundColor: tone.soft };
  const chipInk = { color: tone.ink };
  return (
    <View style={s.card}>
      <View style={s.head}>
        <View style={s.headText}>
          <AppText variant="overline" style={s.eyebrow}>
            {COPY.title}
          </AppText>
          {title ? (
            <AppText variant="h2" style={s.title} numberOfLines={2}>
              {title}
            </AppText>
          ) : null}
        </View>
        <View style={[s.chip, chipTone]}>
          <EventlyIcon name={tone.icon} size={14} color={tone.ink} />
          <AppText variant="label" style={[s.chipText, chipInk]}>
            {hub.phaseLabel}
          </AppText>
        </View>
      </View>

      <View
        style={s.steps}
        accessible
        accessibilityLabel={`${COPY.progressLabel}: ${hub.steps
          .map(step => `${step.label}${step.done ? ' ✓' : ''}`)
          .join(', ')}`}
      >
        {hub.steps.map((step, index) => (
          <Fragment key={step.key}>
            {index > 0 ? (
              <View style={[s.line, step.done && s.lineDone]} />
            ) : null}
            <View style={s.step}>
              <View style={[s.dot, step.done && s.dotDone]}>
                {step.done ? (
                  <>
                    <GradientFill
                      colors={[ORG_ACCENT.jade, '#14745b']}
                      direction="diagonal"
                    />
                    <EventlyIcon name="check" size={14} color={WHITE} />
                  </>
                ) : (
                  <AppText variant="label" style={s.dotText}>
                    {String(index + 1)}
                  </AppText>
                )}
              </View>
              <AppText
                variant="caption"
                style={[s.stepLabel, step.done && s.stepLabelDone]}
                numberOfLines={2}
              >
                {step.label}
              </AppText>
            </View>
          </Fragment>
        ))}
      </View>

      <AppText variant="bodySmall" style={s.body}>
        {hub.phaseBody}
      </AppText>
      {hub.unsentNote ? (
        <View style={s.unsent}>
          <EventlyIcon
            name="pencil-circle-outline"
            size={16}
            color={ORG_ACCENT.saffron}
          />
          <AppText variant="caption" style={s.unsentText}>
            {hub.unsentNote}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

/** The customer's open asks, each with Mark resolved. */
export function RequestsCard({
  requests,
  resolvingId,
  onResolve,
}: {
  requests: ChangeRequestModel[];
  resolvingId: string | null;
  onResolve: (id: string) => void;
}) {
  if (!requests.length) return null;
  return (
    <View style={r.card}>
      <View style={r.head}>
        <EventlyIcon
          name="message-alert-outline"
          size={18}
          color={CHANGES_TONE.ink}
        />
        <View style={r.headText}>
          <AppText variant="body" style={r.title}>
            {`${COPY.asksTitle} (${requests.length})`}
          </AppText>
          <AppText variant="caption" style={r.lead}>
            {COPY.asksLead}
          </AppText>
        </View>
      </View>
      {requests.map(req => (
        <View key={req.id} style={r.item}>
          <View style={r.itemHead}>
            <AppText variant="bodySmall" style={r.itemTitle} numberOfLines={1}>
              {req.title}
            </AppText>
            {req.when ? (
              <AppText variant="caption" style={r.when}>
                {req.when}
              </AppText>
            ) : null}
          </View>
          <AppText variant="bodySmall" style={r.note}>
            {req.note}
          </AppText>
          <View style={r.action}>
            <SecondaryButton
              title={COPY.asksResolve}
              icon="check"
              small
              onPress={() => onResolve(req.id)}
              loading={resolvingId === req.id}
              disabled={!!resolvingId && resolvingId !== req.id}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

/** One section on the hub: icon, title, done or what it still needs. */
export function SectionCard({
  card,
  onPress,
}: {
  card: SectionCardModel;
  onPress: () => void;
}) {
  const done = card.state === 'done';
  return (
    <PressableScale
      style={c.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${card.title}. ${card.line}`}
    >
      <View style={[c.iconTile, done && c.doneTile]}>
        {done ? (
          <EventlyIcon name="check" size={22} color={ORG_ACCENT.jade} />
        ) : (
          <>
            <GradientFill
              colors={SECTION_META[card.id].gradient}
              direction="diagonal"
            />
            <EventlyIcon name={card.icon} size={21} color={WHITE} />
          </>
        )}
      </View>
      <View style={c.text}>
        <AppText variant="body" style={c.title} numberOfLines={1}>
          {card.title}
        </AppText>
        <AppText
          variant="caption"
          style={[
            c.line,
            done && c.lineDone,
            (card.state === 'optional' || card.state === 'info') && c.lineMuted,
          ]}
          numberOfLines={2}
        >
          {done ? `✓ ${card.line}` : card.line}
        </AppText>
      </View>
      <EventlyIcon name="chevron-right" size={20} color={ORG_INK.inkFaint} />
    </PressableScale>
  );
}

/** Opens the guest preview. */
export function PreviewRow({ onPress }: { onPress: () => void }) {
  return (
    <PressableScale
      style={c.preview}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={COPY.preview}
    >
      <View style={c.previewIcon}>
        <EventlyIcon name="eye-outline" size={20} color={ORG_ACCENT.lapis} />
      </View>
      <View style={c.text}>
        <AppText variant="body" style={c.title}>
          {COPY.preview}
        </AppText>
        <AppText variant="caption" style={c.lineMuted}>
          {COPY.previewHint}
        </AppText>
      </View>
      <EventlyIcon name="chevron-right" size={20} color={ORG_INK.inkFaint} />
    </PressableScale>
  );
}
