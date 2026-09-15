/**
 * @format
 *
 * Paying the advance.
 *
 * The rule worth pinning down: this app never decides what is owed and never
 * decides that a payment happened. It states the server's figures, hands the
 * server's order to Razorpay, and sends the result back to be verified. Most
 * of what follows checks that nothing here quietly does arithmetic.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  return function MockIcon({ name, size, color }: { name: string; size?: number; color?: string }) {
    return <Text style={{ fontSize: size, color }}>{` icon:${name}`}</Text>;
  };
});

import { View } from 'react-native';
import { page, toHtml } from '../test-utils/rn-to-html';
import { mapPayment } from '../src/modules/Payment/utils';
import { styles as s, successStyles } from '../src/modules/Payment/styles';
import {
  PAYMENT_COPY,
  PAY_OPTIONS,
  SUCCESS_COPY,
} from '../src/modules/Payment/constants';
import { EventlyIcon, EventlyText } from '../src/Components';
import type { PaymentOrderDTO } from '../src/modules/Payment/types';

declare const process: { env: Record<string, string | undefined> };
const fs: { writeFileSync(p: string, d: string, e: string): void; existsSync(p: string): boolean } =
  require('fs');

/** An order exactly as the server prices it. */
const order = (over: Partial<PaymentOrderDTO> = {}): PaymentOrderDTO => ({
  orderId: 'order_ABC',
  amountInPaise: 20_520_000,
  currency: 'INR',
  keyId: 'rzp_test_key',
  advanceAmount: 205200,
  totalAmount: 684000,
  balanceAmount: 478800,
  advancePercentage: 30,
  couponCode: '',
  couponDiscount: 0,
  organizerName: 'Mahendra Events',
  ...over,
});

describe('mapPayment', () => {
  it('states the advance, the share it is, and the total behind it', () => {
    const m = mapPayment(order());
    expect(m.eyebrow).toBe('ADVANCE DUE NOW · 30%');
    expect(m.advanceLabel).toBe('₹2,05,200');
    expect(m.totalLine).toContain('₹6,84,000');
    expect(m.ctaLabel).toBe('Pay ₹2,05,200 advance');
  });

  it('takes the advance as given rather than working it out', () => {
    // The server rounds; if this screen multiplied 30% itself the two could
    // differ by a rupee, and the button would name a figure Razorpay is not
    // being asked for.
    const m = mapPayment(order({ advanceAmount: 205201 }));
    expect(m.advanceLabel).toBe('₹2,05,201');
  });

  it('names the coupon that moved the total', () => {
    // A total below the quote the customer accepted has to explain itself.
    const m = mapPayment(order({ couponCode: 'FESTIVE10', couponDiscount: 20000 }));
    expect(m.couponLine).toBe('FESTIVE10 saved ₹20,000');
  });

  it('says nothing about a coupon when none was applied', () => {
    expect(mapPayment(order()).couponLine).toBe('');
    expect(mapPayment(order({ couponCode: 'X', couponDiscount: 0 })).couponLine).toBe('');
  });

  it('drops the balance clause when the advance is the whole price', () => {
    const m = mapPayment(order({ balanceAmount: 0 }));
    expect(m.totalLine).not.toContain('balance');
  });

  it('falls back to a neutral name rather than an empty sentence', () => {
    expect(mapPayment(order({ organizerName: '' })).organizerName).toBe('your organizer');
  });
});

describe('copy', () => {
  it('promises only the refund the code actually performs', () => {
    /*
     * There is no escrow: nothing holds the money. What does exist is
     * PaymentService.refundForBooking, fired when a booking is declined or
     * expires — so those are the only two things the screen may promise.
     */
    expect(PAYMENT_COPY.assurance).toContain('48 hours');
    expect(PAYMENT_COPY.assurance).toContain('refunded');
    expect(PAYMENT_COPY.assurance).not.toMatch(/held|escrow/i);
  });

  it('tells a customer who cancels that nothing was taken', () => {
    // Closing the sheet is not a failure and must not read like one.
    expect(PAYMENT_COPY.cancelled).toContain('Nothing has been charged');
    expect(PAYMENT_COPY.failed).toContain('Nothing has been charged');
  });

  it('offers the quote stays open for somebody not ready to pay', () => {
    expect(PAYMENT_COPY.talkFirstHint).toContain('stays open');
  });

  it('says what happens next rather than only that it is done', () => {
    expect(SUCCESS_COPY.body('Mahendra Events')).toContain('48 hours');
    expect(SUCCESS_COPY.body('Mahendra Events')).toContain('Mahendra Events');
  });
});

describe('methods', () => {
  it('offers the three Razorpay opens on, each a real method name', () => {
    // These are passed through as `prefill.method`, so a label here that is
    // not a Razorpay method would open the sheet on a menu instead.
    expect(PAY_OPTIONS.map((o) => o.id)).toEqual(['upi', 'card', 'netbanking']);
  });
});

describe('render dump', () => {
  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) return;

    const m = mapPayment(order());

    const payment = (
      <View style={s.container}>
        <View style={s.header}>
          <View style={s.back}>
            <EventlyIcon name="chevron-left" size={24} color="#0e1a33" />
          </View>
          <EventlyText variant="h1" style={s.title}>
            {PAYMENT_COPY.title}
          </EventlyText>
        </View>

        <View style={s.content}>
          <View style={s.amountCard}>
            <EventlyText variant="caption" style={s.eyebrow}>
              {m.eyebrow}
            </EventlyText>
            <EventlyText variant="h1" style={s.amount}>
              {m.advanceLabel}
            </EventlyText>
            <EventlyText variant="body" style={s.totalLine}>
              {m.totalLine}
            </EventlyText>
          </View>

          <EventlyText variant="h2" style={s.sectionTitle}>
            {PAYMENT_COPY.payWith}
          </EventlyText>
          {PAY_OPTIONS.map((option, index) => (
            <View key={option.id} style={[s.option, index === 0 && s.optionOn]}>
              <View style={s.optionIcon}>
                <EventlyIcon name={option.icon} size={20} color="#0e1a33" />
              </View>
              <View style={s.optionText}>
                <EventlyText variant="subtitle" style={s.optionLabel}>
                  {option.label}
                </EventlyText>
                <EventlyText variant="caption" style={s.optionHint}>
                  {option.hint}
                </EventlyText>
              </View>
              <View style={[s.radio, index === 0 && s.radioOn]}>
                {index === 0 ? <View style={s.radioDot} /> : null}
              </View>
            </View>
          ))}

          <View style={s.assurance}>
            <EventlyIcon name="shield-check-outline" size={18} color="#1d9e75" />
            <EventlyText variant="caption" style={s.assuranceText}>
              {PAYMENT_COPY.assurance}
            </EventlyText>
          </View>

          <View style={s.talk}>
            <EventlyIcon name="chat-outline" size={18} color="#e8633a" />
            <EventlyText variant="subtitle" style={s.talkText}>
              {PAYMENT_COPY.talkFirst}
            </EventlyText>
          </View>
          <EventlyText variant="caption" style={s.talkHint}>
            {PAYMENT_COPY.talkFirstHint}
          </EventlyText>
        </View>

        <View style={s.foot}>
          <View style={s.pay}>
            <EventlyText variant="subtitle" style={s.payText}>
              {m.ctaLabel}
            </EventlyText>
          </View>
        </View>
      </View>
    );

    const success = (
      <View style={successStyles.container}>
        <View style={successStyles.body}>
          <View style={successStyles.tick}>
            <EventlyIcon name="check" size={44} color="#1d9e75" />
          </View>
          <EventlyText variant="h1" style={successStyles.heading}>
            {SUCCESS_COPY.heading}
          </EventlyText>
          <EventlyText variant="body" style={successStyles.text}>
            {SUCCESS_COPY.body('Mahendra Events')}
          </EventlyText>
        </View>
        <View style={successStyles.foot}>
          <View style={successStyles.cta}>
            <EventlyText variant="subtitle" style={successStyles.ctaText}>
              {SUCCESS_COPY.cta}
            </EventlyText>
          </View>
        </View>
      </View>
    );

    const render = (node: React.ReactElement) => {
      let tree!: ReactTestRenderer.ReactTestRenderer;
      ReactTestRenderer.act(() => {
        tree = ReactTestRenderer.create(node);
      });
      return toHtml(tree.toJSON());
    };

    fs.writeFileSync(
      out,
      page(
        [
          ['Payment', render(payment)],
          ['Advance paid', render(success)],
        ],
        { title: 'Payment', width: 390, background: '#faf8f7', padding: 0 },
      ),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
