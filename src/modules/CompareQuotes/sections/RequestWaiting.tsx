import { ScrollView, View } from 'react-native';
import {
  EventlyIcon,
  EventlyText,
  FadeInUp,
  GradientFill,
  PopIn,
  PressableScale,
} from '../../../Components';
import { WAITING_COPY as C } from '../constants';
import { waitingStyles as s } from '../styles';
import type { CompareViewModel, RecipientDTO } from '../types';

const CHECK_GRADIENT: [string, string] = ['#3cc9a1', '#0e8a68'];
const CTA_GRADIENT: [string, string] = ['#f47b4d', '#e2477a'];

/** One fact of the brief, with its mark. Absent when the brief left it out. */
function Fact({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  if (!value) return null;
  return (
    <View style={s.fact}>
      <View style={s.factIcon}>
        <EventlyIcon name={icon} size={18} color="#e2552f" />
      </View>
      <View style={s.factText}>
        <EventlyText variant="caption" style={s.factLabel}>
          {label}
        </EventlyText>
        <EventlyText variant="subtitle" style={s.factValue} numberOfLines={1}>
          {value}
        </EventlyText>
      </View>
    </View>
  );
}

/** A step of what happens next: done, happening now, or still to come. */
function Step({
  state,
  title,
  body,
  last,
}: {
  state: 'done' | 'now' | 'next';
  title: string;
  body: string;
  last?: boolean;
}) {
  return (
    <View style={s.step}>
      <View style={s.rail}>
        <View
          style={[
            s.dot,
            state === 'done' && s.dotDone,
            state === 'now' && s.dotNow,
          ]}
        >
          {state === 'done' ? (
            <EventlyIcon name="check" size={13} color="#ffffff" />
          ) : state === 'now' ? (
            <View style={s.dotPulse} />
          ) : null}
        </View>
        {last ? null : (
          <View style={[s.line, state === 'done' && s.lineDone]} />
        )}
      </View>
      <View style={s.stepText}>
        <EventlyText
          variant="subtitle"
          style={[s.stepTitle, state === 'next' && s.stepTitleNext]}
        >
          {title}
        </EventlyText>
        <EventlyText variant="caption" style={s.stepBody}>
          {body}
        </EventlyText>
      </View>
    </View>
  );
}

/** How many organizers are shown by name before the rest fold into "+ N more". */
const SHOWN = 4;

/**
 * Who the brief went to, by name — the answer to "sent to whom?". With no
 * quotes yet, everyone it went to is still awaited, so that list is the
 * recipients. An unaddressed brief (nobody matched every detail) says so
 * honestly rather than showing an empty list.
 */
function SentTo({
  count,
  recipients,
}: {
  count: number;
  recipients: RecipientDTO[];
}) {
  if (count === 0) {
    return (
      <View style={s.card}>
        <EventlyText variant="caption" style={s.cardLabel}>
          {C.sentToLabel}
        </EventlyText>
        <View style={[s.recipient, s.recipientFirst]}>
          <View style={[s.avatar, s.avatarOpen]}>
            <EventlyIcon
              name="map-marker-radius-outline"
              size={20}
              color="#e2552f"
            />
          </View>
          <View style={s.recipientText}>
            <EventlyText variant="subtitle" style={s.recipientName}>
              {C.sentToOpen}
            </EventlyText>
            <EventlyText variant="caption" style={s.recipientMeta}>
              {C.sentToOpenBody}
            </EventlyText>
          </View>
        </View>
      </View>
    );
  }
  const shown = recipients.slice(0, SHOWN);
  const more = count - shown.length;
  return (
    <View style={s.card}>
      <View style={s.cardHead}>
        <EventlyText variant="caption" style={s.cardLabel}>
          {C.sentToLabel}
        </EventlyText>
        <EventlyText variant="caption" style={s.sentToCount}>
          {C.sentToCount(count)}
        </EventlyText>
      </View>
      {shown.map((r, i) => (
        <View key={r.id} style={[s.recipient, i === 0 && s.recipientFirst]}>
          <View
            style={[s.avatar, { backgroundColor: r.avatarColor || '#e8633a' }]}
          >
            <EventlyText variant="caption" style={s.avatarText}>
              {r.initials}
            </EventlyText>
          </View>
          <View style={s.recipientText}>
            <EventlyText
              variant="subtitle"
              style={s.recipientName}
              numberOfLines={1}
            >
              {r.name}
            </EventlyText>
            {r.rating > 0 || r.tier ? (
              <EventlyText
                variant="caption"
                style={s.recipientMeta}
                numberOfLines={1}
              >
                {[r.rating > 0 ? `★ ${r.rating.toFixed(1)}` : '', r.tier]
                  .filter(Boolean)
                  .join(' · ')}
              </EventlyText>
            ) : null}
          </View>
          <View style={s.waitingPill}>
            <EventlyText variant="caption" style={s.waitingText}>
              {C.awaitingQuote}
            </EventlyText>
          </View>
        </View>
      ))}
      {more > 0 ? (
        <EventlyText variant="caption" style={s.moreText}>
          {C.sentToMore(more)}
        </EventlyText>
      ) : null}
    </View>
  );
}

/**
 * A request with no quotes on it yet.
 *
 * Straight after sending it from Home (`justSent`) this is a confirmation —
 * the moment the customer's brief went out — so it says so, shows what was
 * sent, and what happens next. Opened later, the same page reads as the
 * request's status: still waiting on organizers.
 */
export function RequestWaiting({
  model,
  justSent,
  onHome,
}: {
  model: CompareViewModel | null;
  justSent: boolean;
  onHome: () => void;
}) {
  return (
    <View style={s.root}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.hero}>
          <PopIn>
            <View style={s.badgeHalo}>
              <View style={s.badge}>
                <GradientFill colors={CHECK_GRADIENT} direction="diagonal" />
                <EventlyIcon
                  name={justSent ? 'check-bold' : 'timer-sand'}
                  size={34}
                  color="#ffffff"
                />
              </View>
            </View>
          </PopIn>
          <FadeInUp delay={120}>
            <EventlyText variant="h1" style={s.title}>
              {justSent ? C.sentTitle : C.waitingTitle}
            </EventlyText>
            <EventlyText variant="body" style={s.lead}>
              {model?.title && model.sentToCount > 0
                ? C.leadSent(model.sentToCount, model.title)
                : model?.title
                ? C.lead(model.title)
                : C.leadPlain}
            </EventlyText>
          </FadeInUp>
        </View>

        {model ? (
          <FadeInUp delay={220}>
            <View style={s.card}>
              <View style={s.cardHead}>
                <EventlyText variant="caption" style={s.cardLabel}>
                  {C.briefLabel}
                </EventlyText>
                <View style={s.statusPill}>
                  <View style={s.statusDot} />
                  <EventlyText variant="caption" style={s.statusText}>
                    {C.statusOpen}
                  </EventlyText>
                </View>
              </View>
              <EventlyText variant="h2" style={s.cardTitle} numberOfLines={1}>
                {model.title}
              </EventlyText>
              <View style={s.facts}>
                <Fact
                  icon="calendar-blank-outline"
                  label={C.factDate}
                  value={model.brief.date}
                />
                <Fact
                  icon="map-marker-outline"
                  label={C.factPlace}
                  value={model.brief.place}
                />
                <Fact
                  icon="account-group-outline"
                  label={C.factGuests}
                  value={model.brief.guests}
                />
              </View>
            </View>
          </FadeInUp>
        ) : null}

        {model ? (
          <FadeInUp delay={280}>
            <SentTo count={model.sentToCount} recipients={model.awaiting} />
          </FadeInUp>
        ) : null}

        <FadeInUp delay={340}>
          <View style={s.card}>
            <EventlyText variant="caption" style={s.cardLabel}>
              {C.nextLabel}
            </EventlyText>
            <View style={s.steps}>
              <Step state="done" title={C.step1Title} body={C.step1Body} />
              <Step state="now" title={C.step2Title} body={C.step2Body} />
              <Step state="next" title={C.step3Title} body={C.step3Body} last />
            </View>
          </View>
        </FadeInUp>
      </ScrollView>

      <View style={s.footer}>
        <PressableScale
          style={s.cta}
          onPress={onHome}
          accessibilityRole="button"
          accessibilityLabel={C.home}
          testID="compare-sent-home"
        >
          <GradientFill colors={CTA_GRADIENT} direction="across" />
          <EventlyIcon name="home-variant-outline" size={18} color="#ffffff" />
          <EventlyText variant="subtitle" style={s.ctaText}>
            {C.home}
          </EventlyText>
        </PressableScale>
      </View>
    </View>
  );
}
