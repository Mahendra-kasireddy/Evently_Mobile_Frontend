import { View } from 'react-native';
import {
  AppText,
  EventlyIcon,
  EventlyImage,
  PressableScale,
} from '../../../Components';
import { PUBLIC_EVENTS_COPY as COPY } from '../constants';
import { ORG_ACCENT, ORG_INK } from '../design';
import { cardStyles as s, fillWidth } from '../styles';
import type { EventCardModel } from '../types';
import { StatusChip } from './StatusChip';

/** One event: its cover, when and where, how it is selling — opens the workspace. */
export function EventCard({
  item,
  onOpen,
}: {
  item: EventCardModel;
  onOpen: () => void;
}) {
  return (
    <PressableScale
      style={[s.card, item.past && s.cardPast]}
      onPress={onOpen}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.when}. ${item.status.label}. ${item.soldLine}`}
    >
      {item.coverUri ? (
        <View style={s.cover}>
          <EventlyImage
            source={{ uri: item.coverUri }}
            style={s.coverImage}
            resizeMode="cover"
          />
          <StatusChip status={item.status} style={s.chipOnCover} />
        </View>
      ) : (
        <View style={s.coverEmpty}>
          <EventlyIcon
            name="ticket-confirmation-outline"
            size={40}
            color={ORG_ACCENT.saffron}
          />
          <StatusChip status={item.status} style={s.chipOnCover} />
        </View>
      )}

      <View style={s.body}>
        <View style={s.date}>
          {item.day ? (
            <>
              <AppText variant="h2" style={s.day}>
                {item.day}
              </AppText>
              <AppText variant="label" style={s.month}>
                {item.month}
              </AppText>
            </>
          ) : (
            <EventlyIcon
              name="calendar-question"
              size={22}
              color={ORG_INK.inkSoft}
            />
          )}
        </View>
        <View style={s.text}>
          <AppText variant="h3" style={s.title} numberOfLines={2}>
            {item.title}
          </AppText>
          <AppText variant="caption" style={s.meta} numberOfLines={1}>
            {item.when}
          </AppText>
          <AppText variant="caption" style={s.meta} numberOfLines={1}>
            {item.place}
          </AppText>
        </View>
      </View>

      <View style={s.foot}>
        <View style={s.sales}>
          <AppText variant="bodySmall" style={s.salesLine}>
            {item.soldLine}
            {item.priceLine ? (
              <AppText variant="bodySmall" style={s.price}>
                {`  ·  ${item.priceLine}`}
              </AppText>
            ) : null}
          </AppText>
          {item.soldPercent !== null ? (
            <View style={s.track}>
              <View style={[s.fill, fillWidth(item.soldPercent)]} />
            </View>
          ) : null}
        </View>
        <View style={s.open}>
          <AppText variant="bodySmall" style={s.openText}>
            {COPY.open}
          </AppText>
          <EventlyIcon name="arrow-right" size={16} color={ORG_INK.ink} />
        </View>
      </View>
    </PressableScale>
  );
}

export default EventCard;
