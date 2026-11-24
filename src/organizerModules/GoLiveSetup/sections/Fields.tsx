import { useEffect, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Switch,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import type { StoredFile } from '../../Shared';
import { SETUP_COPY as COPY } from '../constants';
import { ORG_ACCENT, ORG_INK, ORG_PAPER } from '../design';
import { fieldStyles as s } from '../styles';
import type { Option } from '../types';
import { maskTail, toFileModel } from '../utils';

/** A small titled card that groups a few related fields. */
export function FieldCard({
  title,
  hint,
  children,
}: {
  title?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <View style={s.card}>
      {title || hint ? (
        <View style={s.cardHead}>
          {title ? (
            <AppText variant="h3" style={s.cardTitle}>
              {title}
            </AppText>
          ) : null}
          {hint ? (
            <AppText variant="caption" style={s.cardHint}>
              {hint}
            </AppText>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

/** Two short fields side by side. */
export function FieldRow({ children }: { children: ReactNode }) {
  return <View style={s.row}>{children}</View>;
}

export function Half({ children }: { children: ReactNode }) {
  return <View style={s.half}>{children}</View>;
}

function Label({
  label,
  optional,
  right,
}: {
  label: string;
  optional?: boolean;
  right?: string;
}) {
  return (
    <View style={s.labelRow}>
      <AppText variant="bodySmall" style={s.label}>
        {label}
        {optional ? (
          <AppText variant="caption" style={s.optional}>
            {`  ${COPY.optionalTag}`}
          </AppText>
        ) : null}
      </AppText>
      {right ? (
        <AppText variant="label" style={s.counter}>
          {right}
        </AppText>
      ) : null}
    </View>
  );
}

function HintOrError({ hint, error }: { hint?: string; error?: string }) {
  if (error)
    return (
      <AppText variant="caption" style={s.error}>
        {error}
      </AppText>
    );
  if (hint)
    return (
      <AppText variant="caption" style={s.hint}>
        {hint}
      </AppText>
    );
  return null;
}

/** A labelled text field with an optional counter, hint and error. */
export function TextField({
  label,
  value,
  onChangeText,
  max,
  counter = false,
  hint,
  error,
  optional,
  multiline = false,
  locked = false,
  ...rest
}: {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  max?: number;
  /** Show "12/120" beside the label. */
  counter?: boolean;
  hint?: string;
  error?: string;
  optional?: boolean;
  multiline?: boolean;
  /** Shown but not editable (e.g. the verified mobile). */
  locked?: boolean;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'multiline'>) {
  return (
    <View style={s.field}>
      <Label
        label={label}
        optional={optional}
        right={counter && max ? COPY.count(value.length, max) : undefined}
      />
      <TextInput
        {...rest}
        style={[
          s.input,
          multiline && s.inputMulti,
          locked && s.inputLocked,
          error ? s.inputError : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        editable={!locked}
        multiline={multiline}
        maxLength={max}
        placeholderTextColor={ORG_INK.inkFaint}
        accessibilityLabel={label}
      />
      <HintOrError hint={hint} error={error} />
    </View>
  );
}

/**
 * Pick from a config list. Up to three single choices draw as a segmented
 * control; longer lists and multi-selects as chips.
 */
export function ChoiceField({
  label,
  hint,
  options,
  selected,
  onSelect,
  multi = false,
  optional,
  error,
}: {
  label: string;
  hint?: string;
  options: Option[];
  selected: string | string[];
  onSelect: (key: string) => void;
  multi?: boolean;
  optional?: boolean;
  error?: string;
}) {
  const isOn = (key: string) =>
    Array.isArray(selected) ? selected.includes(key) : selected === key;
  const segmented = !multi && options.length > 0 && options.length <= 3;

  return (
    <View style={s.field}>
      <Label label={label} optional={optional} />
      {options.length === 0 ? (
        <AppText variant="caption" style={s.hint}>
          {COPY.optionsLoading}
        </AppText>
      ) : segmented ? (
        <View style={s.segment} accessibilityRole="radiogroup">
          {options.map(o => {
            const on = isOn(o.key);
            return (
              <Pressable
                key={o.key}
                style={[s.segmentItem, on && s.segmentOn]}
                onPress={() => onSelect(o.key)}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
              >
                <AppText
                  variant="bodySmall"
                  style={[s.segmentText, on && s.segmentTextOn]}
                  numberOfLines={1}
                >
                  {o.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View style={s.chips}>
          {options.map(o => {
            const on = isOn(o.key);
            return (
              <Pressable
                key={o.key}
                style={[s.chip, on && s.chipOn]}
                onPress={() => onSelect(o.key)}
                accessibilityRole={multi ? 'checkbox' : 'radio'}
                accessibilityState={multi ? { checked: on } : { selected: on }}
              >
                {on ? (
                  <EventlyIcon name="check" size={14} color="#a8560f" />
                ) : null}
                <AppText
                  variant="bodySmall"
                  style={[s.chipText, on && s.chipTextOn]}
                >
                  {o.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      )}
      <HintOrError hint={hint} error={error} />
    </View>
  );
}

/** A yes/no setting. */
export function SwitchRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={s.switchRow}>
      <AppText variant="body" style={s.switchLabel}>
        {label}
      </AppText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: ORG_PAPER.hairline, true: ORG_ACCENT.marigold }}
        thumbColor="#ffffff"
        ios_backgroundColor={ORG_PAPER.hairline}
        accessibilityLabel={label}
      />
    </View>
  );
}

const confirmRemove = (onRemove: () => void) =>
  Alert.alert(COPY.removeFileTitle, COPY.removeFileBody, [
    { text: COPY.cancel, style: 'cancel' },
    { text: COPY.remove, style: 'destructive', onPress: onRemove },
  ]);

/**
 * One photo or document: its thumbnail (or a file icon for a PDF uploaded
 * on the web) with Replace and Remove, or an "add" tile when empty.
 */
export function FileField({
  label,
  hint,
  file,
  kind,
  uploading,
  onPick,
  onRemove,
  optional,
  error,
}: {
  label: string;
  hint?: string;
  file: StoredFile | null;
  kind: 'avatar' | 'cover' | 'document';
  uploading: boolean;
  onPick: () => void;
  onRemove: () => void;
  optional?: boolean;
  error?: string;
}) {
  const model = file ? toFileModel(file) : null;
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [model?.uri]);
  const showImage = !!model && model.isImage && model.uri !== '' && !failed;

  return (
    <View style={s.field}>
      <Label label={label} optional={optional} />
      {model ? (
        <View style={s.fileRow}>
          <View
            style={[
              s.thumb,
              kind === 'avatar' && s.thumbRound,
              kind === 'cover' && s.thumbWide,
            ]}
          >
            {uploading ? (
              <ActivityIndicator color={ORG_ACCENT.saffron} />
            ) : showImage ? (
              <Image
                source={{ uri: model.uri }}
                style={s.thumbImage}
                onError={() => setFailed(true)}
              />
            ) : (
              <EventlyIcon
                name="file-document-outline"
                size={26}
                color={ORG_INK.inkSoft}
              />
            )}
          </View>
          <View style={s.fileText}>
            <AppText variant="bodySmall" style={s.fileName} numberOfLines={1}>
              {model.name}
            </AppText>
            <View style={s.fileActions}>
              <Pressable
                onPress={onPick}
                disabled={uploading}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`${COPY.replace} ${label}`}
              >
                <AppText variant="bodySmall" style={s.link}>
                  {uploading ? COPY.uploading : COPY.replace}
                </AppText>
              </Pressable>
              <Pressable
                onPress={() => confirmRemove(onRemove)}
                disabled={uploading}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`${COPY.remove} ${label}`}
              >
                <AppText variant="bodySmall" style={[s.link, s.linkDanger]}>
                  {COPY.remove}
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <Pressable
          style={s.addTile}
          onPress={onPick}
          disabled={uploading}
          accessibilityRole="button"
          accessibilityLabel={`${label}: ${
            kind === 'document' ? COPY.addDocument : COPY.addPhoto
          }`}
        >
          {uploading ? (
            <ActivityIndicator color={ORG_ACCENT.saffron} />
          ) : (
            <>
              <EventlyIcon
                name={kind === 'document' ? 'camera-document' : 'image-plus'}
                size={22}
                color={ORG_ACCENT.saffron}
              />
              <AppText variant="bodySmall" style={s.addText}>
                {kind === 'document' ? COPY.addDocument : COPY.addPhoto}
              </AppText>
            </>
          )}
        </Pressable>
      )}
      <HintOrError hint={hint} error={error} />
    </View>
  );
}

/** A row of photos with an add tile in front and × on each. */
export function GalleryField({
  label,
  files,
  max,
  uploading,
  onAdd,
  onRemove,
}: {
  label: string;
  files: StoredFile[];
  max: number;
  uploading: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  const tiles = files.map(toFileModel);
  return (
    <View style={s.field}>
      <Label label={label} right={COPY.count(files.length, max)} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.strip}
      >
        {files.length < max ? (
          <Pressable
            style={s.tileAdd}
            onPress={onAdd}
            disabled={uploading}
            accessibilityRole="button"
            accessibilityLabel={`${label}: ${COPY.addPhoto}`}
          >
            {uploading ? (
              <ActivityIndicator color={ORG_ACCENT.saffron} />
            ) : (
              <>
                <EventlyIcon
                  name="image-plus"
                  size={24}
                  color={ORG_ACCENT.saffron}
                />
                <AppText variant="label" style={s.addLabel}>
                  {COPY.addPhoto}
                </AppText>
              </>
            )}
          </Pressable>
        ) : null}
        {tiles.map((tile, index) => (
          <View key={tile.key} style={s.tile}>
            {tile.isImage ? (
              <Image source={{ uri: tile.uri }} style={s.thumbImage} />
            ) : null}
            <Pressable
              style={s.tileRemove}
              onPress={() => confirmRemove(() => onRemove(index))}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel={`${COPY.remove} photo ${index + 1}`}
            >
              <EventlyIcon name="close" size={14} color="#ffffff" />
            </Pressable>
          </View>
        ))}
      </ScrollView>
      <AppText variant="caption" style={s.hint}>
        {COPY.galleryHint(files.length, max)}
      </AppText>
    </View>
  );
}

/**
 * A sensitive number already on file (Aadhaar, account number): shown masked,
 * replaced only after a deliberate "Change". "Keep saved" puts it back.
 */
export function SecretField({
  label,
  saved,
  value,
  onChange,
  onKeep,
  children,
}: {
  label: string;
  /** The saved value; empty means nothing on file and the input shows at once. */
  saved: string;
  /** The form's current value — editing whenever it differs from `saved`. */
  value: string;
  /** Clears the value so a new one can be typed. */
  onChange: () => void;
  /** Puts the saved value back. */
  onKeep: () => void;
  /** The input(s) for the new value. */
  children: ReactNode;
}) {
  const hasSaved = saved.trim() !== '';
  if (!hasSaved || value !== saved) {
    return (
      <>
        {children}
        {hasSaved ? (
          <Pressable onPress={onKeep} hitSlop={8} accessibilityRole="button">
            <AppText variant="bodySmall" style={s.link}>
              {COPY.keep}
            </AppText>
          </Pressable>
        ) : null}
      </>
    );
  }
  return (
    <View style={s.field}>
      <Label label={label} />
      <View style={s.secret}>
        <EventlyIcon name="lock-outline" size={18} color={ORG_INK.inkSoft} />
        <AppText variant="body" style={s.secretValue}>
          {maskTail(saved)}
        </AppText>
        <Pressable
          onPress={onChange}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`${COPY.change} ${label}`}
        >
          <AppText variant="bodySmall" style={s.link}>
            {COPY.change}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

/** A quiet lock-icon note under a group of sensitive fields. */
export function PrivacyNote({ text }: { text: string }) {
  return (
    <View style={s.note}>
      <EventlyIcon name="lock-outline" size={15} color={ORG_INK.inkSoft} />
      <AppText variant="caption" style={s.noteText}>
        {text}
      </AppText>
    </View>
  );
}
