import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText, EventlyTextInput } from '../../../Components';
import { categoriesStepStyles } from '../styles';
import { CATEGORY_ICON_COLOR, PLAN_TEXT_MUTED } from '../constants';
import { colors } from '../../../theme';
import type { CategoryOption } from '../utils';

interface CategoriesStepProps {
  occasionLabel: string;
  categories: CategoryOption[];
  selected: string[];
  onToggle: (id: string) => void;
}

export function CategoriesStep({ occasionLabel, categories, selected, onToggle }: CategoriesStepProps) {
  const [customInput, setCustomInput] = useState('');

  // Anything selected that isn't one of the preset categories is a service the
  // customer typed in themselves — rendered as its own row using the typed
  // text as both id and label, removable the same way as any preset row.
  const customCategories = selected.filter((id) => !categories.some((c) => c.id === id));
  const totalCount = categories.length + customCategories.length;

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed || selected.includes(trimmed)) return;
    onToggle(trimmed);
    setCustomInput('');
  };

  return (
    <View style={categoriesStepStyles.section}>
      <View style={categoriesStepStyles.head}>
        <EventlyText variant="h2" style={categoriesStepStyles.title}>
          What do you need for your {occasionLabel}?
        </EventlyText>
        <View style={categoriesStepStyles.counterPill}>
          <EventlyText variant="caption" style={categoriesStepStyles.counter}>
            {selected.length}/{totalCount}
          </EventlyText>
        </View>
      </View>
      <EventlyText variant="body" style={categoriesStepStyles.subtitle}>
        Tap the services you want organizers to quote.
      </EventlyText>

      <View style={categoriesStepStyles.list}>
        {categories.map((category) => {
          const isSelected = selected.includes(category.id);
          const iconColor = CATEGORY_ICON_COLOR[category.icon] ?? colors.text;
          return (
            <TouchableOpacity
              key={category.id}
              style={[categoriesStepStyles.row, isSelected && categoriesStepStyles.rowSelected]}
              activeOpacity={0.8}
              onPress={() => onToggle(category.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
            >
              <View style={[categoriesStepStyles.icon, { backgroundColor: iconColor }]}>
                <EventlyIcon name={category.iconName} size={20} color={colors.onPrimary} />
              </View>
              <View style={categoriesStepStyles.textCol}>
                <EventlyText variant="subtitle" style={categoriesStepStyles.rowTitle}>
                  {category.title}
                </EventlyText>
                <EventlyText variant="caption" style={categoriesStepStyles.rowSubtitle}>
                  {category.subtitle}
                </EventlyText>
              </View>
              <View style={[categoriesStepStyles.checkCircle, isSelected && categoriesStepStyles.checkCircleOn]}>
                {isSelected ? <EventlyIcon name="check" size={14} color={colors.onPrimary} /> : null}
              </View>
            </TouchableOpacity>
          );
        })}

        {customCategories.map((label) => (
          <TouchableOpacity
            key={label}
            style={[categoriesStepStyles.row, categoriesStepStyles.rowSelected]}
            activeOpacity={0.8}
            onPress={() => onToggle(label)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: true }}
          >
            <View style={[categoriesStepStyles.icon, { backgroundColor: PLAN_TEXT_MUTED }]}>
              <EventlyIcon name="tag-outline" size={20} color={colors.onPrimary} />
            </View>
            <View style={categoriesStepStyles.textCol}>
              <EventlyText variant="subtitle" style={categoriesStepStyles.rowTitle}>
                {label}
              </EventlyText>
              <EventlyText variant="caption" style={categoriesStepStyles.rowSubtitle}>
                Added by you
              </EventlyText>
            </View>
            <View style={[categoriesStepStyles.checkCircle, categoriesStepStyles.checkCircleOn]}>
              <EventlyIcon name="check" size={14} color={colors.onPrimary} />
            </View>
          </TouchableOpacity>
        ))}

        <View style={categoriesStepStyles.addRow}>
          <EventlyIcon name="plus" size={16} color={PLAN_TEXT_MUTED} />
          <EventlyTextInput
            style={categoriesStepStyles.addInput}
            value={customInput}
            placeholder="Don't see it? Type your own service"
            onChangeText={setCustomInput}
            onSubmitEditing={addCustom}
            returnKeyType="done"
          />
          {customInput.trim() ? (
            <TouchableOpacity style={categoriesStepStyles.addButton} onPress={addCustom} accessibilityLabel="Add service">
              <EventlyIcon name="arrow-up" size={16} color={colors.onPrimary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default CategoriesStep;
