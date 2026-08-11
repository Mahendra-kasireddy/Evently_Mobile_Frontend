import { useState } from 'react';
import { View } from 'react-native';
import { EventlyIcon, EventlyText, EventlyTextInput } from '../../../Components';
import { PLAN_TEXT_MUTED } from '../constants';
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
      <View style={eventDetailsStyles.field}>
        <EventlyText variant="subtitle" style={eventDetailsStyles.label}>
          Event date
        </EventlyText>
        <SelectField
          icon="calendar-blank-outline"
          value={draft.eventDate ? formatEventDate(draft.eventDate) : ''}
          placeholder="Choose a date"
          onPress={() => setOpenModal('date')}
        />
      </View>

      <View style={eventDetailsStyles.field}>
        <EventlyText variant="subtitle" style={eventDetailsStyles.label}>
          City
        </EventlyText>
        <SelectField icon="map-marker-outline" value={draft.city} placeholder="Choose your city" onPress={() => setOpenModal('city')} />
      </View>

      <View style={eventDetailsStyles.field}>
        <EventlyText variant="subtitle" style={eventDetailsStyles.label}>
          Area / neighbourhood
        </EventlyText>
        <View style={[eventDetailsStyles.controlRow, areaFocused && eventDetailsStyles.controlRowFocused]}>
          <EventlyIcon name="map-marker-radius-outline" size={16} color={PLAN_TEXT_MUTED} />
          <EventlyTextInput
            style={eventDetailsStyles.controlInput}
            value={draft.area}
            placeholder="e.g. Banjara Hills"
            onChangeText={(text) => onSetField('area', text)}
            onFocus={() => setAreaFocused(true)}
            onBlur={() => setAreaFocused(false)}
          />
        </View>
      </View>

      <View style={eventDetailsStyles.field}>
        <EventlyText variant="subtitle" style={eventDetailsStyles.label}>
          Guest count
        </EventlyText>
        <SelectField
          icon="account-group-outline"
          value={draft.guests}
          placeholder="Choose guest count"
          onPress={() => setOpenModal('guests')}
        />
      </View>

      {budgetOptions.length > 0 ? (
        <View style={eventDetailsStyles.field}>
          <EventlyText variant="subtitle" style={eventDetailsStyles.label}>
            Budget (optional)
          </EventlyText>
          <SelectField icon="wallet-outline" value={draft.budget} placeholder="Optional" onPress={() => setOpenModal('budget')} />
        </View>
      ) : null}

      <DatePickerModal
        visible={openModal === 'date'}
        value={draft.eventDate}
        minIso={todayIsoDate()}
        onSelect={(iso) => onSetField('eventDate', iso)}
        onClose={() => setOpenModal(null)}
      />

      <SelectListModal
        visible={openModal === 'city'}
        title="City"
        options={cityOptions}
        value={draft.city}
        allowCustomInput
        customPlaceholder="Enter your city"
        onSelect={(value) => onSetField('city', value)}
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
