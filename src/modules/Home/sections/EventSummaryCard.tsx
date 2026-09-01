import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import {
  EVENT_SUMMARY_DRAFT_CTA,
  EVENT_SUMMARY_EMPTY,
  EVENT_SUMMARY_ERROR,
  EVENT_SUMMARY_FIELD_EMPTY,
  EVENT_SUMMARY_OPEN_CTA,
  HERO_ACCENT_COLOR,
  HERO_FIELD_ICON_NAME,
  HERO_FIELD_LABEL,
  HERO_FIELD_ORDER,
} from '../constants';
import { eventSummaryStyles as s } from '../styles';
import type { CurrentEventViewModel, HeroDraft } from '../types';

interface EventSummaryCardProps {
  /** The customer's real event, or null when they have none yet. */
  event: CurrentEventViewModel | null;
  /** The planner draft, shown only while there is no real event to show. */
  draft: HeroDraft | null;
  /** Header above the card — differs between a real event and a draft. */
  label: string;
  /** True on the first load, before anything has arrived. */
  isLoading: boolean;
  /** Set when the feed failed; the card offers a retry instead of guessing. */
  errorMessage: string | null;
  /** True while "Get quotes" is in flight. */
  isSubmitting: boolean;
  /** Opens the real event. */
  onPressEvent: () => void;
  /** Opens the picker for one draft field. */
  onEditDraft: (field: keyof HeroDraft) => void;
  /** Sends the draft as a quote request. */
  onSubmitDraft: () => void;
  /** Refetches the home feed after an error. */
  onRetry: () => void;
}

/**
 * The white card that floats at the foot of the Home hero: occasion, when,
 * where and guests, one row each, scannable without opening anything.
 *
 * It has two modes, and the difference matters.
 *
 * With a real event, every value comes from `GET /home/getHomeFeed`'s
 * `currentEvent` — the signed-in customer's furthest-along record (booking >
 * quote request > plan). A field that record does not carry shows its own
 * "not set" copy rather than a plausible-looking date, city or headcount, and
 * each row's chevron points right because tapping it opens the event.
 *
 * With no event yet, the same rows become the planner: they show the draft the
 * customer is assembling, each chevron points down because tapping it opens
 * that field's picker, and the button sends the draft for quotes.
 *
 * Before this split the card always rendered `content.hero.defaultDraft` under
 * the heading "Your event so far" — shared site copy, identical for every
 * account, which showed the same invented wedding to everyone as if it were
 * theirs.
 */
export function EventSummaryCard({
  event,
  draft,
  label,
  isLoading,
  errorMessage,
  isSubmitting,
  onPressEvent,
  onEditDraft,
  onSubmitDraft,
  onRetry,
}: EventSummaryCardProps) {
  const heading = (
    <EventlyText variant="caption" style={s.label} numberOfLines={1}>
      {label}
    </EventlyText>
  );

  if (isLoading && !event && !draft) {
    return (
      <View style={s.wrap} accessibilityLabel="Loading your event">
        {heading}
        <View style={s.card}>
          {HERO_FIELD_ORDER.map((field, i) => (
            <View key={field} style={[s.row, i === 0 && s.rowFirst]}>
              <View style={s.skeletonChip} />
              <View style={s.rowText}>
                <View style={s.skeletonLabel} />
                <View style={s.skeletonValue} />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (errorMessage && !event && !draft) {
    return (
      <View style={s.wrap}>
        {heading}
        <View style={s.card}>
          <View style={s.errorBody}>
            <EventlyIcon name="cloud-off-outline" size={28} color={colors.textMuted} />
            <EventlyText variant="subtitle" style={s.errorTitle}>
              {EVENT_SUMMARY_ERROR.title}
            </EventlyText>
            <EventlyText variant="body" style={s.errorText}>
              {errorMessage}
            </EventlyText>
            <TouchableOpacity
              style={s.retryButton}
              activeOpacity={0.8}
              onPress={onRetry}
              accessibilityRole="button"
              accessibilityLabel={EVENT_SUMMARY_ERROR.cta}
            >
              <EventlyIcon name="refresh" size={16} color={HERO_ACCENT_COLOR} />
              <EventlyText variant="caption" style={s.retryText}>
                {EVENT_SUMMARY_ERROR.cta}
              </EventlyText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (!event && !draft) {
    return (
      <View style={s.wrap}>
        {heading}
        <View style={s.card}>
          <View style={s.emptyBody}>
            <View style={s.emptyIconChip}>
              <EventlyIcon name="calendar-plus" size={26} color={HERO_ACCENT_COLOR} />
            </View>
            <EventlyText variant="subtitle" style={s.emptyTitle}>
              {EVENT_SUMMARY_EMPTY.title}
            </EventlyText>
            <EventlyText variant="body" style={s.emptyText}>
              {EVENT_SUMMARY_EMPTY.body}
            </EventlyText>
          </View>
        </View>
      </View>
    );
  }

  // A real event outranks the draft: once the customer has a plan, request or
  // booking, the card stops showing the planner's starting selection.
  const isReal = event !== null;

  // `occasion` falls back to the event's own title only when the underlying
  // record carries no occasion at all (an older booking raised outside the
  // quote flow) — never to a default occasion.
  const values: Record<keyof HeroDraft, string> = isReal
    ? {
        occasion: event.occasion || event.title,
        when: event.when,
        where: event.where,
        guests: event.guests ? `${event.guests} guests` : '',
      }
    : {
        occasion: draft?.occasion ?? '',
        when: draft?.when ?? '',
        where: draft?.where ?? '',
        guests: draft?.guests ? `${draft.guests} guests` : '',
      };

  return (
    <View style={s.wrap}>
      {heading}

      <View style={s.card}>
        {HERO_FIELD_ORDER.map((field, i) => {
          const value = values[field];
          const isEmpty = !value;
          return (
            <TouchableOpacity
              key={field}
              style={[s.row, i === 0 && s.rowFirst]}
              activeOpacity={0.7}
              onPress={isReal ? onPressEvent : () => onEditDraft(field)}
              accessibilityRole="button"
              accessibilityLabel={
                isReal
                  ? `${HERO_FIELD_LABEL[field]}: ${value || 'not set'}. Opens your event.`
                  : `${HERO_FIELD_LABEL[field]}: ${value || 'not chosen'}. Opens the picker.`
              }
            >
              <View style={s.iconChip}>
                <EventlyIcon name={HERO_FIELD_ICON_NAME[field]} size={20} color={HERO_ACCENT_COLOR} />
              </View>
              <View style={s.rowText}>
                <EventlyText variant="caption" style={s.rowLabel}>
                  {HERO_FIELD_LABEL[field]}
                </EventlyText>
                <EventlyText
                  variant="subtitle"
                  numberOfLines={1}
                  style={[s.rowValue, isEmpty && s.rowValueEmpty]}
                >
                  {value || EVENT_SUMMARY_FIELD_EMPTY[field]}
                </EventlyText>
              </View>
              {/* The direction is the affordance: right means the row leaves
                  for the event, down means it opens a picker in place. */}
              <EventlyIcon
                name={isReal ? 'chevron-right' : 'chevron-down'}
                size={22}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[s.cta, isSubmitting && s.ctaBusy]}
          activeOpacity={0.85}
          disabled={isSubmitting}
          onPress={isReal ? onPressEvent : onSubmitDraft}
          accessibilityRole="button"
          accessibilityLabel={isReal ? EVENT_SUMMARY_OPEN_CTA[event.source] : EVENT_SUMMARY_DRAFT_CTA}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.onPrimary} />
          ) : (
            <>
              <EventlyText variant="subtitle" style={s.ctaText}>
                {isReal ? EVENT_SUMMARY_OPEN_CTA[event.source] : EVENT_SUMMARY_DRAFT_CTA}
              </EventlyText>
              <EventlyIcon name="chevron-right" size={20} color={colors.onPrimary} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default EventSummaryCard;
