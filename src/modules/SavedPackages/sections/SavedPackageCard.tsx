import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText, OccasionArt } from '../../../Components';
import { SAVED_ACCENT, SAVED_COPY as COPY } from '../constants';
import { savedCardStyles as s } from '../styles';
import type { SavedPackageDTO } from '../types';

interface SavedPackageCardProps {
  item: SavedPackageDTO;
  /** Opens the planner for this package's occasion. */
  onPress: () => void;
  onRemove: () => void;
}

/**
 * One saved package.
 *
 * The card opens the package; the heart removes it. They are separate controls
 * with separate accessible names, because a single tap target that sometimes
 * deletes and sometimes navigates is how people lose things they meant to keep.
 */
export function SavedPackageCard({ item, onPress, onRemove }: SavedPackageCardProps) {
  const meta = [item.budget, item.guests].filter(Boolean).join(' · ');

  return (
    <View style={s.card}>
      <View style={s.head}>
        <TouchableOpacity
          style={s.art}
          activeOpacity={0.9}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${item.title}. ${COPY.explore}.`}
        >
          <OccasionArt art={item.art} />
        </TouchableOpacity>

        <TouchableOpacity
          style={s.headText}
          activeOpacity={0.8}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${item.title}${meta ? `, ${meta}` : ''}. ${COPY.explore}.`}
        >
          <EventlyText variant="subtitle" style={s.title} numberOfLines={2}>
            {item.title}
          </EventlyText>
          {/* Dropped rather than shown blank when the package carries neither. */}
          {meta ? (
            <EventlyText variant="caption" style={s.meta} numberOfLines={1}>
              {meta}
            </EventlyText>
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity
          style={s.heart}
          activeOpacity={0.7}
          onPress={onRemove}
          accessibilityRole="button"
          accessibilityLabel={`${COPY.remove}: ${item.title}`}
        >
          <EventlyIcon name="heart" size={21} color={SAVED_ACCENT} />
        </TouchableOpacity>
      </View>

      {item.tags?.length ? (
        <View style={s.tags}>
          {item.tags.map((tag) => (
            <View key={tag} style={s.tag}>
              <EventlyText variant="caption" style={s.tagText}>
                {tag}
              </EventlyText>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default SavedPackageCard;
