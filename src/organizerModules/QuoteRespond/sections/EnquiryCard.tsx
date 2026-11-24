import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { AppText, EventlyIcon, GradientFill } from '../../../Components';
import { QUOTE_COPY as COPY } from '../constants';
import { ORG_ACTION_GRADIENT, ORG_INK } from '../design';
import { enquiryStyles as s } from '../styles';
import type { EnquirySummary } from '../types';

const IDEAS_LINES = 3;
/** Short enough to read in three lines — no "Read more" needed. */
const IDEAS_SHORT = 140;

/** Who is asking, for what, when and where — and what they have in mind. */
export function EnquiryCard({ summary }: { summary: EnquirySummary }) {
  const [open, setOpen] = useState(false);
  const long = summary.ideas.length > IDEAS_SHORT;

  return (
    <View style={s.card}>
      <View style={s.head}>
        <GradientFill colors={ORG_ACTION_GRADIENT} direction="diagonal" />
        <AppText variant="overline" style={s.eyebrow}>
          {COPY.enquiryEyebrow}
        </AppText>
        <View style={s.titleRow}>
          <AppText variant="h2" style={s.title} numberOfLines={1}>
            {summary.title}
          </AppText>
          {summary.occasion ? (
            <View style={s.occasion}>
              <AppText variant="label" style={s.occasionText}>
                {summary.occasion}
              </AppText>
            </View>
          ) : null}
        </View>
      </View>

      <View style={s.body}>
        {summary.facts.length ? (
          <View style={s.facts}>
            {summary.facts.map(f => (
              <View key={f.icon} style={s.fact}>
                <EventlyIcon name={f.icon} size={18} color={ORG_INK.inkSoft} />
                <AppText variant="body" style={s.factText}>
                  {f.text}
                </AppText>
              </View>
            ))}
          </View>
        ) : null}

        {summary.categories.length ? (
          <View style={s.tags}>
            {summary.categories.map(c => (
              <View key={c} style={s.tag}>
                <AppText variant="caption" style={s.tagText}>
                  {c}
                </AppText>
              </View>
            ))}
          </View>
        ) : null}

        {summary.ideas ? (
          <Pressable
            style={s.ideas}
            onPress={() => setOpen(o => !o)}
            disabled={!long}
            accessibilityRole={long ? 'button' : undefined}
            accessibilityState={long ? { expanded: open } : undefined}
          >
            <AppText variant="label" style={s.ideasTitle}>
              {COPY.ideasTitle}
            </AppText>
            <AppText
              variant="body"
              style={s.ideasText}
              numberOfLines={open || !long ? undefined : IDEAS_LINES}
            >
              {summary.ideas}
            </AppText>
            {long ? (
              <AppText variant="bodySmall" style={s.more}>
                {open ? COPY.readLess : COPY.readMore}
              </AppText>
            ) : null}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export default EnquiryCard;
