import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import type { OrganizerOnboardingResult } from '../container';
import { CATEGORY_ICON, DEFAULT_CATEGORY_ICON, ORG_ACCENT, ORG_TEXT_MUTED } from '../constants';
import { categoryGridStyles, fieldStyles, screenStyles } from '../styles';
import type { Option, ServicesConfig } from '../types';
import { ChipToggleGroup } from './ChipToggleGroup';
import { FieldText } from './FieldText';
import { SelectField } from './SelectField';

interface StepServicesProps {
  onb: OrganizerOnboardingResult;
  servicesConfig: ServicesConfig | undefined;
}

function CategoryGrid({ options, selected, onToggle }: { options: Option[]; selected: string[]; onToggle: (key: string) => void }) {
  return (
    <View style={fieldStyles.group}>
      <EventlyText variant="subtitle" style={fieldStyles.label}>
        Categories you provide <EventlyText variant="caption" style={fieldStyles.optional}>(optional)</EventlyText>
      </EventlyText>
      <View style={categoryGridStyles.grid}>
        {options.map((option) => {
          const active = selected.includes(option.key);
          return (
            <TouchableOpacity
              key={option.key}
              style={[categoryGridStyles.tile, active && categoryGridStyles.tileActive]}
              onPress={() => onToggle(option.key)}
              accessibilityState={{ selected: active }}
            >
              <EventlyIcon name={CATEGORY_ICON[option.key] ?? DEFAULT_CATEGORY_ICON} size={20} color={active ? ORG_ACCENT : ORG_TEXT_MUTED} />
              <EventlyText variant="body" style={active ? categoryGridStyles.tileTextActive : categoryGridStyles.tileText} numberOfLines={1}>
                {option.label}
              </EventlyText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export function StepServices({ onb, servicesConfig }: StepServicesProps) {
  const { values, setField, toggleArray } = onb;

  return (
    <View style={screenStyles.stepBodyWide}>
      <CategoryGrid
        options={servicesConfig?.categories ?? []}
        selected={values.secondaryCategories}
        onToggle={(key) => toggleArray('secondaryCategories', key)}
      />

      <SelectField
        label="Experience"
        value={values.experience}
        options={servicesConfig?.experienceRanges ?? []}
        onSelect={(key) => setField('experience', key)}
        placeholder="Select your experience range"
      />

      <SelectField
        label="Team size"
        value={values.teamSize}
        options={servicesConfig?.teamSizes ?? []}
        onSelect={(key) => setField('teamSize', key)}
        placeholder="Select your team size"
      />

      <ChipToggleGroup
        label="Languages spoken"
        options={servicesConfig?.languages ?? []}
        selected={values.languages}
        onToggle={(key) => toggleArray('languages', key)}
      />

      <ChipToggleGroup
        label="Occasions covered"
        options={servicesConfig?.occasions ?? []}
        selected={values.occasions}
        onToggle={(key) => toggleArray('occasions', key)}
      />

      <SelectField
        label="Travel option"
        value={values.travelOption}
        options={servicesConfig?.travelOptions ?? []}
        onSelect={(key) => setField('travelOption', key)}
        placeholder="How far will you travel for events?"
      />

      <FieldText
        label="Service radius (km)"
        value={values.serviceRadius}
        onChangeText={(v) => setField('serviceRadius', v.replace(/\D/g, '').slice(0, 4))}
        placeholder="e.g. 15"
        keyboardType="number-pad"
        optional
      />

      <ChipToggleGroup
        label="Working days"
        options={servicesConfig?.workingDays ?? []}
        selected={values.workingDays}
        onToggle={(key) => toggleArray('workingDays', key)}
      />

      <View style={fieldStyles.row}>
        <View style={fieldStyles.half}>
          <FieldText
            label="Minimum budget (₹)"
            value={values.minBudget}
            onChangeText={(v) => setField('minBudget', v.replace(/\D/g, '').slice(0, 9))}
            placeholder="e.g. 50000"
            keyboardType="number-pad"
          />
        </View>
        <View style={fieldStyles.half}>
          <FieldText
            label="Maximum budget (₹)"
            value={values.maxBudget}
            onChangeText={(v) => setField('maxBudget', v.replace(/\D/g, '').slice(0, 9))}
            placeholder="e.g. 300000"
            keyboardType="number-pad"
          />
        </View>
      </View>
    </View>
  );
}

export default StepServices;
