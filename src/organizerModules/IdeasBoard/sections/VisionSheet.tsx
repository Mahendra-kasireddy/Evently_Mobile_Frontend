import { Switch, TextInput, View } from 'react-native';
import { AppText } from '../../../Components';
import { IDEAS_COPY, VISION_SLOTS, VISION_SLOT_MAX } from '../constants';
import type { VisionSheetResult } from '../container';
import { ORG_ACCENT, ORG_INK } from '../design';
import { sheetStyles as s } from '../styles';
import { Sheet } from './Sheet';

const COPY = IDEAS_COPY.vision;

/** Editing the event vision: four short slots and the surprise's lock. */
export function VisionSheet({ v }: { v: VisionSheetResult }) {
  const { form, errors } = v;
  return (
    <Sheet
      visible={v.visible}
      icon="palette-outline"
      title={COPY.sheetTitle}
      closeLabel={COPY.close}
      busy={v.saving}
      onClose={v.close}
      primary={{
        title: v.saving ? COPY.saving : COPY.save,
        onPress: () => {
          v.save().catch(() => undefined);
        },
        disabled: !v.dirty,
      }}
      cancelLabel={COPY.cancel}
    >
      <AppText variant="body" style={s.body}>
        {COPY.sheetBody}
      </AppText>

      {VISION_SLOTS.map(slot => {
        const error = errors[slot.key];
        return (
          <View key={slot.key} style={s.field}>
            <View style={s.labelRow}>
              <AppText variant="bodySmall" style={s.label}>
                {slot.label}
              </AppText>
              <AppText variant="label" style={s.counter}>
                {`${form[slot.key].length}/${VISION_SLOT_MAX}`}
              </AppText>
            </View>
            <TextInput
              style={[s.input, error ? s.inputError : null]}
              value={form[slot.key]}
              onChangeText={text => v.setField(slot.key, text)}
              placeholder={slot.placeholder}
              placeholderTextColor={ORG_INK.inkFaint}
              maxLength={VISION_SLOT_MAX}
              editable={!v.saving}
              accessibilityLabel={slot.label}
            />
            {error ? (
              <AppText variant="caption" style={s.error}>
                {error}
              </AppText>
            ) : null}
          </View>
        );
      })}

      <View style={s.switchRow}>
        <View style={s.switchText}>
          <AppText variant="bodySmall" style={s.label}>
            {COPY.lockLabel}
          </AppText>
          <AppText variant="caption" style={s.hint}>
            {COPY.lockHint}
          </AppText>
        </View>
        <Switch
          value={form.surpriseConfidential}
          onValueChange={on => v.setField('surpriseConfidential', on)}
          trackColor={{ true: ORG_ACCENT.saffron, false: ORG_INK.inkFaint }}
          accessibilityLabel={COPY.lockLabel}
        />
      </View>

      {v.error ? (
        <AppText
          variant="caption"
          style={s.error}
          accessibilityLiveRegion="polite"
        >
          {v.error}
        </AppText>
      ) : null}
    </Sheet>
  );
}

export default VisionSheet;
