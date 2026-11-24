import { View } from 'react-native';
import { AppText, EventlyIcon, GradientFill } from '../../../Components';
import { SETUP_COPY as COPY } from '../constants';
import { CHANGES_TONE, PHASE_TONE } from '../design';
import { phaseStyles as s } from '../styles';
import type { HubModel } from '../types';

/**
 * Where the profile stands once it has left the organizer's hands: with us
 * for review, live, refused, or not yet admitted to setup.
 */
export function PhaseCard({ hub }: { hub: HubModel }) {
  if (hub.phase === 'setup' || hub.phase === 'changes') return null;
  const tone = PHASE_TONE[hub.phase];
  const text = {
    submitted: { title: COPY.submittedTitle, body: COPY.submittedBody },
    approved: { title: COPY.approvedTitle, body: COPY.approvedBody },
    rejected: {
      title: COPY.rejectedTitle,
      body: hub.reviewNote || COPY.rejectedBody,
    },
    pending: { title: COPY.pendingTitle, body: COPY.pendingBody },
  }[hub.phase];

  return (
    <View
      style={s.card}
      accessible
      accessibilityLabel={`${text.title}. ${text.body}`}
    >
      <View style={s.badge}>
        <GradientFill colors={tone.gradient} direction="diagonal" />
        <EventlyIcon name={tone.icon} size={22} color="#ffffff" />
      </View>
      <View style={s.text}>
        <AppText variant="h3" style={s.title}>
          {text.title}
        </AppText>
        <AppText variant="bodySmall" style={s.body}>
          {text.body}
        </AppText>
      </View>
    </View>
  );
}

/** The admin's note when they sent the profile back for changes. */
export function ReviewBanner({ note }: { note: string }) {
  return (
    <View style={s.banner} accessibilityRole="alert">
      <EventlyIcon name="alert-outline" size={20} color={CHANGES_TONE.ink} />
      <View style={s.bannerText}>
        <AppText variant="bodySmall" style={s.bannerTitle}>
          {COPY.changesTitle}
        </AppText>
        <AppText variant="caption" style={s.bannerBody}>
          {note || COPY.changesBody}
        </AppText>
      </View>
    </View>
  );
}

export default PhaseCard;
