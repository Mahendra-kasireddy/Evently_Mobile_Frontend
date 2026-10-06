import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import type { OrganizerOnboardingResult } from '../container';
import { DEFAULT_DOCUMENT_TYPES } from '../constants';
import { fieldStyles, screenStyles } from '../styles';
import { RE, type ServicesConfig } from '../types';
import { FieldText } from './FieldText';
import { SelectField } from './SelectField';
import { UploadTile } from './UploadTile';

interface StepVerificationProps {
  onb: OrganizerOnboardingResult;
  servicesConfig: ServicesConfig | undefined;
}

export function StepVerification({ onb, servicesConfig }: StepVerificationProps) {
  const { values, files, fieldErrors, setField, uploadingField, pickAndUpload, removeFile } = onb;
  const documentTypes = servicesConfig?.documentTypes?.length ? servicesConfig.documentTypes : DEFAULT_DOCUMENT_TYPES;
  const aadhaarValid = RE.aadhaar.test(values.aadhaarNumber.trim());
  const panValid = RE.pan.test(values.panNumber.trim());

  return (
    <View style={screenStyles.stepBody}>
      <FieldText
        label="Aadhaar number"
        value={values.aadhaarNumber}
        onChangeText={(v) => setField('aadhaarNumber', v.replace(/\D/g, '').slice(0, 12))}
        placeholder="XXXX XXXX 4521"
        error={fieldErrors.aadhaarNumber}
        keyboardType="number-pad"
      />
      {aadhaarValid ? <ValidBanner text="Aadhaar format looks valid" /> : null}

      <FieldText
        label="PAN number"
        value={values.panNumber}
        onChangeText={(v) => setField('panNumber', v.toUpperCase().slice(0, 10))}
        placeholder="ABCDE1234F"
        error={fieldErrors.panNumber}
        autoCapitalize="characters"
      />
      {panValid ? <ValidBanner text="PAN format looks valid" /> : null}

      <SelectField
        label="Government ID type"
        value={values.governmentIdType}
        options={documentTypes}
        onSelect={(key) => setField('governmentIdType', key)}
        placeholder="Select the ID you're uploading"
      />

      <UploadTile
        label="Government ID upload"
        hint="Front side of the ID selected above"
        file={files.governmentIdFile}
        uploading={uploadingField === 'governmentIdFile'}
        onPick={(file) => pickAndUpload('governmentIdFile', file)}
        onRemove={() => removeFile('governmentIdFile')}
      />

      <UploadTile
        label="PAN card upload"
        file={files.panFile}
        uploading={uploadingField === 'panFile'}
        onPick={(file) => pickAndUpload('panFile', file)}
        onRemove={() => removeFile('panFile')}
      />

      <FieldText
        label="GSTIN"
        value={values.gstNumber}
        onChangeText={(v) => setField('gstNumber', v.toUpperCase().slice(0, 15))}
        placeholder="36ABCDE1234F1Z5"
        error={fieldErrors.gstNumber}
        autoCapitalize="characters"
        optional
      />
      {values.gstNumber.trim() && RE.gst.test(values.gstNumber.trim()) ? <ValidBanner text="GSTIN format looks valid" /> : null}

      <UploadTile
        label="Business proof"
        hint="Shop licence, GST certificate or trade certificate"
        file={files.businessRegFile}
        uploading={uploadingField === 'businessRegFile'}
        onPick={(file) => pickAndUpload('businessRegFile', file)}
        onRemove={() => removeFile('businessRegFile')}
        optional
      />
    </View>
  );
}

function ValidBanner({ text }: { text: string }) {
  return (
    <View style={fieldStyles.valid}>
      <EventlyIcon name="check-circle" size={15} color="#1d9e75" />
      <EventlyText variant="caption" style={fieldStyles.validText}>
        {text}
      </EventlyText>
    </View>
  );
}

export default StepVerification;
