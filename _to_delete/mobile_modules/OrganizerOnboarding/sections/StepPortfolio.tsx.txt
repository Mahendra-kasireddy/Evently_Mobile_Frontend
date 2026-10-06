import { View } from 'react-native';
import type { OrganizerOnboardingResult } from '../container';
import { screenStyles } from '../styles';
import { FieldText } from './FieldText';
import { GalleryGrid } from './GalleryGrid';
import { UploadTile } from './UploadTile';

interface StepPortfolioProps {
  onb: OrganizerOnboardingResult;
}

export function StepPortfolio({ onb }: StepPortfolioProps) {
  const { values, files, setField, uploadingField, pickAndUpload, removeFile } = onb;

  return (
    <View style={screenStyles.stepBody}>
      <UploadTile
        label="Cover photo"
        hint="A wide showcase image customers see first"
        file={files.coverPhoto}
        uploading={uploadingField === 'coverPhoto'}
        onPick={(file) => pickAndUpload('coverPhoto', file)}
        onRemove={() => removeFile('coverPhoto')}
      />

      <FieldText label="Tagline" value={values.tagline} onChangeText={(v) => setField('tagline', v)} placeholder="One line that sums up your business" optional maxLength={120} />

      <FieldText
        label="Short bio"
        value={values.businessDescription}
        onChangeText={(v) => setField('businessDescription', v)}
        placeholder="Full-service celebration specialists serving your city for X years."
        multiline
        maxLength={4000}
      />

      <FieldText
        label="Years of experience"
        value={values.yearsOfExperience}
        onChangeText={(v) => setField('yearsOfExperience', v.replace(/\D/g, '').slice(0, 2))}
        placeholder="e.g. 7"
        keyboardType="number-pad"
        optional
      />

      <GalleryGrid
        label="Portfolio"
        files={files.gallery}
        uploading={uploadingField === 'gallery'}
        onAdd={(file) => pickAndUpload('gallery', file)}
        onRemove={(index) => removeFile('gallery', index)}
      />
    </View>
  );
}

export default StepPortfolio;
