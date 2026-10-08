import { View } from 'react-native';
import {
  EventlyIcon,
  EventlyText,
  GradientFill,
  PressableScale,
} from '../../../Components';
import { INVITATION_COPY as COPY } from '../constants';
import { switchStyles as s } from '../styles';

/** The three parts of what a guest gets, each with a page of its own here. */
export type InvitationSection = 'invitation' | 'live' | 'memories';

const SECTIONS: Array<{ key: InvitationSection; label: string; icon: string }> =
  [
    {
      key: 'invitation',
      label: COPY.sectionInvitation,
      icon: 'email-open-outline',
    },
    { key: 'live', label: COPY.sectionLive, icon: 'broadcast' },
    {
      key: 'memories',
      label: COPY.sectionMemories,
      icon: 'image-multiple-outline',
    },
  ];

const ACTIVE_GRADIENT: [string, string] = ['#f47b4d', '#e2477a'];

/**
 * Invitation · Live stream · Memories.
 *
 * Separate here, because they are separate jobs for the customer — approving
 * a design, watching a stream, collecting photos. Not separate for guests:
 * all three live behind the one guest link (see OneLinkNote).
 */
export function SectionSwitch({
  value,
  onChange,
  liveNow,
}: {
  value: InvitationSection;
  onChange: (next: InvitationSection) => void;
  /** A stream is on air: the Live tab says so from wherever the customer is. */
  liveNow: boolean;
}) {
  return (
    <View style={s.row} accessibilityRole="tablist">
      {SECTIONS.map(item => {
        const active = item.key === value;
        return (
          <PressableScale
            key={item.key}
            style={[s.tab, active && s.tabActive]}
            onPress={() => onChange(item.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={item.label}
            testID={`invitation-section-${item.key}`}
          >
            {active ? (
              <GradientFill colors={ACTIVE_GRADIENT} direction="across" />
            ) : null}
            <EventlyIcon
              name={item.icon}
              size={15}
              color={active ? '#ffffff' : '#6b6488'}
            />
            <EventlyText
              variant="caption"
              style={[s.label, active && s.labelActive]}
              numberOfLines={1}
            >
              {item.label}
            </EventlyText>
            {item.key === 'live' && liveNow ? (
              <View style={[s.liveDot, active && s.liveDotActive]} />
            ) : null}
          </PressableScale>
        );
      })}
    </View>
  );
}

/**
 * "Guests already have this."
 *
 * The answer to "if these are separate, do I share three times?" — no. The
 * guest link opens the invitation, and the live stream and the memories
 * appear on that same page when there is something in them. So this note sits
 * on the Live and Memories pages, and its button (once the invitation is
 * approved) shares that same single link — useful as a "we're live" nudge.
 */
export function OneLinkNote({
  body,
  approved,
  onShare,
}: {
  body: string;
  approved: boolean;
  onShare: () => void;
}) {
  return (
    <View style={s.note}>
      <View style={s.noteIcon}>
        <EventlyIcon name="link-variant" size={18} color="#5a35e0" />
      </View>
      <View style={s.noteText}>
        <EventlyText variant="subtitle" style={s.noteTitle}>
          {COPY.oneLinkTitle}
        </EventlyText>
        <EventlyText variant="caption" style={s.noteBody}>
          {approved ? body : COPY.oneLinkPending}
        </EventlyText>
        {approved ? (
          <PressableScale
            style={s.noteButton}
            onPress={onShare}
            accessibilityRole="button"
            accessibilityLabel={COPY.oneLinkShare}
            testID="invitation-one-link-share"
          >
            <EventlyIcon name="whatsapp" size={15} color="#128c4a" />
            <EventlyText variant="caption" style={s.noteButtonText}>
              {COPY.oneLinkShare}
            </EventlyText>
          </PressableScale>
        ) : null}
      </View>
    </View>
  );
}

/** An empty page that says what will appear, and when. */
export function SectionEmpty({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <View style={s.empty}>
      <View style={s.emptyIcon}>
        <EventlyIcon name={icon} size={26} color="#e2477a" />
      </View>
      <EventlyText variant="subtitle" style={s.emptyTitle}>
        {title}
      </EventlyText>
      <EventlyText variant="caption" style={s.emptyBody}>
        {body}
      </EventlyText>
    </View>
  );
}
