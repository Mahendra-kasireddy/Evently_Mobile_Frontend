import { FIELD_LABEL as L, LIMITS, SETUP_COPY as COPY } from '../../constants';
import type { StepProps } from '../../types';
import { digitsOnly, upperAlnum } from '../../utils';
import {
  FieldCard,
  FileField,
  PrivacyNote,
  SecretField,
  TextField,
} from '../Fields';

const P = COPY.placeholders;

/** Bank details — optional to go live, needed before the first payout. */
export function BankStep({
  form,
  baseline,
  errors,
  uploading,
  setField,
  upload,
  removeFile,
}: StepProps) {
  const changeAccount = () => {
    setField('accountNumber', '');
    setField('confirmAccountNumber', '');
  };
  const keepAccount = () => {
    setField('accountNumber', baseline.accountNumber);
    setField('confirmAccountNumber', baseline.accountNumber);
  };

  return (
    <>
      <FieldCard title="Account">
        <TextField
          label={L.accountHolderName}
          value={form.accountHolderName}
          onChangeText={v => setField('accountHolderName', v)}
          hint="Exactly as on your bank account."
          error={errors.accountHolderName}
          max={LIMITS.bankText}
          autoCapitalize="words"
        />
        <SecretField
          label={L.accountNumber}
          saved={baseline.accountNumber}
          value={form.accountNumber}
          onChange={changeAccount}
          onKeep={keepAccount}
        >
          <TextField
            label={L.accountNumber}
            value={form.accountNumber}
            onChangeText={v => setField('accountNumber', digitsOnly(v, 20))}
            placeholder={P.accountNumber}
            error={errors.accountNumber}
            keyboardType="number-pad"
            autoCorrect={false}
          />
          <TextField
            label={L.confirmAccountNumber}
            value={form.confirmAccountNumber}
            onChangeText={v =>
              setField('confirmAccountNumber', digitsOnly(v, 20))
            }
            error={errors.confirmAccountNumber}
            keyboardType="number-pad"
            autoCorrect={false}
            contextMenuHidden
          />
        </SecretField>
        <TextField
          label={L.ifsc}
          value={form.ifsc}
          onChangeText={v => setField('ifsc', upperAlnum(v, 11))}
          placeholder={P.ifsc}
          error={errors.ifsc}
          autoCapitalize="characters"
          autoCorrect={false}
        />
      </FieldCard>

      <FieldCard title="Bank">
        <TextField
          label={L.bankName}
          value={form.bankName}
          onChangeText={v => setField('bankName', v)}
          error={errors.bankName}
          max={LIMITS.bankText}
          autoCapitalize="words"
        />
        <TextField
          label={L.branchName}
          value={form.branchName}
          onChangeText={v => setField('branchName', v)}
          error={errors.branchName}
          max={LIMITS.bankText}
          autoCapitalize="words"
          optional
        />
        <TextField
          label={L.upiId}
          value={form.upiId}
          onChangeText={v => setField('upiId', v.trim())}
          placeholder={P.upiId}
          error={errors.upiId}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          optional
        />
      </FieldCard>

      <FieldCard>
        <FileField
          label={L.cancelledChequeFile}
          hint={COPY.docHint}
          file={form.cancelledChequeFile}
          kind="document"
          uploading={uploading === 'cancelledChequeFile'}
          onPick={() => upload('cancelledChequeFile')}
          onRemove={() => removeFile('cancelledChequeFile')}
        />
      </FieldCard>
      <PrivacyNote text={COPY.bankNote} />
    </>
  );
}

export default BankStep;
