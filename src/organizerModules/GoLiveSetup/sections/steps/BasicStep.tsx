import { FIELD_LABEL as L, LIMITS, SETUP_COPY as COPY } from '../../constants';
import type { StepProps } from '../../types';
import {
  ChoiceField,
  FieldCard,
  FieldRow,
  FileField,
  Half,
  TextField,
} from '../Fields';

const P = COPY.placeholders;

/** Basic info: who you are, your business, and where you work. */
export function BasicStep({
  form,
  errors,
  options,
  uploading,
  mobile,
  setField,
  upload,
  removeFile,
}: StepProps) {
  return (
    <>
      <FieldCard>
        <FileField
          label={L.profilePhoto}
          hint={COPY.photoHint}
          file={form.profilePhoto}
          kind="avatar"
          uploading={uploading === 'profilePhoto'}
          onPick={() => upload('profilePhoto')}
          onRemove={() => removeFile('profilePhoto')}
        />
      </FieldCard>

      <FieldCard title="About you">
        <FieldRow>
          <Half>
            <TextField
              label={L.firstName}
              value={form.firstName}
              onChangeText={v => setField('firstName', v)}
              max={LIMITS.name}
              error={errors.firstName}
              autoCapitalize="words"
              textContentType="givenName"
            />
          </Half>
          <Half>
            <TextField
              label={L.lastName}
              value={form.lastName}
              onChangeText={v => setField('lastName', v)}
              max={LIMITS.name}
              error={errors.lastName}
              autoCapitalize="words"
              textContentType="familyName"
            />
          </Half>
        </FieldRow>
        <TextField label={COPY.phoneLabel} value={mobile || '—'} locked />
        <TextField
          label={L.contactEmail}
          value={form.contactEmail}
          onChangeText={v => setField('contactEmail', v.trim())}
          placeholder={P.contactEmail}
          max={LIMITS.email}
          error={errors.contactEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
        />
      </FieldCard>

      <FieldCard title="Your business">
        <TextField
          label={L.businessName}
          value={form.businessName}
          onChangeText={v => setField('businessName', v)}
          placeholder={P.businessName}
          max={LIMITS.businessName}
          error={errors.businessName}
          autoCapitalize="words"
        />
        <TextField
          label={L.displayName}
          value={form.displayName}
          onChangeText={v => setField('displayName', v)}
          placeholder={P.displayName}
          hint="Shown to customers instead of the business name, if set."
          max={LIMITS.businessName}
          error={errors.displayName}
          optional
          autoCapitalize="words"
        />
        <ChoiceField
          label={L.businessType}
          options={options.businessTypes}
          selected={form.businessType}
          onSelect={k => setField('businessType', k)}
        />
        <ChoiceField
          label={L.primaryCategory}
          options={options.categories}
          selected={form.primaryCategory}
          onSelect={k => setField('primaryCategory', k)}
        />
      </FieldCard>

      <FieldCard title="Where you work">
        <ChoiceField
          label={L.city}
          options={options.cities}
          selected={form.city}
          onSelect={k => setField('city', k)}
        />
      </FieldCard>
    </>
  );
}

export default BasicStep;
