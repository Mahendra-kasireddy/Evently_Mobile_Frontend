import { View } from 'react-native';
import {
  AppText,
  EventlyIcon,
  GradientFill,
  PressableScale,
} from '../../../Components';
import { ENQUIRIES_COPY as COPY } from '../constants';
import { AVATAR_TINTS, ORG_ACTION_GRADIENT, ORG_INK } from '../design';
import { cardStyles as s, chipToneStyles } from '../styles';
import type { EnquiryItem } from '../types';

const MAX_TAGS = 3;

function tintFor(id: string): [string, string] {
  let sum = 0;
  for (let i = 0; i < id.length; i += 1) sum += id.charCodeAt(i);
  return AVATAR_TINTS[sum % AVATAR_TINTS.length];
}

/**
 * One enquiry: who, what, when — and the one thing to do about it. The whole
 * card opens the quote; the button says which kind of opening it is.
 */
export function EnquiryCard({
  item,
  onOpen,
}: {
  item: EnquiryItem;
  onOpen: () => void;
}) {
  const tone = chipToneStyles[item.chip.tone];
  const primary = item.stage === 'new' || item.stage === 'draft';
  const extraTags = item.categories.length - MAX_TAGS;

  const facts = [
    item.when ? { icon: 'calendar-blank-outline', text: item.when } : null,
    item.guests
      ? { icon: 'account-group-outline', text: COPY.guests(item.guests) }
      : null,
    item.budget ? { icon: 'currency-inr', text: item.budget } : null,
  ].filter((f): f is { icon: string; text: string } => f !== null);

  return (
    <PressableScale
      style={s.card}
      onPress={onOpen}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}${
        item.occasion ? `, ${item.occasion}` : ''
      }. ${item.chip.label}. ${item.action}`}
    >
      <View style={s.head}>
        <View style={s.avatar}>
          <GradientFill colors={tintFor(item.id)} direction="diagonal" />
          <AppText variant="bodySmall" style={s.initials}>
            {item.initials}
          </AppText>
        </View>
        <View style={s.headText}>
          <View style={s.titleRow}>
            <AppText variant="h3" style={s.title} numberOfLines={1}>
              {item.title}
            </AppText>
            {item.occasion ? (
              <View style={s.occasion}>
                <AppText variant="label" style={s.occasionText}>
                  {item.occasion}
                </AppText>
              </View>
            ) : null}
          </View>
          {item.where ? (
            <AppText variant="caption" style={s.where} numberOfLines={1}>
              {item.where}
            </AppText>
          ) : null}
        </View>
        <View style={s.side}>
          {item.receivedAgo ? (
            <AppText variant="label" style={s.ago}>
              {item.receivedAgo}
            </AppText>
          ) : null}
          <View style={[s.chip, tone.box]}>
            <AppText variant="label" style={[s.chipText, tone.text]}>
              {item.chip.label}
            </AppText>
          </View>
        </View>
      </View>

      {facts.length ? (
        <View style={s.facts}>
          {facts.map(f => (
            <View key={f.icon} style={s.fact}>
              <EventlyIcon name={f.icon} size={15} color={ORG_INK.inkSoft} />
              <AppText variant="bodySmall" style={s.factText}>
                {f.text}
              </AppText>
            </View>
          ))}
        </View>
      ) : null}

      {item.categories.length ? (
        <View style={s.tags}>
          {item.categories.slice(0, MAX_TAGS).map(c => (
            <View key={c} style={s.tag}>
              <AppText variant="label" style={s.tagText}>
                {c}
              </AppText>
            </View>
          ))}
          {extraTags > 0 ? (
            <View style={s.tag}>
              <AppText variant="label" style={s.tagText}>
                {`+${extraTags}`}
              </AppText>
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={s.foot}>
        {item.quoteTotal ? (
          <View style={s.quote}>
            <AppText variant="label" style={s.quoteLabel}>
              {COPY.yourQuote}
            </AppText>
            <AppText variant="h3" style={s.quoteValue}>
              {item.quoteTotal}
            </AppText>
          </View>
        ) : (
          <View style={s.spacer} />
        )}
        <View style={[s.button, !primary && s.buttonGhost]}>
          {primary ? (
            <GradientFill colors={ORG_ACTION_GRADIENT} direction="across" />
          ) : null}
          <AppText
            variant="bodySmall"
            style={[s.buttonText, !primary && s.buttonTextGhost]}
          >
            {item.action}
          </AppText>
          <EventlyIcon
            name="arrow-right"
            size={16}
            color={primary ? '#ffffff' : ORG_INK.ink}
          />
        </View>
      </View>
    </PressableScale>
  );
}

export default EnquiryCard;
