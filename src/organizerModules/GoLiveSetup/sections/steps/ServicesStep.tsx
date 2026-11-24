import { FIELD_LABEL as L, LIMITS, SETUP_COPY as COPY } from '../../constants';
import type { StepProps } from '../../types';
import { digitsOnly, formatTimeInput } from '../../utils';
import {
  ChoiceField,
  FieldCard,
  FieldRow,
  Half,
  SwitchRow,
  TextField,
} from '../Fields';

const P = COPY.placeholders;

/** Services, in three short tabs: what you offer, where & when, pricing. */
export function ServicesStep({
  form,
  errors,
  part,
  options,
  setField,
  toggle,
}: StepProps) {
  if (part === 'offer') {
    return (
      <>
        <FieldCard title="Your team">
          <ChoiceField
            label={L.experience}
            options={options.experienceRanges}
            selected={form.experience}
            onSelect={k => setField('experience', k)}
          />
          <ChoiceField
            label={L.teamSize}
            options={options.teamSizes}
            selected={form.teamSize}
            onSelect={k => setField('teamSize', k)}
          />
          <ChoiceField
            label={L.languages}
            options={options.languages}
            selected={form.languages}
            onSelect={k => toggle('languages', k)}
            multi
          />
        </FieldCard>
        <FieldCard title="What you do" hint="Tap all that apply.">
          <ChoiceField
            label={L.occasions}
            options={options.occasions}
            selected={form.occasions}
            onSelect={k => toggle('occasions', k)}
            multi
          />
          <ChoiceField
            label={L.servicesOffered}
            options={options.serviceCategories}
            selected={form.servicesOffered}
            onSelect={k => toggle('servicesOffered', k)}
            multi
            optional
          />
          <ChoiceField
            label={L.secondaryCategories}
            options={options.categories}
            selected={form.secondaryCategories}
            onSelect={k => toggle('secondaryCategories', k)}
            multi
            optional
          />
        </FieldCard>
      </>
    );
  }

  if (part === 'when') {
    return (
      <>
        <FieldCard title="Where you go">
          <ChoiceField
            label={L.travelOption}
            options={options.travelOptions}
            selected={form.travelOption}
            onSelect={k => setField('travelOption', k)}
          />
          <TextField
            label={L.serviceRadius}
            value={form.serviceRadius}
            onChangeText={v => setField('serviceRadius', digitsOnly(v, 4))}
            error={errors.serviceRadius}
            keyboardType="number-pad"
            optional
          />
          <SwitchRow
            label={L.destinationEvents}
            value={form.destinationEvents}
            onValueChange={v => setField('destinationEvents', v)}
          />
          <SwitchRow
            label={L.internationalEvents}
            value={form.internationalEvents}
            onValueChange={v => setField('internationalEvents', v)}
          />
        </FieldCard>
        <FieldCard title="When you work">
          <ChoiceField
            label={L.workingDays}
            options={options.workingDays}
            selected={form.workingDays}
            onSelect={k => toggle('workingDays', k)}
            multi
          />
          <FieldRow>
            <Half>
              <TextField
                label={L.workingHoursStart}
                value={form.workingHoursStart}
                onChangeText={v =>
                  setField('workingHoursStart', formatTimeInput(v))
                }
                placeholder={P.time}
                error={errors.workingHoursStart}
                keyboardType="number-pad"
                maxLength={5}
              />
            </Half>
            <Half>
              <TextField
                label={L.workingHoursEnd}
                value={form.workingHoursEnd}
                onChangeText={v =>
                  setField('workingHoursEnd', formatTimeInput(v))
                }
                placeholder={P.time}
                error={errors.workingHoursEnd}
                keyboardType="number-pad"
                maxLength={5}
              />
            </Half>
          </FieldRow>
          <SwitchRow
            label={L.emergencyAvailability}
            value={form.emergencyAvailability}
            onValueChange={v => setField('emergencyAvailability', v)}
          />
        </FieldCard>
      </>
    );
  }

  return (
    <>
      <FieldCard
        title="Your budget range"
        hint="The event budgets you usually take on."
      >
        <FieldRow>
          <Half>
            <TextField
              label={L.minBudget}
              value={form.minBudget}
              onChangeText={v =>
                setField('minBudget', digitsOnly(v, LIMITS.budgetDigits))
              }
              placeholder={P.amount}
              error={errors.minBudget}
              keyboardType="number-pad"
            />
          </Half>
          <Half>
            <TextField
              label={L.maxBudget}
              value={form.maxBudget}
              onChangeText={v =>
                setField('maxBudget', digitsOnly(v, LIMITS.budgetDigits))
              }
              error={errors.maxBudget}
              keyboardType="number-pad"
            />
          </Half>
        </FieldRow>
        <TextField
          label={L.advancePercentage}
          value={form.advancePercentage}
          onChangeText={v => setField('advancePercentage', digitsOnly(v, 3))}
          hint="How much you take upfront to confirm a booking."
          error={errors.advancePercentage}
          keyboardType="number-pad"
          optional
        />
      </FieldCard>
      <FieldCard>
        <ChoiceField
          label={L.paymentMethods}
          options={options.paymentMethods}
          selected={form.paymentMethods}
          onSelect={k => toggle('paymentMethods', k)}
          multi
          optional
        />
      </FieldCard>
    </>
  );
}

export default ServicesStep;
