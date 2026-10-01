import { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { EventlyIcon, EventlyText, EventlyTextInput } from '../../../Components';
import { categoriesStepStyles } from '../styles';
import {
  CATEGORY_ICON_COLOR,
  PLAN_ACCENT,
  PLAN_CHECKLIST_BG,
  PLAN_TEXT_MUTED,
} from '../constants';
import { colors } from '../../../theme';
import type { CategoryOption } from '../utils';

const BANNER_FLOWERS = require('../../../assets/images/flowers_workspace.png');

interface CategoriesStepProps {
  occasionLabel: string;
  categories: CategoryOption[];
  selected: string[];
  onToggle: (id: string) => void;
}

interface TileProps {
  title: string;
  subtitle: string;
  iconName: string;
  iconColor: string;
  isSelected: boolean;
  onPress: () => void;
}

/** One service in the 2-column grid: tinted icon, name, examples, radio. */
function CategoryTile({ title, subtitle, iconName, iconColor, isSelected, onPress }: TileProps) {
  return (
    <TouchableOpacity
      style={[categoriesStepStyles.tile, isSelected && categoriesStepStyles.tileSelected]}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={`${title}. ${subtitle}`}
    >
      <View style={categoriesStepStyles.tileTop}>
        <View style={[categoriesStepStyles.icon, { backgroundColor: iconColor }]}>
          <EventlyIcon name={iconName} size={18} color={colors.onPrimary} />
        </View>
        <View style={[categoriesStepStyles.radio, isSelected && categoriesStepStyles.radioOn]}>
          {isSelected ? <EventlyIcon name="check" size={11} color={colors.onPrimary} /> : null}
        </View>
      </View>
      <EventlyText variant="body" style={categoriesStepStyles.tileTitle} numberOfLines={1}>
        {title}
      </EventlyText>
      <EventlyText variant="caption" style={categoriesStepStyles.tileSubtitle} numberOfLines={1}>
        {subtitle}
      </EventlyText>
    </TouchableOpacity>
  );
}

export function CategoriesStep({ categories, selected, onToggle }: CategoriesStepProps) {
  const [customInput, setCustomInput] = useState('');

  // Anything selected that isn't one of the preset categories is a service the
  // customer typed in themselves — rendered as its own tile using the typed
  // text as both id and label, removable the same way as any preset tile.
  const customCategories = selected.filter((id) => !categories.some((c) => c.id === id));

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed || selected.includes(trimmed)) return;
    onToggle(trimmed);
    setCustomInput('');
  };

  return (
    <View style={categoriesStepStyles.section}>
      <View style={categoriesStepStyles.banner}>
        {/* A sprig of the same bouquet as the details hero, faded in from the
            left so it only peeks over the top-right corner. */}
        <View style={categoriesStepStyles.bannerArt} pointerEvents="none">
          <Image source={BANNER_FLOWERS} style={categoriesStepStyles.bannerArtImage} resizeMode="cover" />
          <Svg style={categoriesStepStyles.bannerArtFade} width="100%" height="100%">
            <Defs>
              <LinearGradient id="checklistFade" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={PLAN_CHECKLIST_BG} stopOpacity={1} />
                <Stop offset="0.7" stopColor={PLAN_CHECKLIST_BG} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width="100%" height="100%" fill="url(#checklistFade)" />
          </Svg>
        </View>

        <View style={categoriesStepStyles.bannerIcon}>
          <EventlyIcon name="clipboard-check-outline" size={22} color={PLAN_ACCENT} />
        </View>
        <View style={categoriesStepStyles.bannerText}>
          <EventlyText variant="subtitle" style={categoriesStepStyles.bannerTitle}>
            What&rsquo;s on your checklist?
          </EventlyText>
          <EventlyText variant="caption" style={categoriesStepStyles.bannerSubtitle}>
            Choose the services you need. Organizers quote only for what you select — nothing extra.
          </EventlyText>
        </View>
        <EventlyText style={categoriesStepStyles.bannerScript}>{'Make it\nhappen ♥'}</EventlyText>
      </View>

      <View style={categoriesStepStyles.grid}>
        {categories.map((category) => (
          <CategoryTile
            key={category.id}
            title={category.title}
            subtitle={category.subtitle}
            iconName={category.iconName}
            iconColor={CATEGORY_ICON_COLOR[category.icon] ?? colors.text}
            isSelected={selected.includes(category.id)}
            onPress={() => onToggle(category.id)}
          />
        ))}

        {customCategories.map((label) => (
          <CategoryTile
            key={label}
            title={label}
            subtitle="Added by you"
            iconName="tag-outline"
            iconColor={PLAN_TEXT_MUTED}
            isSelected
            onPress={() => onToggle(label)}
          />
        ))}
      </View>

      <View style={categoriesStepStyles.addRow}>
        <EventlyIcon name="plus" size={16} color={PLAN_TEXT_MUTED} />
        <EventlyTextInput
          style={categoriesStepStyles.addInput}
          value={customInput}
          placeholder="Don't see it? Type your own service"
          placeholderTextColor={PLAN_TEXT_MUTED}
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
  );
}

export default CategoriesStep;
