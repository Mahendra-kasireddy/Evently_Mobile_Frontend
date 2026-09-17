import { useState } from 'react';
import { View } from 'react-native';
import {
  EventlyIcon,
  EventlyText,
  EventlyTextInput,
} from '../../../Components';
import { PLAN_ACCENT, PLAN_TEXT_MUTED } from '../constants';
import { eventDetailsStyles } from '../styles';
import { formatEventDate, todayIsoDate } from '../utils';
import { DatePickerModal } from './DatePickerModal';
import { SelectField } from './SelectField';
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
  const [areaFocused, setAreaFocused] = useState(false);

  return (
    <View style={eventDetailsStyles.section}>
      <EventlyText variant="subtitle" style={eventDetailsStyles.sectionTitle}>
        The basics
      </EventlyText>

      {/* Date and guest count are both short answers, so they share a row. */}
      <View style={eventDetailsStyles.pair}>
        <View style={eventDetailsStyles.pairItem}>
          <SelectField
            caption="Event date"
            icon="calendar-blank-outline"
            value={draft.eventDate ? formatEventDate(draft.eventDate) : ''}
            placeholder="Choose"
            showChevron={false}
            onPress={() => setOpenModal('date')}
          />
        </View>
        <View style={eventDetailsStyles.pairItem}>
          <SelectField
            caption="Guests"
            icon="account-group-outline"
            value={draft.guests}
            placeholder="Choose"
            showChevron={false}
            onPress={() => setOpenModal('guests')}
          />
        </View>
      </View>

      <SelectField
        caption="City"
        icon="map-marker-outline"
        value={draft.city}
        placeholder="Choose your city"
        onPress={() => setOpenModal('city')}
      />

      {/*
        Free text, so it is an input rather than a picker — but it wears the
        same caption-inside-the-control shape as its neighbours, or it would
        read as a different kind of thing sitting between two that are not.
      */}
      <View
        style={[
          eventDetailsStyles.control,
          areaFocused && eventDetailsStyles.controlRowFocused,
        ]}
      >
        <EventlyText variant="caption" style={eventDetailsStyles.caption}>
          Area / neighbourhood
        </EventlyText>
        <View style={eventDetailsStyles.controlValueRow}>
          <EventlyIcon
            name="map-marker-radius-outline"
            size={14}
            color={draft.area ? PLAN_ACCENT : PLAN_TEXT_MUTED}
          />
          <EventlyTextInput
            style={eventDetailsStyles.controlInput}
            value={draft.area}
            placeholder="e.g. Banjara Hills"
            onChangeText={text => onSetField('area', text)}
            onFocus={() => setAreaFocused(true)}
            onBlur={() => setAreaFocused(false)}
          />
        </View>
      </View>

      {budgetOptions.length > 0 ? (
        <SelectField
          caption="Budget — optional"
          icon="wallet-outline"
          value={draft.budget}
          placeholder="Add a range to sharpen matches"
          optional
          onPress={() => setOpenModal('budget')}
        />
      ) : null}

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
