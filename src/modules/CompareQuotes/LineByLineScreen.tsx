import { useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText } from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { COMPARE_ACCENT, COMPARE_NAVY, LINE_BY_LINE_COPY as COPY } from './constants';
import { useAcceptQuotation, useQuoteRequest } from './hooks';
import { mapLineByLine } from './utils';
import { lineByLineStyles as s } from './styles';
import type { CompareCell, CompareColumn } from './types';

type LineByLineRouteProp = RouteProp<RootStackParamList, 'LineByLine'>;
type LineByLineNavigationProp = NativeStackNavigationProp<RootStackParamList>;

function ColumnHead({ column }: { column: CompareColumn }) {
  return (
    <View style={s.column}>
      <View style={[s.columnAvatar, { backgroundColor: column.avatarColor }]}>
        <EventlyText variant="subtitle" style={s.columnAvatarText}>
          {column.initials}
        </EventlyText>
      </View>
      <EventlyText variant="caption" style={s.columnName} numberOfLines={1}>
        {column.shortName}
      </EventlyText>
      <EventlyText variant="subtitle" style={s.columnTotal} numberOfLines={1}>
        {column.totalLabel}
      </EventlyText>
    </View>
  );
}

function Cell({ cell }: { cell: CompareCell }) {
  if (!cell.included) {
    return (
      <View style={s.cell}>
        <EventlyText variant="caption" style={s.cellMissing}>
          {COPY.notIncluded}
        </EventlyText>
      </View>
    );
  }

  return (
    <View style={s.cell}>
      <EventlyText variant="subtitle" style={[s.cellPrice, cell.isLower && s.cellLower]}>
        {cell.priceLabel}
      </EventlyText>
      {/* Only where both sides priced the line — see `mapLineByLine`. */}
      {cell.isLower ? (
        <EventlyText variant="caption" style={s.lowerTag}>
          {COPY.lower}
        </EventlyText>
      ) : null}
    </View>
  );
}

/**
 * Two quotes, line against line.
 *
 * The totals at the top are the decision; the rows underneath are why. Lines
 * are paired on their category, not their position, so decor is compared with
 * decor however each organizer ordered their quote — and a line only one of
 * them covered still gets a row, because a cheaper quote that leaves out
 * transport is not actually cheaper.
 *
 * Accepting either one closes the request and declines the rest, so both
 * buttons are worded as the commitment they are.
 */
export function LineByLineScreen() {
  const navigation = useNavigation<LineByLineNavigationProp>();
  const { params } = useRoute<LineByLineRouteProp>();
  const { data, loading } = useQuoteRequest(params.requestId);
  const accept = useAcceptQuotation();

  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const model = useMemo(
    () => (data ? mapLineByLine(data, params.leftId, params.rightId) : null),
    [data, params.leftId, params.rightId],
  );

  const onAccept = (quotationId: string, organizerId: string) => {
    if (acceptingId) return;
    setAcceptingId(quotationId);
    setError(null);
    accept
      .execute(quotationId)
      /* Straight to paying: accepting is the decision, and the next thing that
         has to happen is the advance. */
      .then(() =>
        navigation.replace('Payment', {
          quotationId,
          ...(organizerId ? { organizerId } : {}),
        }),
      )
      .catch((cause: { message?: string }) => setError(cause?.message ?? COPY.failed))
      .finally(() => setAcceptingId(null));
  };

  const header = (
    <View style={s.header}>
      <TouchableOpacity
        style={s.back}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <EventlyIcon name="chevron-left" size={24} color={COMPARE_NAVY} />
      </TouchableOpacity>
      <EventlyText variant="h1" style={s.title}>
        {COPY.title}
      </EventlyText>
    </View>
  );

  if (loading && !model) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        {header}
        <View style={s.centered}>
          <ActivityIndicator size="large" color={COMPARE_ACCENT} />
        </View>
      </SafeAreaView>
    );
  }

  if (!model || model.rows.length === 0) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        {header}
        <View style={s.centered}>
          <EventlyText variant="body" style={s.centeredText}>
            {COPY.empty}
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      {header}

      <View style={s.columns}>
        <View style={s.columnSpacer} />
        <ColumnHead column={model.left} />
        <ColumnHead column={model.right} />
      </View>

      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {model.rows.map((row) => (
          <View key={row.key} style={s.row}>
            <View style={s.rowLabel}>
              <EventlyText variant="subtitle" style={s.rowTitle} numberOfLines={2}>
                {row.title}
              </EventlyText>
              {row.subtitle ? (
                <EventlyText variant="caption" style={s.rowSubtitle} numberOfLines={2}>
                  {row.subtitle}
                </EventlyText>
              ) : null}
            </View>
            <Cell cell={row.left} />
            <Cell cell={row.right} />
          </View>
        ))}

        {/* Said once, under the table: two quotes rarely cover the same ground,
            and a customer reading only the totals will not notice. */}
        <View style={s.note}>
          <EventlyIcon name="alert-outline" size={17} color="#a07a1f" />
          <EventlyText variant="caption" style={s.noteText}>
            {COPY.scopeNote}
          </EventlyText>
        </View>
      </ScrollView>

      {error ? (
        <EventlyText variant="caption" style={s.error}>
          {error}
        </EventlyText>
      ) : null}

      <View style={s.foot}>
        {[model.left, model.right].map((column, index) => (
          <TouchableOpacity
            key={column.id}
            style={[
              s.accept,
              index === 0 ? s.acceptLeft : s.acceptRight,
              !!acceptingId && s.acceptDisabled,
            ]}
            activeOpacity={0.85}
            disabled={!!acceptingId}
            onPress={() => onAccept(column.id, column.organizerId)}
            accessibilityRole="button"
            accessibilityLabel={`${COPY.accept} ${column.fullName}, ${column.totalLabel}`}
          >
            <EventlyText variant="subtitle" style={s.acceptText} numberOfLines={1}>
              {acceptingId === column.id
                ? COPY.accepting
                : `${COPY.accept} ${column.shortName}`}
            </EventlyText>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default LineByLineScreen;
