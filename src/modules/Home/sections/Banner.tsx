import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { Confetti, EventlyButton, EventlyIcon, EventlyText, OccasionArt } from '../../../Components';
import { HERO_ACCENT_COLOR, HERO_FIELD_ICON_NAME, HERO_FIELD_LABEL, HERO_FIELD_ORDER } from '../constants';
import { bannerStyles } from '../styles';
import { colors } from '../../../theme';
import type { BannerViewModel, HeroDraft } from '../types';

interface BannerProps {
  data: BannerViewModel;
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
  heroDraft,
  onChangeField,
  onSubmit,
  isSubmitting,
  quotesRequested,
  quotesErrorMessage,
  onEditAgain,
}: BannerProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (quotesRequested) setSheetOpen(false);
  }, [quotesRequested]);

  const summary = heroDraft ? `${heroDraft.occasion} · ${heroDraft.when} · ${heroDraft.where} · ${heroDraft.guests} guests` : '';

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
          <TouchableOpacity
            style={bannerStyles.searchTrigger}
            activeOpacity={0.85}
            onPress={() => setSheetOpen(true)}
            accessibilityLabel="Plan your event"
          >
            <View style={bannerStyles.searchIconChip}>
              <EventlyIcon name="magnify" size={20} color={HERO_ACCENT_COLOR} />
            </View>
            <View style={bannerStyles.searchTextWrap}>
              <EventlyText variant="caption" style={bannerStyles.searchLabel} numberOfLines={1}>
                {data.draftLabel}
              </EventlyText>
              <EventlyText variant="subtitle" style={bannerStyles.searchSummary} numberOfLines={1}>
                {summary}
              </EventlyText>
            </View>
            <View style={bannerStyles.searchArrowButton}>
              <EventlyIcon name="arrow-right" size={18} color={colors.onPrimary} />
            </View>
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={sheetOpen} transparent animationType="slide" onRequestClose={() => setSheetOpen(false)}>
        <Pressable style={bannerStyles.sheetBackdrop} onPress={() => setSheetOpen(false)}>
          <Pressable style={bannerStyles.sheetContainer} onPress={() => {}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <EventlyText variant="h2" style={bannerStyles.sheetTitle}>
                Plan your event
              </EventlyText>
              <EventlyText variant="body" style={bannerStyles.sheetSubtitle}>
                Pick what fits — you can change this anytime.
              </EventlyText>

              {HERO_FIELD_ORDER.map((field) => (
                <View key={field} style={bannerStyles.chipGroup}>
                  <View style={bannerStyles.chipGroupHeader}>
                    <View style={bannerStyles.chipGroupIconChip}>
                      <EventlyIcon name={HERO_FIELD_ICON_NAME[field]} size={14} color={HERO_ACCENT_COLOR} />
                    </View>
                    <EventlyText variant="body" style={bannerStyles.chipGroupLabel}>
                      {HERO_FIELD_LABEL[field]}
                    </EventlyText>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={bannerStyles.chipRow}
                  >
                    {data.options[field].map((option) => {
                      const isActive = heroDraft?.[field] === option;
                      return (
                        <TouchableOpacity
                          key={option}
                          style={[bannerStyles.chip, isActive && bannerStyles.chipActive]}
                          onPress={() => onChangeField(field, option)}
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
                  </ScrollView>
                </View>
              ))}

              <EventlyButton
                title="Get quotes"
                onPress={onSubmit}
                loading={isSubmitting}
                disabled={!heroDraft}
                style={[bannerStyles.getQuotesButton, { backgroundColor: HERO_ACCENT_COLOR }]}
              />
              {quotesErrorMessage ? (
                <EventlyText variant="caption" style={bannerStyles.formErrorText}>
                  {quotesErrorMessage}
                </EventlyText>
              ) : null}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export default Banner;
