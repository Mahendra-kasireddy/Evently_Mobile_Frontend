import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import {
  EventlyIcon,
  EventlyText,
  EventlyTextInput,
} from '../../../Components';
import { PLAN_TEXT_MUTED } from '../constants';
import { eventDetailsStyles } from '../styles';
import { formatEventDate, todayIsoDate } from '../utils';
import { DatePickerModal } from './DatePickerModal';
import { SelectListModal } from './SelectListModal';
import type { PlanDraft } from '../types';

interface EventDetailsFormProps {
  draft: PlanDraft;
  cityOptions: string[];
  guestOptions: string[];
  budgetOptions: string[];
  onSetField: (field: 'city' | 'area' | 'eventDate', value: string) => void;
  onSelectGuests: (value: string) => void;
  onSelectBudget: (value: string) => void;
}

type OpenModal = 'date' | 'city' | 'guests' | 'budget' | null;

/** Each row's icon wears its own tint, so the list scans by colour. */
const ROW_TINT = {
  date: { bg: '#fde8e6', fg: '#e5534b' },
  city: { bg: '#e3f4ec', fg: '#1d9e75' },
  area: { bg: '#ece9fb', fg: '#6c5ce7' },
  guests: { bg: '#fff1e0', fg: '#f08c2e' },
  budget: { bg: '#e6effb', fg: '#3b6fd8' },
} as const;

interface DetailRowProps {
  caption: string;
  icon: string;
  tint: { bg: string; fg: string };
  value?: string;
  placeholder?: string;
  onPress: () => void;
  isLast?: boolean;
  /** Replaces the value text — the Area row puts its input here. */
  children?: ReactNode;
}

/** One row of the details card: tinted icon, caption over value, chevron. */
function DetailRow({
  caption,
  icon,
  tint,
  value,
  placeholder,
  onPress,
  isLast = false,
  children,
}: DetailRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        eventDetailsStyles.row,
        !isLast && eventDetailsStyles.rowDivider,
        pressed && eventDetailsStyles.rowPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${caption}. ${value || placeholder || ''}`}
    >
      <View style={[eventDetailsStyles.rowIcon, { backgroundColor: tint.bg }]}>
        <EventlyIcon name={icon} size={20} color={tint.fg} />
      </View>
      <View style={eventDetailsStyles.rowBody}>
        <EventlyText
          variant="caption"
          style={eventDetailsStyles.rowCaption}
          numberOfLines={1}
        >
          {caption}
        </EventlyText>
        {children ?? (
          <EventlyText
            variant="body"
            style={
              value
                ? eventDetailsStyles.rowValue
                : eventDetailsStyles.rowPlaceholder
            }
            numberOfLines={1}
          >
            {value || placeholder}
          </EventlyText>
        )}
      </View>
      <EventlyIcon name="chevron-right" size={22} color={PLAN_TEXT_MUTED} />
    </Pressable>
  );
}

export function EventDetailsForm({
  draft,
  cityOptions,
  guestOptions,
  budgetOptions,
  onSetField,
  onSelectGuests,
  onSelectBudget,
}: EventDetailsFormProps) {
  const [openModal, setOpenModal] = useState<OpenModal>(null);

  const areaInputRef = useRef<TextInput>(null);
  const hasBudget = budgetOptions.length > 0;

  return (
    <View style={eventDetailsStyles.section}>
      <View style={eventDetailsStyles.card}>
        <DetailRow
          caption="Event date"
          icon="calendar-month-outline"
          tint={ROW_TINT.date}
          value={draft.eventDate ? formatEventDate(draft.eventDate) : ''}
          placeholder="Choose a date"
          onPress={() => setOpenModal('date')}
        />
        <DetailRow
          caption="City"
          icon="map-marker"
          tint={ROW_TINT.city}
          value={draft.city}
          placeholder="Choose your city"
          onPress={() => setOpenModal('city')}
        />
        {/* Free text, so the row holds an input; tapping anywhere on the row
            focuses it, the same as tapping a picker row opens its picker. */}
        <DetailRow
          caption="Area / Neighbourhood"
          icon="map-outline"
          tint={ROW_TINT.area}
          onPress={() => areaInputRef.current?.focus()}
        >
          <EventlyTextInput
            ref={areaInputRef}
            style={eventDetailsStyles.rowInput}
            value={draft.area}
            placeholder="e.g. Banjara Hills"
            placeholderTextColor={PLAN_TEXT_MUTED}
            onChangeText={text => onSetField('area', text)}
          />
        </DetailRow>
        <DetailRow
          caption="Guests"
          icon="account-group-outline"
          tint={ROW_TINT.guests}
          value={draft.guests}
          placeholder="How many guests?"
          onPress={() => setOpenModal('guests')}
          isLast={!hasBudget}
        />
        {hasBudget ? (
          <DetailRow
            caption="Budget — optional"
            icon="wallet-outline"
            tint={ROW_TINT.budget}
            value={draft.budget}
            placeholder="Add a range to sharpen matches"
            onPress={() => setOpenModal('budget')}
            isLast
          />
        ) : null}
      </View>

      <DatePickerModal
        visible={openModal === 'date'}
        value={draft.eventDate}
        minIso={todayIsoDate()}
        onSelect={iso => onSetField('eventDate', iso)}
        onClose={() => setOpenModal(null)}
      />

      <SelectListModal
        visible={openModal === 'city'}
        title="City"
        options={cityOptions}
        value={draft.city}
        allowCustomInput
        customPlaceholder="Enter your city"
        onSelect={value => onSetField('city', value)}
        onClose={() => setOpenModal(null)}
      />

      <SelectListModal
        visible={openModal === 'guests'}
        title="Guest count"
        options={guestOptions}
        value={draft.guests}
        onSelect={onSelectGuests}
        onClose={() => setOpenModal(null)}
      />

      <SelectListModal
        visible={openModal === 'budget'}
        title="Budget"
        options={budgetOptions}
        value={draft.budget}
        clearLabel="No preference"
        onSelect={onSelectBudget}
        onClose={() => setOpenModal(null)}
      />
    </View>
  );
}

export default EventDetailsForm;
