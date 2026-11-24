import { View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { EVENT_COPY } from '../constants';
import { DANGER, ORG_ACCENT, ORG_INK, WARM_INK } from '../design';
import { respondStyles as s } from '../styles';
import type { RespondModel } from '../types';
import { ActionButton } from './ActionButton';

const COPY = EVENT_COPY.respond;

/**
 * The accept/decline gate: how long is left, what the customer has paid, and
 * two big buttons. Shown only while the backend would still take an answer.
 */
export function RespondCard({
  respond,
  accepting,
  disabled,
  onAccept,
  onDecline,
}: {
  respond: RespondModel;
  accepting: boolean;
  disabled: boolean;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const ink = respond.urgent ? DANGER : WARM_INK;
  return (
    <View style={s.card}>
      <View style={s.headRow}>
        <View style={s.icon}>
          <EventlyIcon
            name="hand-wave-outline"
            size={22}
            color={ORG_ACCENT.saffron}
          />
        </View>
        <View style={s.headText}>
          <AppText variant="h3" style={s.title}>
            {COPY.title}
          </AppText>
          <AppText variant="bodySmall" style={s.body}>
            {COPY.body}
          </AppText>
        </View>
      </View>

      {respond.countdown || respond.deadline ? (
        <View style={[s.timer, respond.urgent && s.timerUrgent]}>
          <EventlyIcon name="timer-sand" size={20} color={ink} />
          <View style={s.timerText}>
            {respond.countdown ? (
              <AppText
                variant="body"
                style={[s.timerLeft, respond.urgent && s.urgentText]}
              >
                {respond.countdown}
              </AppText>
            ) : null}
            {respond.deadline ? (
              <AppText
                variant="caption"
                style={[s.timerDeadline, respond.urgent && s.urgentText]}
              >
                {respond.deadline}
              </AppText>
            ) : null}
          </View>
        </View>
      ) : null}

      <View style={s.payRow}>
        <EventlyIcon name="cash-check" size={18} color={ORG_ACCENT.jade} />
        <AppText variant="bodySmall" style={s.payText}>
          {respond.paymentNote}
        </AppText>
      </View>

      <View style={s.actions}>
        <ActionButton
          title={accepting ? COPY.accepting : COPY.accept}
          icon="check"
          onPress={onAccept}
          loading={accepting}
          disabled={disabled}
        />
        <ActionButton
          title={COPY.decline}
          icon="close"
          kind="ghost"
          onPress={onDecline}
          disabled={disabled || accepting}
        />
      </View>
    </View>
  );
}

/** Awaiting, but past the deadline — nothing to press, just what happens next. */
export function LapsedCard() {
  return (
    <View style={s.card}>
      <View style={s.headRow}>
        <View style={s.icon}>
          <EventlyIcon
            name="timer-off-outline"
            size={22}
            color={ORG_INK.inkSoft}
          />
        </View>
        <View style={s.headText}>
          <AppText variant="h3" style={s.title}>
            {COPY.lapsedTitle}
          </AppText>
          <AppText variant="bodySmall" style={s.body}>
            {COPY.lapsedBody}
          </AppText>
        </View>
      </View>
    </View>
  );
}

export default RespondCard;
