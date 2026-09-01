import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { WORKSPACE_ACCENT, WORKSPACE_COPY } from '../constants';
import { sectionStyles, summaryRowStyles as s } from '../styles';
import type { IdeaCounts, InvitationDTO } from '../types';

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

interface IdeasSummaryProps {
  counts: IdeaCounts | null;
  organizerName: string | null;
  onPress: () => void;
}

/**
 * The ideas & planning board, summarised.
 *
 * The line under the title is the board's real state — how many ideas the
 * customer has shared, how many the organizer has turned into a plan, and how
 * many are waiting on the customer's sign-off. Before anything has been
 * shared it says what the board is for instead of reporting three zeros.
 */
export function IdeasSummary({ counts, organizerName, onPress }: IdeasSummaryProps) {
  const organizer = organizerName ?? 'your organizer';
  const shared = counts?.shared ?? 0;
  const started = shared > 0;

  const body = started
    ? `${shared} ${shared === 1 ? 'idea' : 'ideas'} shared · ${counts?.planned ?? 0} planned · ${
        counts?.awaitingApproval ?? 0
      } awaiting your approval`
    : 'Themes, must-haves, the things you keep picturing — they turn each one into a plan.';

  return (
    <Section title={WORKSPACE_COPY.ideas}>
      <View style={s.row}>
        <View style={s.iconChip}>
          <EventlyIcon name="lightbulb-on-outline" size={22} color={WORKSPACE_ACCENT} />
        </View>
        <View style={s.text}>
          <EventlyText variant="body" style={s.title}>
            {started ? `Your ideas with ${organizer}` : `Share your ideas with ${organizer}`}
          </EventlyText>
          <EventlyText variant="caption" style={s.body}>
            {body}
          </EventlyText>
        </View>
        <TouchableOpacity
          style={s.cta}
          activeOpacity={0.85}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${started ? 'Open' : 'Start'} the ideas and planning board`}
        >
          <EventlyText variant="caption" style={s.ctaText}>
            {started ? 'Open' : 'Start'}
          </EventlyText>
          <EventlyIcon name="chevron-right" size={15} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </Section>
  );
}

interface InvitationSummaryProps {
  /** null while the invitation is still the organizer's draft. */
  invitation: InvitationDTO | null;
  organizerName: string | null;
  onPress: () => void;
}

/**
 * The guest invitation, summarised — in all three of its states, none of them
 * silently absent:
 *
 *   not shared   the organizer is still drafting it (the API 404s that case),
 *                so this reads as a pending step rather than an error
 *   sent         ready for the customer to review and sign off
 *   approved     signed off; the guest link is live
 *
 * Both live states open the invitation screen rather than acting from here:
 * approving is a decision made after reading the thing, not a button pressed
 * on a summary card.
 */
export function InvitationSummary({ invitation, organizerName, onPress }: InvitationSummaryProps) {
  const organizer = organizerName ?? 'Your organizer';

  if (!invitation) {
    return (
      <Section title={WORKSPACE_COPY.invitation}>
        <EventlyText variant="body" style={s.pendingText}>
          {organizer} is still preparing your guest invitation. You'll be able to review and approve
          it here as soon as they share it.
        </EventlyText>
      </Section>
    );
  }

  const approved = invitation.status === 'approved';

  return (
    <Section title={WORKSPACE_COPY.invitation}>
      <View style={s.row}>
        <View style={s.iconChip}>
          <EventlyIcon name="email-heart-outline" size={22} color={WORKSPACE_ACCENT} />
        </View>
        <View style={s.text}>
          <EventlyText variant="body" style={s.title}>
            {approved ? 'Your invitation is approved' : 'Your invitation is ready to review'}
          </EventlyText>
          <EventlyText variant="caption" style={s.body}>
            {organizer} prepared it · {approved ? 'the guest link is live' : 'awaiting your approval'}
          </EventlyText>
        </View>
        <TouchableOpacity
          style={[s.cta, approved && s.ctaGhost]}
          activeOpacity={0.85}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${approved ? 'View' : 'Review'} your guest invitation`}
        >
          <EventlyText variant="caption" style={approved ? s.ctaGhostText : s.ctaText}>
            {approved ? 'View' : 'Review'}
          </EventlyText>
          <EventlyIcon
            name="chevron-right"
            size={15}
            color={approved ? colors.text : colors.onPrimary}
          />
        </TouchableOpacity>
      </View>
    </Section>
  );
}
