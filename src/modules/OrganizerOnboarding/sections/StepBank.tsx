import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import type { OrganizerOnboardingResult } from '../container';
import { ORG_GREEN_DARK } from '../constants';
import { screenStyles } from '../styles';
import { FieldText } from './FieldText';
import { UploadTile } from './UploadTile';

interface StepBankProps {
  onb: OrganizerOnboardingResult;
}

export function StepBank({ onb }: StepBankProps) {
  const { values, files, fieldErrors, setField, uploadingField, pickAndUpload, removeFile } = onb;
  const mismatch =
    values.confirmAccountNumber.trim().length > 0 && values.confirmAccountNumber.trim() !== values.accountNumber.trim();

  return (
    <View style={screenStyles.stepBody}>
      <FieldText label="Account holder name" value={values.accountHolderName} onChangeText={(v) => setField('accountHolderName', v)} placeholder="As per bank records" />

      <FieldText label="Bank name" value={values.bankName} onChangeText={(v) => setField('bankName', v)} placeholder="e.g. HDFC Bank" />

      <FieldText
        label="Account number"
        value={values.accountNumber}
        onChangeText={(v) => setField('accountNumber', v.replace(/\D/g, '').slice(0, 20))}
        placeholder="Enter account number"
        error={fieldErrors.accountNumber}
        keyboardType="number-pad"
      />

      <FieldText
        label="Confirm account number"
        value={values.confirmAccountNumber}
        onChangeText={(v) => setField('confirmAccountNumber', v.replace(/\D/g, '').slice(0, 20))}
        placeholder="Re-enter account number"
        error={mismatch ? 'Account numbers do not match' : undefined}
        keyboardType="number-pad"
      />

      <FieldText
        label="IFSC code"
        value={values.ifsc}
        onChangeText={(v) => setField('ifsc', v.toUpperCase().slice(0, 11))}
        placeholder="HDFC0001234"
        error={fieldErrors.ifsc}
        autoCapitalize="characters"
      />

      <FieldText label="Branch name" value={values.branchName} onChangeText={(v) => setField('branchName', v)} placeholder="e.g. MG Road" optional />

      <FieldText
        label="UPI ID"
        value={values.upiId}
        onChangeText={(v) => setField('upiId', v)}
        placeholder="name@bank"
        error={fieldErrors.upiId}
        autoCapitalize="none"
        optional
      />

      <UploadTile
        label="Cancelled cheque"
        hint="A photo of a cancelled cheque, to verify this account"
        file={files.cancelledChequeFile}
        uploading={uploadingField === 'cancelledChequeFile'}
        onPick={(file) => pickAndUpload('cancelledChequeFile', file)}
        onRemove={() => removeFile('cancelledChequeFile')}
      />

      <View style={screenStyles.noteBox}>
        <EventlyIcon name="lock-outline" size={16} color={ORG_GREEN_DARK} />
        <EventlyText variant="caption" style={screenStyles.noteText}>
          Bank details are encrypted and never shared with customers.
        </EventlyText>
      </View>
    </View>
  );
}

export default StepBank;
