import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import type { OrganizerOnboardingResult } from '../container';
import { ORG_GREEN } from '../constants';
import { fieldStyles, screenStyles } from '../styles';
import type { OnboardingConfig } from '../types';
import { FieldText } from './FieldText';
import { SelectField } from './SelectField';
import { UploadTile } from './UploadTile';

interface StepBasicProps {
  onb: OrganizerOnboardingResult;
  config: OnboardingConfig | undefined;
}

export function StepBasic({ onb, config }: StepBasicProps) {
  const { values, files, mobile, fieldErrors, setField, uploadingField, pickAndUpload, removeFile } = onb;
  const cityOptions = (config?.cities ?? []).map((c) => ({ key: c, label: c }));

  return (
    <View style={screenStyles.stepBody}>
      <UploadTile
        label="Profile photo"
        file={files.profilePhoto}
        uploading={uploadingField === 'profilePhoto'}
        onPick={(file) => pickAndUpload('profilePhoto', file)}
        onRemove={() => removeFile('profilePhoto')}
        variant="avatar"
      />

      <View style={fieldStyles.group}>
        <EventlyText variant="subtitle" style={fieldStyles.label}>
          Mobile number
        </EventlyText>
        <View style={fieldStyles.readonlyRow}>
          <EventlyText variant="body" style={fieldStyles.readonlyText}>
            +91 {mobile}
          </EventlyText>
          <EventlyIcon name="check-circle" size={16} color={ORG_GREEN} />
        </View>
      </View>

      <View style={fieldStyles.row}>
        <View style={fieldStyles.half}>
          <FieldText label="First name" value={values.firstName} onChangeText={(v) => setField('firstName', v)} placeholder="e.g. Rahul" />
        </View>
        <View style={fieldStyles.half}>
          <FieldText label="Last name" value={values.lastName} onChangeText={(v) => setField('lastName', v)} placeholder="e.g. Verma" />
        </View>
      </View>

      <FieldText
        label="Email address"
        value={values.contactEmail}
        onChangeText={(v) => setField('contactEmail', v)}
        placeholder="you@business.com"
        error={fieldErrors.contactEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <FieldText label="Business name" value={values.businessName} onChangeText={(v) => setField('businessName', v)} placeholder="e.g. Verma Events Co." />

      <FieldText label="Display name" value={values.displayName} onChangeText={(v) => setField('displayName', v)} placeholder="Shown to customers" optional />

      <SelectField
        label="Business type"
        value={values.businessType}
        options={config?.businessTypes ?? []}
        onSelect={(key) => setField('businessType', key)}
        placeholder="Select a business type"
      />

      <SelectField
        label="Primary category"
        value={values.primaryCategory}
        options={config?.categories ?? []}
        onSelect={(key) => setField('primaryCategory', key)}
        placeholder="Select a category"
      />

      <SelectField
        label="City"
        value={values.city}
        options={cityOptions}
        onSelect={(key) => setField('city', key)}
        placeholder="Select or type a city"
        allowCustomInput
      />
    </View>
  );
}

export default StepBasic;
