import { FIELD_LABEL as L, LIMITS, SETUP_COPY as COPY } from '../../constants';
import type { StepProps } from '../../types';
import { digitsOnly } from '../../utils';
import { FieldCard, FileField, GalleryField, TextField } from '../Fields';

const P = COPY.placeholders;

/** Profile & portfolio, in three tabs: your story, your photos, your links. */
export function PortfolioStep({
  form,
  errors,
  part,
  uploading,
  setField,
  upload,
  removeFile,
}: StepProps) {
  if (part === 'photos') {
    return (
      <>
        <FieldCard>
          <FileField
            label={L.coverPhoto}
            hint={COPY.coverHint}
            file={form.coverPhoto}
            kind="cover"
            uploading={uploading === 'coverPhoto'}
            onPick={() => upload('coverPhoto')}
            onRemove={() => removeFile('coverPhoto')}
          />
        </FieldCard>
        <FieldCard>
          <GalleryField
            label={L.gallery}
            files={form.gallery}
            max={LIMITS.gallery}
            uploading={uploading === 'gallery'}
            onAdd={() => upload('gallery')}
            onRemove={i => removeFile('gallery', i)}
          />
        </FieldCard>
      </>
    );
  }

  if (part === 'links') {
    return (
      <FieldCard
        title="Where else to find you"
        hint="All optional — customers like to see your work."
      >
        <TextField
          label={L.website}
          value={form.website}
          onChangeText={v => setField('website', v.trim())}
          placeholder={P.website}
          error={errors.website}
          max={LIMITS.social}
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {(['instagram', 'facebook', 'youtube', 'linkedin'] as const).map(
          key => (
            <TextField
              key={key}
              label={L[key]}
              value={form[key]}
              onChangeText={v => setField(key, v.trim())}
              placeholder={P.social}
              error={errors[key]}
              max={LIMITS.social}
              autoCapitalize="none"
              autoCorrect={false}
            />
          ),
        )}
      </FieldCard>
    );
  }

  return (
    <FieldCard title="Your story">
      <TextField
        label={L.tagline}
        value={form.tagline}
        onChangeText={v => setField('tagline', v)}
        placeholder={P.tagline}
        max={LIMITS.tagline}
        counter
        error={errors.tagline}
        optional
      />
      <TextField
        label={L.businessDescription}
        value={form.businessDescription}
        onChangeText={v => setField('businessDescription', v)}
        placeholder={P.businessDescription}
        max={LIMITS.bio}
        counter
        error={errors.businessDescription}
        multiline
      />
      <TextField
        label={L.yearsOfExperience}
        value={form.yearsOfExperience}
        onChangeText={v => setField('yearsOfExperience', digitsOnly(v, 2))}
        error={errors.yearsOfExperience}
        keyboardType="number-pad"
        optional
      />
    </FieldCard>
  );
}

export default PortfolioStep;
