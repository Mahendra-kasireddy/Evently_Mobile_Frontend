import { FIELD_LABEL as L, LIMITS, SETUP_COPY as COPY } from '../../constants';
import type { StepProps } from '../../types';
import { digitsOnly, upperAlnum } from '../../utils';
import {
  ChoiceField,
  FieldCard,
  FileField,
  PrivacyNote,
  SecretField,
  TextField,
} from '../Fields';

const P = COPY.placeholders;

/** Verification, in two tabs: the ID numbers, then a photo of each document. */
export function VerificationStep({
  form,
  baseline,
  errors,
  part,
  options,
  uploading,
  setField,
  upload,
  removeFile,
}: StepProps) {
  if (part === 'docs') {
    const doc = (
      key: 'governmentIdFile' | 'panFile' | 'gstFile' | 'businessRegFile',
      optional = false,
    ) => (
      <FileField
        label={L[key]}
        hint={COPY.docHint}
        file={form[key]}
        kind="document"
        uploading={uploading === key}
        onPick={() => upload(key)}
        onRemove={() => removeFile(key)}
        optional={optional}
      />
    );
    return (
      <>
        <FieldCard title="Required">
          {doc('governmentIdFile')}
          {doc('panFile')}
        </FieldCard>
        <FieldCard title="If you have them">
          {doc('gstFile', true)}
          {doc('businessRegFile', true)}
        </FieldCard>
        <PrivacyNote text={COPY.idsNote} />
      </>
    );
  }

  return (
    <>
      <FieldCard title="Your ID">
        <SecretField
          label={L.aadhaarNumber}
          saved={baseline.aadhaarNumber}
          value={form.aadhaarNumber}
          onChange={() => setField('aadhaarNumber', '')}
          onKeep={() => setField('aadhaarNumber', baseline.aadhaarNumber)}
        >
          <TextField
            label={L.aadhaarNumber}
            value={form.aadhaarNumber}
            onChangeText={v => setField('aadhaarNumber', digitsOnly(v, 12))}
            placeholder={P.aadhaarNumber}
            error={errors.aadhaarNumber}
            keyboardType="number-pad"
            autoCorrect={false}
          />
        </SecretField>
        <TextField
          label={L.panNumber}
          value={form.panNumber}
          onChangeText={v => setField('panNumber', upperAlnum(v, 10))}
          placeholder={P.panNumber}
          error={errors.panNumber}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        <ChoiceField
          label={L.governmentIdType}
          hint="The ID you’ll upload a photo of."
          options={options.documentTypes}
          selected={form.governmentIdType}
          onSelect={k => setField('governmentIdType', k)}
        />
      </FieldCard>
      <FieldCard title="Your business" hint="Only if your business has them.">
        <TextField
          label={L.gstNumber}
          value={form.gstNumber}
          onChangeText={v => setField('gstNumber', upperAlnum(v, 15))}
          placeholder={P.gstNumber}
          error={errors.gstNumber}
          autoCapitalize="characters"
          autoCorrect={false}
          optional
        />
        <TextField
          label={L.businessRegNumber}
          value={form.businessRegNumber}
          onChangeText={v => setField('businessRegNumber', v)}
          error={errors.businessRegNumber}
          max={LIMITS.regNumber}
          autoCapitalize="characters"
          autoCorrect={false}
          optional
        />
      </FieldCard>
      <PrivacyNote text={COPY.idsNote} />
    </>
  );
}

export default VerificationStep;
