import { ActivityIndicator, Modal, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { organizerSheetStyles as s } from '../styles';
import type { OrganizerProfileDTO } from '../types';

interface OrganizerProfileSheetProps {
  /** Non-null while the sheet is open — the organizer being looked at. */
  organizerId: string | null;
  profile: OrganizerProfileDTO | null;
  isLoading: boolean;
  errorMessage: string | null;
  onClose: () => void;
}

/** A fact worth showing only when the profile actually carries it. */
function Fact({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <View style={s.factRow}>
      <EventlyText variant="body" style={s.factLabel}>
        {label}
      </EventlyText>
      <EventlyText variant="body" style={s.factValue} numberOfLines={2}>
        {value}
      </EventlyText>
    </View>
  );
}

/**
 * "View Profile" from an organizer card.
 *
 * Reads `GET /organizer/getOrganizerById/:id`, the same sanitized public view
 * the web profile page uses. It opens as a sheet rather than a screen because
 * the mobile navigator has no organizer route yet — and a button labelled
 * "View Profile" should show the profile, not lead somewhere else.
 *
 * Every row below is omitted when the organizer has not supplied that detail,
 * so an incomplete profile reads as short rather than as a form of blanks.
 */
export function OrganizerProfileSheet({
  organizerId,
  profile,
  isLoading,
  errorMessage,
  onClose,
}: OrganizerProfileSheetProps) {
  const capacity =
    profile && profile.capacityMin > 0 && profile.capacityMax > 0
      ? `${profile.capacityMin}–${profile.capacityMax} guests`
      : '';
  const reviews =
    profile && profile.reviews > 0
      ? `${profile.rating.toFixed(1)} from ${profile.reviews} review${profile.reviews === 1 ? '' : 's'}`
      : 'No reviews yet';

  return (
    <Modal visible={organizerId !== null} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose}>
        <Pressable style={s.container} onPress={() => {}}>
          <View style={s.grabber} />

          {isLoading && !profile ? (
            <View style={s.centered}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : errorMessage && !profile ? (
            <View style={s.centered}>
              <EventlyText variant="body" style={s.errorText}>
                {errorMessage}
              </EventlyText>
            </View>
          ) : profile ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={s.head}>
                <View style={[s.avatar, { backgroundColor: profile.avatarColor }]}>
                  <EventlyText variant="subtitle" style={s.avatarText}>
                    {profile.initials}
                  </EventlyText>
                </View>
                <View style={s.headText}>
                  <EventlyText variant="h2" style={s.name} numberOfLines={2}>
                    {profile.displayName || profile.name}
                  </EventlyText>
                  <EventlyText variant="caption" style={s.meta}>
                    {[profile.tier, profile.location || profile.city].filter(Boolean).join(' · ')}
                  </EventlyText>
                </View>
              </View>

              {profile.tags.length > 0 ? (
                <View style={s.tagRow}>
                  {profile.tags.map((tag) => (
                    <EventlyText key={tag} variant="caption" style={s.tag}>
                      {tag}
                    </EventlyText>
                  ))}
                </View>
              ) : null}

              <View style={s.facts}>
                <Fact label="Rating" value={reviews} />
                <Fact label="Events run" value={profile.events > 0 ? `${profile.events}` : ''} />
                <Fact label="Guests" value={capacity} />
                <Fact label="Typical budget" value={profile.estRange} />
                <Fact label="Occasions" value={profile.occasions.join(', ')} />
                <Fact
                  label="Usually replies in"
                  value={profile.responseHours > 0 ? `${profile.responseHours} hours` : ''}
                />
                <Fact label="Business" value={profile.businessName} />
              </View>

              <TouchableOpacity
                style={s.closeButton}
                activeOpacity={0.8}
                onPress={onClose}
                accessibilityRole="button"
              >
                <EventlyText variant="subtitle" style={s.closeText}>
                  Close
                </EventlyText>
              </TouchableOpacity>
            </ScrollView>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default OrganizerProfileSheet;
