import { Pressable, TextInput, View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { formatInr } from '../../Shared';
import { LIMITS, QUOTE_COPY as COPY } from '../constants';
import { AMBER_INK, DANGER, ORG_INK } from '../design';
import { lineStyles as s } from '../styles';
import type { LineForm, TemplateField } from '../types';
import {
  digitsOnly,
  lineAmount,
  subItemValue,
  templateForLine,
  toNumber,
  usesDerivedPrice,
} from '../utils';
import { Field } from './Field';

/** Tick-any add-ons (photography deliverables), kept as one comma list. */
function Options({
  values,
  selected,
  onChange,
}: {
  values: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <View style={s.options}>
      {values.map(v => {
        const on = selected.includes(v);
        return (
          <Pressable
            key={v}
            style={[s.option, on && s.optionOn]}
            onPress={() =>
              onChange(on ? selected.filter(x => x !== v) : [...selected, v])
            }
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
          >
            {on ? (
              <EventlyIcon name="check" size={14} color={AMBER_INK} />
            ) : null}
            <AppText
              variant="bodySmall"
              style={[s.optionText, on && s.optionTextOn]}
            >
              {v}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * One service on the quote, priced the way that service is priced: catering
 * as plates × rate, everything else as one amount. Its total updates as the
 * organizer types.
 */
export function LineCard({
  line,
  error,
  onChange,
  onField,
  onRemove,
}: {
  line: LineForm;
  error?: string;
  onChange: (patch: Partial<LineForm>) => void;
  onField: (label: string, value: string) => void;
  onRemove: () => void;
}) {
  const t = templateForLine(line);
  const amount = lineAmount(line);
  const derived = usesDerivedPrice(line);
  const rateLabel = t.derivePrice?.[1];
  const name = line.title.trim() || COPY.serviceName;

  const fieldInput = (f: TemplateField) => {
    const isRate = f.label === rateLabel;
    return (
      <Field
        key={f.label}
        label={f.label}
        value={subItemValue(line, f.label)}
        placeholder={f.placeholder}
        prefix={isRate ? '₹' : undefined}
        onChangeText={v =>
          onField(
            f.label,
            f.numeric
              ? digitsOnly(v, isRate ? LIMITS.rateDigits : LIMITS.countDigits)
              : v,
          )
        }
        containerStyle={f.numeric ? s.rowItem : undefined}
        keyboardType={f.numeric ? 'number-pad' : 'default'}
        maxLength={f.numeric ? undefined : LIMITS.subItem}
      />
    );
  };

  const numeric = t.fields.filter(f => f.numeric);
  const text = t.fields.filter(f => !f.numeric);
  const optionLabel = t.options?.label ?? '';
  const selected = optionLabel
    ? subItemValue(line, optionLabel)
        .split(',')
        .map(v => v.trim())
        .filter(Boolean)
    : [];

  return (
    <View style={[s.card, error ? s.cardError : null]}>
      <View style={s.head}>
        <View style={s.icon}>
          <EventlyIcon name={t.icon} size={20} color={AMBER_INK} />
        </View>
        <TextInput
          style={s.titleInput}
          value={line.title}
          onChangeText={title => onChange({ title })}
          placeholder={COPY.serviceName}
          placeholderTextColor={ORG_INK.inkFaint}
          maxLength={LIMITS.title}
          accessibilityLabel={COPY.serviceName}
        />
        <Pressable
          style={s.remove}
          onPress={onRemove}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={COPY.removeA11y(name)}
        >
          <EventlyIcon name="trash-can-outline" size={20} color={DANGER} />
        </Pressable>
      </View>

      {numeric.length ? (
        <View style={s.row}>{numeric.map(fieldInput)}</View>
      ) : null}
      {text.map(fieldInput)}

      {t.derivePrice && derived ? (
        <View style={s.maths}>
          <AppText variant="bodySmall" style={s.mathsText}>
            {COPY.plateMaths(
              subItemValue(line, t.derivePrice[0]),
              formatInr(toNumber(subItemValue(line, t.derivePrice[1]))),
            )}
          </AppText>
          <AppText variant="bodySmall" style={s.mathsText}>
            {formatInr(amount)}
          </AppText>
        </View>
      ) : (
        <Field
          label={COPY.amount}
          value={line.price}
          onChangeText={v =>
            onChange({ price: digitsOnly(v, LIMITS.amountDigits) })
          }
          prefix="₹"
          placeholder="0"
          keyboardType="number-pad"
          hint={t.derivePrice ? COPY.lumpSumHint : undefined}
        />
      )}

      {t.options ? (
        <Options
          values={t.options.values}
          selected={selected}
          onChange={next => onField(optionLabel, next.join(', '))}
        />
      ) : null}

      <Field
        label={t.noteLabel}
        value={line.note}
        onChangeText={note => onChange({ note })}
        placeholder={t.notePlaceholder}
        maxLength={LIMITS.note}
        multiline
      />

      <View style={s.total}>
        <AppText variant="bodySmall" style={s.totalLabel}>
          {COPY.lineTotal}
        </AppText>
        {amount > 0 ? (
          <AppText variant="h3" style={s.totalValue}>
            {formatInr(amount)}
          </AppText>
        ) : (
          <AppText variant="bodySmall" style={s.totalEmpty}>
            {COPY.noPrice}
          </AppText>
        )}
      </View>
      {error ? (
        <AppText variant="caption" style={s.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

export default LineCard;
