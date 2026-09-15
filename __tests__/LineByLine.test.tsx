/**
 * @format
 *
 * Two quotes, matched line against line.
 *
 * The rule this screen lives or dies by: a line one organizer did not quote is
 * a difference in what you get, never a price of zero and never a saving. Most
 * of what follows is about that.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  return function MockIcon({ name, size, color }: { name: string; size?: number; color?: string }) {
    return <Text style={{ fontSize: size, color }}>{` icon:${name}`}</Text>;
  };
});

import { page, toHtml } from '../test-utils/rn-to-html';
import { mapLineByLine } from '../src/modules/CompareQuotes/utils';
import { lineByLineStyles as s } from '../src/modules/CompareQuotes/styles';
import { LINE_BY_LINE_COPY as COPY } from '../src/modules/CompareQuotes/constants';
import { EventlyIcon, EventlyText } from '../src/Components';
import { View } from 'react-native';
import type {
  CompareCell,
  QuoteRequestDTO,
  QuotationDTO,
} from '../src/modules/CompareQuotes/types';

declare const process: { env: Record<string, string | undefined> };
const fs: { writeFileSync(p: string, d: string, e: string): void; existsSync(p: string): boolean } =
  require('fs');

const line = (key: string, title: string, subtitle: string, price: number) => ({
  key,
  title,
  subtitle,
  price,
  note: '',
});

const quotation = (over: Partial<QuotationDTO> = {}): QuotationDTO =>
  ({
    id: 'q1',
    requestId: 'r1',
    status: 'sent',
    lineItems: [
      line('decor', 'Decor & flowers', 'Stage, entrance, seating', 145000),
      line('photo', 'Photo & video', '2 photographers, 1 cinematographer', 94000),
      line('music', 'Music & DJ', 'Sound, lights, 4 hours', 48000),
      line('priest', 'Priest & rituals', 'Samagri included', 22000),
      line('transport', 'Transport', 'Guest pickup, 2 vehicles', 38000),
      line('service', 'Service fee', 'Coordination, on-day team', 74500),
    ],
    subtotal: 421500,
    taxRate: 18,
    taxAmount: 75870,
    grandTotal: 684000,
    advancePercentage: 30,
    advanceAmount: 205200,
    organizer: {
      id: 'o1',
      name: 'Mahendra Events',
      initials: 'ME',
      avatarColor: '#6d5bd0',
      tier: 'gold',
      rating: 4.8,
      reviews: 62,
    },
    ...over,
  }) as QuotationDTO;

const right = quotation({
  id: 'q2',
  lineItems: [
    line('decor', 'Decor & flowers', 'Stage, entrance, seating', 210000),
    line('photo', 'Photo & video', '2 photographers, 1 cinematographer', 88000),
    line('music', 'Music & DJ', 'Sound, lights, 4 hours', 52000),
    line('priest', 'Priest & rituals', 'Samagri included', 24000),
    line('transport', 'Transport', 'Guest pickup, 2 vehicles', 34000),
    line('service', 'Service fee', 'Coordination, on-day team', 49000),
  ],
  grandTotal: 742000,
  organizer: {
    id: 'o2',
    name: 'Sruthi Celebrations',
    initials: 'SC',
    avatarColor: '#e8633a',
    tier: 'gold',
    rating: 4.6,
    reviews: 41,
  },
});

const request = (quotations: QuotationDTO[]): QuoteRequestDTO =>
  ({
    id: 'r1',
    occasion: 'Naming',
    when: '5 Sep 2026',
    where: 'Kukatpally',
    guests: '150',
    status: 'quoted',
    quotations,
  }) as QuoteRequestDTO;

const model = (quotations: QuotationDTO[] = [quotation(), right]) =>
  mapLineByLine(request(quotations), 'q1', 'q2');

describe('mapLineByLine', () => {
  it('puts both totals at the top, under the organizer who quoted them', () => {
    const m = model()!;
    expect(m.left.fullName).toBe('Mahendra Events');
    expect(m.left.totalLabel).toBe('₹6,84,000');
    expect(m.right.fullName).toBe('Sruthi Celebrations');
    expect(m.right.totalLabel).toBe('₹7,42,000');
  });

  it('shortens the name for a column heading, keeping the full one for speech', () => {
    expect(model()!.left.shortName).toBe('Mahendra');
  });

  it('marks the cheaper side of each line, and only one of them', () => {
    const m = model()!;
    const decor = m.rows.find((r) => r.key === 'decor')!;
    expect(decor.left.isLower).toBe(true);
    expect(decor.right.isLower).toBe(false);

    const photo = m.rows.find((r) => r.key === 'photo')!;
    expect(photo.left.isLower).toBe(false);
    expect(photo.right.isLower).toBe(true);
  });

  it('pairs lines by category, not by the order they were written in', () => {
    // Two organizers write their quotes in whatever order they like; pairing
    // by row number would compare decor against catering.
    const shuffled = quotation({
      lineItems: [
        line('service', 'Service fee', 'Coordination, on-day team', 74500),
        line('decor', 'Decor & flowers', 'Stage, entrance, seating', 145000),
      ],
    });
    const m = mapLineByLine(request([shuffled, right]), 'q1', 'q2')!;
    const decor = m.rows.find((r) => r.key === 'decor')!;
    expect(decor.left.priceLabel).toBe('₹1,45,000');
    expect(decor.right.priceLabel).toBe('₹2,10,000');
  });

  it('gives a line only one of them quoted a row of its own', () => {
    // "The cheaper one did not include transport" is the most useful thing
    // this screen can say, and it cannot say it by leaving the row out.
    const withoutTransport = quotation({
      lineItems: quotation().lineItems.filter((l) => l.key !== 'transport'),
    });
    const m = mapLineByLine(request([withoutTransport, right]), 'q1', 'q2')!;
    const transport = m.rows.find((r) => r.key === 'transport')!;

    expect(transport.left.included).toBe(false);
    expect(transport.left.priceLabel).toBe('Not included');
    expect(transport.right.included).toBe(true);
  });

  it('never calls an unquoted line the cheaper one', () => {
    // Not covering something is a difference in scope, not a better price.
    const withoutTransport = quotation({
      lineItems: quotation().lineItems.filter((l) => l.key !== 'transport'),
    });
    const m = mapLineByLine(request([withoutTransport, right]), 'q1', 'q2')!;
    const transport = m.rows.find((r) => r.key === 'transport')!;

    expect(transport.left.isLower).toBe(false);
    expect(transport.right.isLower).toBe(false);
  });

  it('marks neither side when two prices are equal', () => {
    const same = quotation({ lineItems: [line('music', 'Music & DJ', '', 52000)] });
    const m = mapLineByLine(request([same, right]), 'q1', 'q2')!;
    const music = m.rows.find((r) => r.key === 'music')!;
    expect(music.left.isLower).toBe(false);
    expect(music.right.isLower).toBe(false);
  });

  it('refuses to compare a quote that is not on this request', () => {
    expect(mapLineByLine(request([quotation()]), 'q1', 'q2')).toBeNull();
  });

  it('ignores a withdrawn quote, which is not an option any more', () => {
    const pulled = quotation({ id: 'q2', status: 'withdrawn' });
    expect(mapLineByLine(request([quotation(), pulled]), 'q1', 'q2')).toBeNull();
  });
});

describe('copy', () => {
  it('warns that the two quotes may not cover the same ground', () => {
    // A customer reading only the totals will not notice the cheaper one left
    // something out.
    expect(COPY.scopeNote).toContain('not a saving');
  });
});

describe('render dump', () => {
  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) return;

    const m = model()!;

    const Cell = ({ cell }: { cell: CompareCell }) =>
      cell.included ? (
        <View style={s.cell}>
          <EventlyText variant="subtitle" style={[s.cellPrice, cell.isLower && s.cellLower]}>
            {cell.priceLabel}
          </EventlyText>
          {cell.isLower ? (
            <EventlyText variant="caption" style={s.lowerTag}>
              {COPY.lower}
            </EventlyText>
          ) : null}
        </View>
      ) : (
        <View style={s.cell}>
          <EventlyText variant="caption" style={s.cellMissing}>
            {COPY.notIncluded}
          </EventlyText>
        </View>
      );

    let tree!: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <View style={s.container}>
          <View style={s.header}>
            <View style={s.back}>
              <EventlyIcon name="chevron-left" size={24} color="#1a2e5a" />
            </View>
            <EventlyText variant="h1" style={s.title}>
              {COPY.title}
            </EventlyText>
          </View>

          <View style={s.columns}>
            <View style={s.columnSpacer} />
            {[m.left, m.right].map((column) => (
              <View key={column.id} style={s.column}>
                <View style={[s.columnAvatar, { backgroundColor: column.avatarColor }]}>
                  <EventlyText variant="subtitle" style={s.columnAvatarText}>
                    {column.initials}
                  </EventlyText>
                </View>
                <EventlyText variant="caption" style={s.columnName}>
                  {column.shortName}
                </EventlyText>
                <EventlyText variant="subtitle" style={s.columnTotal}>
                  {column.totalLabel}
                </EventlyText>
              </View>
            ))}
          </View>

          {m.rows.map((row) => (
            <View key={row.key} style={s.row}>
              <View style={s.rowLabel}>
                <EventlyText variant="subtitle" style={s.rowTitle}>
                  {row.title}
                </EventlyText>
                {row.subtitle ? (
                  <EventlyText variant="caption" style={s.rowSubtitle}>
                    {row.subtitle}
                  </EventlyText>
                ) : null}
              </View>
              <Cell cell={row.left} />
              <Cell cell={row.right} />
            </View>
          ))}

          <View style={s.note}>
            <EventlyIcon name="alert-outline" size={17} color="#a07a1f" />
            <EventlyText variant="caption" style={s.noteText}>
              {COPY.scopeNote}
            </EventlyText>
          </View>

          <View style={s.foot}>
            <View style={[s.accept, s.acceptLeft]}>
              <EventlyText variant="subtitle" style={s.acceptText}>
                {`${COPY.accept} ${m.left.shortName}`}
              </EventlyText>
            </View>
            <View style={[s.accept, s.acceptRight]}>
              <EventlyText variant="subtitle" style={s.acceptText}>
                {`${COPY.accept} ${m.right.shortName}`}
              </EventlyText>
            </View>
          </View>
        </View>,
      );
    });

    fs.writeFileSync(
      out,
      page([['Line by line', toHtml(tree.toJSON())]], {
        title: 'Line by line',
        width: 390,
        background: '#fff',
        padding: 0,
      }),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
