import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { Confetti, EventlyIcon, EventlyText, OccasionArt } from '../../../Components';
import {
  EVENT_SUMMARY_LABEL,
  HERO_ACCENT_COLOR,
  HERO_FIELD_ICON_NAME,
  HERO_FIELD_LABEL,
  HERO_FIELD_ORDER,
  TRUST_ICON_NAME,
} from '../constants';
import { bannerStyles, heroTrustStyles } from '../styles';
import { colors } from '../../../theme';
import type { BannerViewModel, CurrentEventViewModel, HeroDraft } from '../types';
import { EventSummaryCard } from './EventSummaryCard';

interface BannerProps {
  data: BannerViewModel;
  /** The customer's real event. When set, it replaces the draft in the card. */
  currentEvent: CurrentEventViewModel | null;
  isFeedLoading: boolean;
  feedErrorMessage: string | null;
  onRetryFeed: () => void;
  onPressCurrentEvent: () => void;
  heroDraft: HeroDraft | null;
  onChangeField: (field: keyof HeroDraft, value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  quotesRequested: boolean;
  quotesErrorMessage: string | null;
  onEditAgain: () => void;
}

export function Banner({
  data,
  currentEvent,
  isFeedLoading,
  feedErrorMessage,
  onRetryFeed,
  onPressCurrentEvent,
  heroDraft,
  onChangeField,
  onSubmit,
  isSubmitting,
  quotesRequested,
  quotesErrorMessage,
  onEditAgain,
}: BannerProps) {
  const [sheetField, setSheetField] = useState<keyof HeroDraft | null>(null);

  useEffect(() => {
    if (quotesRequested) setSheetField(null);
  }, [quotesRequested]);

  return (
    <View style={bannerStyles.container}>
      <View style={bannerStyles.decorCircle} pointerEvents="none" />
      <View style={bannerStyles.decorConfetti} pointerEvents="none">
        <Confetti />
      </View>
      <View style={bannerStyles.decorGarland} pointerEvents="none">
        <OccasionArt art="wedding" />
      </View>

      <View style={bannerStyles.content}>
        <EventlyText variant="caption" style={bannerStyles.greeting}>
          {data.greeting}
        </EventlyText>
        <EventlyText variant="h1" style={bannerStyles.heading}>
          {data.headingLead}{' '}
          <EventlyText variant="h1" style={bannerStyles.accent}>
            {data.headingAccent}
          </EventlyText>{' '}
          {data.headingTail}
        </EventlyText>
        <EventlyText variant="body" style={bannerStyles.subtitle}>
          {data.subtitle}
        </EventlyText>

        {quotesRequested ? (
          <View style={bannerStyles.successCard}>
            <EventlyIcon name="check-circle" size={26} color={colors.success} />
            <EventlyText variant="subtitle" style={bannerStyles.successText}>
              Quote request sent — organizers will reach out within a day.
            </EventlyText>
            <TouchableOpacity onPress={onEditAgain}>
              <EventlyText variant="caption" style={bannerStyles.successEdit}>
                Edit and send again
              </EventlyText>
            </TouchableOpacity>
          </View>
        ) : (
          <EventSummaryCard
            event={currentEvent}
            draft={heroDraft}
            label={currentEvent ? EVENT_SUMMARY_LABEL : data.draftLabel}
            isLoading={isFeedLoading}
            errorMessage={feedErrorMessage}
            isSubmitting={isSubmitting}
            onPressEvent={onPressCurrentEvent}
            onEditDraft={setSheetField}
            onSubmitDraft={onSubmit}
            onRetry={onRetryFeed}
          />
        )}

        {quotesErrorMessage ? (
          <EventlyText variant="caption" style={bannerStyles.formErrorText}>
            {quotesErrorMessage}
          </EventlyText>
        ) : null}

        {data.trust.length > 0 ? (
          <View style={heroTrustStyles.wrap}>
            {data.trust.map((item) => (
              <View key={item.label} style={heroTrustStyles.item}>
                <EventlyIcon name={TRUST_ICON_NAME[item.icon]} size={16} color={HERO_ACCENT_COLOR} />
                <EventlyText variant="body" style={heroTrustStyles.label}>
                  {item.label}
                </EventlyText>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      {/*
        One field at a time: the row the customer tapped is the field they want
        to change, so the sheet opens on it instead of making them scroll a
        four-section form to reach it.
      */}
      <Modal visible={sheetField !== null} transparent animationType="slide" onRequestClose={() => setSheetField(null)}>
        <Pressable style={bannerStyles.sheetBackdrop} onPress={() => setSheetField(null)}>
          <Pressable style={bannerStyles.sheetContainer} onPress={() => {}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <EventlyText variant="h2" style={bannerStyles.sheetTitle}>
                {sheetField ? HERO_FIELD_LABEL[sheetField] : ''}
              </EventlyText>
              <EventlyText variant="body" style={bannerStyles.sheetSubtitle}>
                Pick what fits — you can change this anytime.
              </EventlyText>

              {HERO_FIELD_ORDER.filter((field) => field === sheetField).map((field) => (
                <View key={field} style={bannerStyles.chipGroup}>
                  <View style={bannerStyles.chipGroupHeader}>
                    <View style={bannerStyles.chipGroupIconChip}>
                      <EventlyIcon name={HERO_FIELD_ICON_NAME[field]} size={14} color={HERO_ACCENT_COLOR} />
                    </View>
                    <EventlyText variant="body" style={bannerStyles.chipGroupLabel}>
                      {HERO_FIELD_LABEL[field]}
                    </EventlyText>
                  </View>
                  <View style={bannerStyles.chipRow}>
                    {data.options[field].map((option) => {
                      const isActive = heroDraft?.[field] === option;
                      return (
                        <TouchableOpacity
                          key={option}
                          style={[bannerStyles.chip, isActive && bannerStyles.chipActive]}
                          onPress={() => {
                            onChangeField(field, option);
                            setSheetField(null);
                          }}
                        >
                          <EventlyText
                            variant="body"
                            style={[bannerStyles.chipText, isActive && bannerStyles.chipTextActive]}
                          >
                            {option}
                          </EventlyText>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export default Banner;
