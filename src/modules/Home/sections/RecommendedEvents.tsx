import { FlatList, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { ORGANIZER_TIER_COLOR } from '../constants';
import { recommendedEventsStyles } from '../styles';
import { colors } from '../../../theme';
import type { RecommendedEventItem, RecommendedEventsViewModel } from '../types';

interface RecommendedEventsProps {
  data: RecommendedEventsViewModel;
}

function RecommendedEventCard({ item }: { item: RecommendedEventItem }) {
  const tierColor = ORGANIZER_TIER_COLOR[item.tier];

  return (
    <View style={recommendedEventsStyles.card}>
      <View style={[recommendedEventsStyles.tierStrip, { backgroundColor: tierColor }]} />
      <View style={[recommendedEventsStyles.avatar, { backgroundColor: item.avatarColor }]}>
        <EventlyText variant="subtitle" style={recommendedEventsStyles.avatarText}>
          {item.initials}
        </EventlyText>
      </View>
      <EventlyText variant="subtitle" style={recommendedEventsStyles.name} numberOfLines={1}>
        {item.name}
      </EventlyText>
      <View style={[recommendedEventsStyles.tierBadge, { backgroundColor: tierColor }]}>
        <EventlyText variant="caption" style={recommendedEventsStyles.tierBadgeText}>
          {item.tier}
        </EventlyText>
      </View>
      <View style={recommendedEventsStyles.ratingRow}>
        <EventlyIcon name="star" size={14} color={colors.accent} />
        <EventlyText variant="caption" style={recommendedEventsStyles.ratingText}>
          {item.rating.toFixed(1)}
        </EventlyText>
        <EventlyText variant="caption" style={recommendedEventsStyles.reviews}>
          {' '}
          ({item.reviews} reviews)
        </EventlyText>
      </View>
      {item.tags.length > 0 ? (
        <View style={recommendedEventsStyles.tagRow}>
          {item.tags.slice(0, 2).map((tag) => (
            <EventlyText key={tag} variant="caption" style={recommendedEventsStyles.tag}>
              {tag}
            </EventlyText>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export function RecommendedEvents({ data }: RecommendedEventsProps) {
  return (
    <View style={recommendedEventsStyles.section}>
      <View style={recommendedEventsStyles.header}>
        <EventlyText variant="h2" style={recommendedEventsStyles.title}>
          {data.title}
        </EventlyText>
        <EventlyText variant="body" style={recommendedEventsStyles.seeAll}>
          {data.seeAllLabel}
        </EventlyText>
      </View>
      <FlatList
        data={data.items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={recommendedEventsStyles.list}
        renderItem={({ item }) => <RecommendedEventCard item={item} />}
      />
    </View>
  );
}

export default RecommendedEvents;
