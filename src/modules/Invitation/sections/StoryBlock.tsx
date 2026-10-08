import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  TouchableOpacity,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { EventlyImage, EventlyText } from '../../../Components';
import { absoluteFileUrl } from '../../../services/urls';
import { INVITATION_COPY as COPY } from '../constants';
import { storyStyles as s } from '../styles';
import type { InvitationStoryCardDTO } from '../types';

/** One card fills most of the width; the sliver of the next says there is more. */
const CARD_WIDTH = Math.min(Dimensions.get('window').width * 0.76, 300);
const GAP = 14;
/** What one swipe travels — the card plus the gap after it. */
const INTERVAL = CARD_WIDTH + GAP;

interface StoryBlockProps {
  cards: InvitationStoryCardDTO[];
  /** What the organizer called the section. */
  title: string;
  /** Opening one photograph full screen, through the viewer already on screen. */
  onOpen: (imageUrl: string) => void;
}

/**
 * The couple's story, told in photographs.
 *
 * A horizontal run of cards the customer swipes through, in the order the
 * organizer arranged them — the same thing their guests will get, on the
 * screen where they decide whether to approve it.
 *
 * Snapped rather than free-scrolling: a story has an order, and one card at a
 * time is what makes the order mean anything.
 */
export function StoryBlock({ cards, title, onOpen }: StoryBlockProps) {
  const [active, setActive] = useState(0);
  const listRef = useRef<FlatList<InvitationStoryCardDTO>>(null);

  /*
   * The visibility rule, and the only one: no cards, no block. Not an empty
   * frame, not a heading over nothing — an invitation with no story simply
   * does not have this section.
   */
  if (cards.length === 0) return null;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / INTERVAL);
    setActive(Math.max(0, Math.min(cards.length - 1, index)));
  };

  return (
    <View style={s.block}>
      <EventlyText variant="subtitle" style={s.title} numberOfLines={1}>
        {title || COPY.storyTitle}
      </EventlyText>

      <FlatList
        ref={listRef}
        data={cards}
        keyExtractor={card => card.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        /* Snapped to the card, not paged to the screen: the cards are narrower
           than the screen, so paging would leave them drifting off-centre. */
        snapToInterval={INTERVAL}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={s.track}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <View
            style={[
              { width: CARD_WIDTH },
              index < cards.length - 1 && s.cardGap,
            ]}
          >
            <TouchableOpacity
              style={s.frame}
              activeOpacity={0.9}
              onPress={() => onOpen(item.imageUrl)}
              accessibilityRole="button"
              accessibilityLabel={COPY.storyOpen(index + 1)}
              testID={`story-card-${index}`}
            >
              {/* Cropped to the frame, never stretched — which is what lets
                  portrait, landscape and square sit in one row. */}
              <EventlyImage
                source={{ uri: absoluteFileUrl(item.imageUrl) }}
                style={s.photo}
                resizeMode="cover"
              />
            </TouchableOpacity>
            {item.caption ? (
              <EventlyText
                variant="caption"
                style={s.caption}
                numberOfLines={3}
              >
                {item.caption}
              </EventlyText>
            ) : null}
          </View>
        )}
      />

      {/*
       * Where they are in the story: dots for the shape of it, and the count
       * in words beside them — two shades of a dot is not something a tired
       * eye or a screen reader can count.
       */}
      <View style={s.progress}>
        <View style={s.dots}>
          {cards.map((card, index) => (
            <View key={card.id} style={[s.dot, index === active && s.dotOn]} />
          ))}
        </View>
        <EventlyText variant="caption" style={s.count}>
          {COPY.storyPosition(active + 1, cards.length)}
        </EventlyText>
      </View>
    </View>
  );
}

export default StoryBlock;
