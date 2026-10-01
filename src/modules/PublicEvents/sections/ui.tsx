import { Image, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { absoluteFileUrl } from '../../../services/urls';
import { categoryTint, formatEventWhen } from '../constants';
import { PE_MUTED, ui } from '../ui.styles';

/** The category on a coloured pill. */
export function CategoryPill({ category }: { category: string }) {
  if (!category) return null;
  const tint = categoryTint(category);
  return (
    <View style={[ui.pill, { backgroundColor: tint.bg }]}>
      <EventlyText
        variant="caption"
        style={[ui.pillText, { color: tint.fg }]}
        numberOfLines={1}
      >
        {category}
      </EventlyText>
    </View>
  );
}

/** "● LIVE NOW". */
export function LivePill() {
  return (
    <View style={ui.livePill}>
      <View style={ui.liveDot} />
      <EventlyText variant="caption" style={ui.livePillText}>
        LIVE NOW
      </EventlyText>
    </View>
  );
}

/** An icon and one line of text: a date, a venue. */
export function InfoLine({
  icon,
  text,
  lines = 1,
}: {
  icon: string;
  text: string;
  lines?: number;
}) {
  if (!text) return null;
  return (
    <View style={ui.line}>
      <EventlyIcon name={icon} size={14} color={PE_MUTED} />
      <EventlyText variant="caption" style={ui.lineText} numberOfLines={lines}>
        {text}
      </EventlyText>
    </View>
  );
}

/** The event in one row: picture, title, when and where. */
export function EventMini({
  coverUrl,
  title,
  startDateTime,
  timezone,
  venue,
}: {
  coverUrl: string;
  title: string;
  startDateTime: string | null;
  timezone: string;
  venue: string;
}) {
  return (
    <View style={ui.mini}>
      <Image
        source={{ uri: absoluteFileUrl(coverUrl) }}
        style={ui.miniThumb}
        resizeMode="cover"
      />
      <View style={ui.miniText}>
        <EventlyText variant="body" style={ui.miniTitle} numberOfLines={2}>
          {title}
        </EventlyText>
        <InfoLine
          icon="calendar-month-outline"
          text={formatEventWhen(startDateTime, timezone)}
        />
        <InfoLine icon="map-marker-outline" text={venue} />
      </View>
    </View>
  );
}
