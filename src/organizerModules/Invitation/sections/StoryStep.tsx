import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import { AppText, EventlyIcon, EventlyImage } from '../../../Components';
import { INVITATION_COPY as COPY, LIMITS } from '../constants';
import type { StoryEditor } from '../editors';
import { DANGER, ORG_ACCENT, ORG_INK } from '../design';
import {
  styles as base,
  fieldStyles as f,
  listStyles as l,
  storyStyles as s,
} from '../styles';
import type { StoryCardForm } from '../types';
import { FormField, Group } from './Fields';

/** Up, down, remove — the three moves a row can make. */
export function RowTools({
  name,
  first,
  last,
  onMove,
  onRemove,
}: {
  name: string;
  first: boolean;
  last: boolean;
  onMove: (delta: number) => void;
  onRemove: () => void;
}) {
  return (
    <View style={l.tools}>
      <Pressable
        style={[l.tool, first && l.toolOff]}
        onPress={() => onMove(-1)}
        disabled={first}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel={`${COPY.moveUp}: ${name}`}
      >
        <EventlyIcon name="chevron-up" size={20} color={ORG_INK.ink} />
      </Pressable>
      <Pressable
        style={[l.tool, last && l.toolOff]}
        onPress={() => onMove(1)}
        disabled={last}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel={`${COPY.moveDown}: ${name}`}
      >
        <EventlyIcon name="chevron-down" size={20} color={ORG_INK.ink} />
      </Pressable>
      <Pressable
        style={l.tool}
        onPress={onRemove}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel={`${COPY.remove}: ${name}`}
      >
        <EventlyIcon name="trash-can-outline" size={19} color={DANGER.ink} />
      </Pressable>
    </View>
  );
}

function StoryRow({
  card,
  index,
  total,
  maxCaption,
  st,
}: {
  card: StoryCardForm;
  index: number;
  total: number;
  maxCaption: number;
  st: StoryEditor;
}) {
  const name = COPY.storyPhoto(index + 1);
  return (
    <View style={l.row}>
      <View style={s.rowTop}>
        <View style={s.thumb}>
          <EventlyImage
            source={{ uri: card.uri }}
            style={s.thumbImage}
            resizeMode="cover"
            accessibilityLabel={name}
          />
          <View style={s.badge}>
            <AppText variant="label" style={s.badgeText}>
              {String(index + 1)}
            </AppText>
          </View>
        </View>
        <View style={s.rowBody}>
          <TextInput
            style={[f.input, s.caption]}
            value={card.caption}
            onChangeText={text => st.setCaption(card.key, text)}
            placeholder={COPY.storyCaptionPh}
            placeholderTextColor={ORG_INK.inkFaint}
            maxLength={maxCaption}
            multiline
            accessibilityLabel={`${COPY.storyCaption}: ${name}`}
          />
          <AppText variant="label" style={f.counter}>
            {COPY.count(card.caption.length, maxCaption)}
          </AppText>
        </View>
      </View>
      <RowTools
        name={name}
        first={index === 0}
        last={index === total - 1}
        onMove={delta => st.move(card.key, delta)}
        onRemove={() => st.remove(card.key)}
      />
    </View>
  );
}

/** The story: a title, and photos with captions in the order guests swipe them. */
export function StoryStep({ st }: { st: StoryEditor }) {
  const form = st.form;
  if (!form) return null;
  const full = form.cards.length >= st.maxCards;

  return (
    <View style={base.stack}>
      <Group>
        <FormField
          label={COPY.storyTitleField}
          value={form.title}
          onChangeText={st.setTitle}
          placeholder={COPY.storyTitlePh}
          max={LIMITS.storyTitle}
        />
      </Group>

      {form.cards.length === 0 ? (
        <AppText variant="bodySmall" style={base.note}>
          {COPY.storyEmpty}
        </AppText>
      ) : null}

      <View style={l.list}>
        {form.cards.map((card, index) => (
          <StoryRow
            key={card.key}
            card={card}
            index={index}
            total={form.cards.length}
            maxCaption={st.maxCaption}
            st={st}
          />
        ))}
      </View>

      <Pressable
        style={[l.add, (full || st.uploading) && l.addOff]}
        onPress={st.add}
        disabled={full || st.uploading}
        accessibilityRole="button"
        accessibilityLabel={COPY.storyAdd}
      >
        {st.uploading ? (
          <ActivityIndicator color={ORG_ACCENT.saffron} />
        ) : (
          <EventlyIcon name="image-plus" size={20} color={ORG_ACCENT.saffron} />
        )}
        <AppText variant="bodySmall" style={l.addText}>
          {st.uploading
            ? COPY.uploading
            : full
            ? COPY.storyFull(st.maxCards)
            : `${COPY.storyAdd} · ${form.cards.length}/${st.maxCards}`}
        </AppText>
      </Pressable>
    </View>
  );
}

export default StoryStep;
