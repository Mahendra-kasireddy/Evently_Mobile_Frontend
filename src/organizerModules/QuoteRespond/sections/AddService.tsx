import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { AppText, EventlyIcon, PressableScale } from '../../../Components';
import { ADD_CHOICES, QUOTE_COPY as COPY } from '../constants';
import { AMBER_INK } from '../design';
import { addStyles as s } from '../styles';
import type { CategoryTemplate } from '../types';

/** "Add a service", which opens into the kinds of service to choose from. */
export function AddService({
  onAdd,
}: {
  onAdd: (template: CategoryTemplate) => void;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <PressableScale
        style={s.button}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
      >
        <EventlyIcon name="plus" size={20} color={AMBER_INK} />
        <AppText variant="body" style={s.buttonText}>
          {COPY.addService}
        </AppText>
      </PressableScale>
    );
  }

  return (
    <View style={s.picker}>
      <View style={s.pickerHead}>
        <AppText variant="body" style={s.pickerTitle}>
          {COPY.addServiceTitle}
        </AppText>
        <Pressable onPress={() => setOpen(false)} hitSlop={8}>
          <AppText variant="bodySmall" style={s.cancel}>
            {COPY.cancel}
          </AppText>
        </Pressable>
      </View>
      <View style={s.choices}>
        {ADD_CHOICES.map(t => (
          <Pressable
            key={t.key}
            style={s.choice}
            onPress={() => {
              onAdd(t);
              setOpen(false);
            }}
            accessibilityRole="button"
          >
            <EventlyIcon name={t.icon} size={16} color={AMBER_INK} />
            <AppText variant="bodySmall" style={s.choiceText}>
              {t.label}
            </AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default AddService;
