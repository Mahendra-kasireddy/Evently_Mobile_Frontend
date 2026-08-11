import { TouchableOpacity, View } from 'react-native';
import { EventlyButton, EventlyIcon, EventlyText } from '../../../Components';
import { NEXT_ICON_NAME, PLAN_ACCENT, PLAN_BORDER, PLAN_GREEN, PLAN_NAVY, PLAN_TEXT_MUTED, TIER_COLOR } from '../constants';
import { reviewStyles } from '../styles';
import { colors } from '../../../theme';
import { categoryTitles, formatEventDate, locationLabel } from '../utils';
import type { CategoryOption } from '../utils';
import type { PlanDraft, PlanOrganizerDTO, QuoteNoteDTO, SubmitPhase, WhatNextItemDTO } from '../types';

interface ReviewStepProps {
  draft: PlanDraft;
  occasionLabel: string;
  categories: CategoryOption[];
  recommendedOrganizer: PlanOrganizerDTO | null;
  selectedOrganizerDetails: PlanOrganizerDTO | null;
  submitPhase: SubmitPhase;
  submitError: string | null;
  planSaved: boolean;
  canSubmitPlan: boolean;
  footnote: string;
  whatNext: WhatNextItemDTO[];
  quoteNote: QuoteNoteDTO;
  onEditDetails: () => void;
  onEditCategories: () => void;
  onEditOrganizer: () => void;
  onSubmit: () => void;
}

function SectionHead({ title, actionLabel, onPress }: { title: string; actionLabel: string; onPress: () => void }) {
  return (
    <View style={reviewStyles.panelHead}>
      <EventlyText variant="subtitle" style={reviewStyles.panelTitle}>
        {title}
      </EventlyText>
      <TouchableOpacity style={reviewStyles.editButton} onPress={onPress}>
        <EventlyIcon name="pencil-outline" size={13} color={PLAN_ACCENT} />
        <EventlyText variant="caption" style={reviewStyles.editText}>
          {actionLabel}
        </EventlyText>
      </TouchableOpacity>
    </View>
  );
}

function OrganizerRow({ organizer, tagLabel }: { organizer: PlanOrganizerDTO; tagLabel: string }) {
  return (
    <View style={reviewStyles.orgRow}>
      <View style={[reviewStyles.orgAvatar, { backgroundColor: organizer.avatarColor }]}>
        <EventlyText variant="caption" style={reviewStyles.orgAvatarText}>
          {organizer.initials}
        </EventlyText>
      </View>
      <View style={reviewStyles.orgMeta}>
        <EventlyText variant="subtitle" style={reviewStyles.orgName}>
          {organizer.name}
        </EventlyText>
        <View style={reviewStyles.orgSub}>
          <EventlyIcon name="star" size={12} color={colors.accent} />
          <EventlyText variant="caption" style={reviewStyles.orgSubText}>
            {organizer.rating} · {organizer.tier} · {organizer.location}
          </EventlyText>
        </View>
      </View>
      <EventlyText variant="caption" style={[reviewStyles.orgTag, { color: TIER_COLOR[organizer.tier] }]}>
        {tagLabel}
      </EventlyText>
    </View>
  );
}

export function ReviewStep({
  draft,
  occasionLabel,
  categories,
  recommendedOrganizer,
  selectedOrganizerDetails,
  submitPhase,
  submitError,
  planSaved,
  canSubmitPlan,
  footnote,
  whatNext,
  quoteNote,
  onEditDetails,
  onEditCategories,
  onEditOrganizer,
  onSubmit,
}: ReviewStepProps) {
  const dateLabel = draft.eventDate ? formatEventDate(draft.eventDate) : 'Not set';
  const location = locationLabel(draft.area, draft.city, 'Not set');
  const catTitles = categoryTitles(draft.categories, categories);

  const detailItems: Array<{ label: string; value: string; muted: boolean; full?: boolean }> = [
    { label: 'Occasion', value: occasionLabel, muted: false },
    { label: 'Event date', value: dateLabel, muted: !draft.eventDate },
    { label: 'City & area', value: location, muted: !draft.city && !draft.area },
    { label: 'Guest count', value: draft.guests ? `${draft.guests} guests` : 'Not set', muted: !draft.guests },
    { label: 'Budget', value: draft.budget || 'Not specified', muted: !draft.budget },
    { label: 'Special requests', value: draft.ideas || 'None added', muted: !draft.ideas, full: true },
  ];

  const submitLabel =
    submitPhase === 'saving'
      ? 'Saving your plan…'
      : submitPhase === 'quoting'
        ? 'Requesting quote…'
        : planSaved
          ? 'Retry quote request'
          : 'Submit plan & request quote';

  const showRecommended =
    recommendedOrganizer && (!selectedOrganizerDetails || recommendedOrganizer.id !== selectedOrganizerDetails.id);

  return (
    <View style={reviewStyles.section}>
      <View style={reviewStyles.summaryCard}>
        <View style={[reviewStyles.sectionBlock, reviewStyles.sectionBlockFirst]}>
          <SectionHead title="Event details" actionLabel="Edit" onPress={onEditDetails} />
          <View style={reviewStyles.detailGrid}>
            {detailItems.map((item) => (
              <View key={item.label} style={item.full ? reviewStyles.detailItemFull : reviewStyles.detailItem}>
                <EventlyText variant="caption" style={reviewStyles.rowLabel}>
                  {item.label}
                </EventlyText>
                <EventlyText variant="subtitle" style={item.muted ? reviewStyles.rowValueMuted : reviewStyles.rowValue}>
                  {item.value}
                </EventlyText>
              </View>
            ))}
          </View>
        </View>

        <View style={reviewStyles.sectionDivider} />

        <View style={reviewStyles.sectionBlock}>
          <SectionHead title="Selected categories" actionLabel="Edit" onPress={onEditCategories} />
          {catTitles.length > 0 ? (
            <View style={reviewStyles.chipRow}>
              {catTitles.map((title) => (
                <View key={title} style={reviewStyles.chip}>
                  <EventlyIcon name="format-list-checks" size={12} color={PLAN_NAVY} />
                  <EventlyText variant="caption" style={reviewStyles.chipText}>
                    {title}
                  </EventlyText>
                </View>
              ))}
            </View>
          ) : (
            <EventlyText variant="body" style={reviewStyles.emptyText}>
              No categories selected yet.
            </EventlyText>
          )}
        </View>

        <View style={reviewStyles.sectionDivider} />

        <View style={reviewStyles.sectionBlock}>
          <SectionHead title="Organizer" actionLabel="Change" onPress={onEditOrganizer} />
          {selectedOrganizerDetails ? (
            <OrganizerRow organizer={selectedOrganizerDetails} tagLabel="Selected" />
          ) : (
            <EventlyText variant="body" style={reviewStyles.emptyText}>
              No organizer selected — go back and pick one.
            </EventlyText>
          )}
          {showRecommended && recommendedOrganizer ? <OrganizerRow organizer={recommendedOrganizer} tagLabel="Top match" /> : null}
        </View>
      </View>

      {whatNext.length > 0 ? (
        <View style={reviewStyles.nextPanel}>
          <EventlyText variant="subtitle" style={reviewStyles.nextPanelTitle}>
            What happens next
          </EventlyText>
          {whatNext.map((item) => (
            <View key={item.title} style={reviewStyles.nextRow}>
              <View style={reviewStyles.nextIcon}>
                <EventlyIcon name={NEXT_ICON_NAME[item.icon] ?? 'information-outline'} size={14} color={PLAN_ACCENT} />
              </View>
              <View style={reviewStyles.nextTextCol}>
                <EventlyText variant="subtitle" style={reviewStyles.nextTitle}>
                  {item.title}
                </EventlyText>
                <EventlyText variant="caption" style={reviewStyles.nextDesc}>
                  {item.desc}
                </EventlyText>
              </View>
            </View>
          ))}
          {quoteNote.title || quoteNote.text ? (
            <View style={reviewStyles.quoteBox}>
              <EventlyIcon name="file-document-outline" size={16} color={PLAN_NAVY} />
              <View style={reviewStyles.quoteTextCol}>
                <EventlyText variant="subtitle" style={reviewStyles.quoteTitle}>
                  {quoteNote.title}
                </EventlyText>
                <EventlyText variant="caption" style={reviewStyles.quoteText}>
                  {quoteNote.text}
                </EventlyText>
              </View>
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={reviewStyles.submitCard}>
        <EventlyText variant="h2" style={reviewStyles.submitTitle}>
          Ready to submit?
        </EventlyText>
        <EventlyText variant="body" style={reviewStyles.submitText}>
          We&rsquo;ll save your plan and send a quote request to {selectedOrganizerDetails ? selectedOrganizerDetails.name : 'your organizer'}. You&rsquo;ll get a tailored quote within a day.
        </EventlyText>

        {planSaved && !submitError ? (
          <View style={reviewStyles.savedRow}>
            <EventlyIcon name="check-circle" size={15} color={PLAN_GREEN} />
            <EventlyText variant="body" style={reviewStyles.savedText}>
              Plan saved
            </EventlyText>
          </View>
        ) : null}

        {submitError ? (
          <View style={reviewStyles.errorBox}>
            <EventlyIcon name="alert-circle-outline" size={16} color={colors.danger} />
            <EventlyText variant="body" style={reviewStyles.errorText}>
              {submitError}
            </EventlyText>
          </View>
        ) : null}

        <EventlyButton
          title={submitLabel}
          onPress={onSubmit}
          disabled={!canSubmitPlan}
          style={reviewStyles.submitButton}
          accentColor={canSubmitPlan ? PLAN_ACCENT : PLAN_BORDER}
        />

        {footnote ? (
          <View style={reviewStyles.footnoteRow}>
            <EventlyIcon name="shield-check-outline" size={13} color={PLAN_TEXT_MUTED} />
            <EventlyText variant="caption" style={reviewStyles.footnoteText}>
              {footnote}
            </EventlyText>
          </View>
        ) : null}
      </View>
    </View>
  );
}

export default ReviewStep;
