import { FlatList, TouchableOpacity, View } from 'react-native';
import { EventlyButton, EventlyIcon, EventlyText } from '../../../Components';
import { featuredEventsStyles } from '../styles';
import { colors } from '../../../theme';
import type { FeaturedEventItem, FeaturedEventsViewModel } from '../types';

interface FeaturedEventsProps {
  data: FeaturedEventsViewModel;
  onPressPackage: () => void;
  onPressBuildYourOwn: () => void;
}

function FeaturedEventCard({ item, onPress }: { item: FeaturedEventItem; onPress: () => void }) {
  return (
    <TouchableOpacity style={featuredEventsStyles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={featuredEventsStyles.badge}>
        <EventlyText variant="caption" style={featuredEventsStyles.badgeText}>
          {item.badge}
        </EventlyText>
      </View>
      <EventlyText variant="subtitle" style={featuredEventsStyles.eventTitle} numberOfLines={2}>
        {item.title}
      </EventlyText>
      <View style={featuredEventsStyles.metaRow}>
        <EventlyIcon name="account-group-outline" size={14} color={colors.textMuted} />
        <EventlyText variant="caption" style={featuredEventsStyles.metaText}>
          {item.guests}
        </EventlyText>
      </View>
      <View style={featuredEventsStyles.metaRow}>
        <EventlyIcon name="wallet-outline" size={14} color={colors.primary} />
        <EventlyText variant="caption" style={featuredEventsStyles.budgetText}>
          {item.budget}
        </EventlyText>
      </View>
      {item.tags.length > 0 && (
        <View style={featuredEventsStyles.tagRow}>
          {item.tags.slice(0, 3).map((tag) => (
            <EventlyText key={tag} variant="caption" style={featuredEventsStyles.tag}>
              {tag}
            </EventlyText>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

export function FeaturedEvents({ data, onPressPackage, onPressBuildYourOwn }: FeaturedEventsProps) {
  return (
    <View style={featuredEventsStyles.section}>
      <View style={featuredEventsStyles.header}>
        <EventlyText variant="h2" style={featuredEventsStyles.title}>
          {data.title}
        </EventlyText>
        {data.subtitle ? (
          <EventlyText variant="body" style={featuredEventsStyles.subtitle}>
            {data.subtitle}
          </EventlyText>
        ) : null}
      </View>
      <FlatList
        data={data.items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={featuredEventsStyles.list}
        renderItem={({ item }) => <FeaturedEventCard item={item} onPress={onPressPackage} />}
      />
      {data.buildLabel ? (
        <View style={featuredEventsStyles.buildRow}>
          <EventlyButton title={data.buildLabel} variant="outline" onPress={onPressBuildYourOwn} />
        </View>
      ) : null}
    </View>
  );
}

export default FeaturedEvents;
