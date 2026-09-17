/**
 * @format
 *
 * Signing in: a number, then the code texted to it.
 *
 * The rule every test here restates is that the screen never leaves a person
 * guessing what it wants, and never lets a value reach the API that the API
 * would reject. The CTA says what is still missing, the cells show which one
 * the next keystroke fills, and whatever a paste or an autofill delivers is
 * reduced to digits before it is stored.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  return function MockIcon({ name }: { name: string }) {
    return <Text>{` icon:${name}`}</Text>;
  };
});

import { page, toHtml } from '../test-utils/rn-to-html';
import { AuthCta } from '../src/modules/Login/sections/AuthCta';
import { OtpEntry } from '../src/modules/Login/sections/OtpEntry';
import { PhoneEntry } from '../src/modules/Login/sections/PhoneEntry';
import {
  MOBILE_LENGTH,
  OTP_COPY,
  OTP_LENGTH,
  PHONE_COPY,
} from '../src/modules/Login/constants';
import {
  activeOtpIndex,
  formatCooldown,
  formatMobile,
  formatSentTo,
  otpDigits,
  sanitizeDigits,
} from '../src/modules/Login/utils';
import { RoleCard } from '../src/modules/Join/sections/RoleCard';
import { JOIN_COPY, ROLE_CARDS } from '../src/modules/Join/constants';

declare const process: { env: Record<string, string | undefined> };
const fs: {
  writeFileSync(p: string, d: string, e: string): void;
  existsSync(p: string): boolean;
} = require('fs');

/** Rendering has to happen inside act(), the same way every other suite here does it. */
function render(node: React.ReactElement): ReactTestRenderer.ReactTestRenderer {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(node);
  });
  return tree;
}

/** Every string the tree actually renders, so a test can assert on what a person reads. */
function textOf(tree: ReactTestRenderer.ReactTestRenderer): string {
  const out: string[] = [];
  const walk = (node: unknown): void => {
    if (node == null) return;
    if (typeof node === 'string') {
      out.push(node);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    walk((node as { children?: unknown }).children);
  };
  walk(tree.toJSON());
  return out.join(' ');
}

/**
 * The Pressable behind a testID.
 *
 * Matching on `onPress` alone is not enough: a wrapper component that takes an
 * `onPress` prop and forwards it carries both the id and a function, and a
 * test that grabs the wrapper passes without the button ever being involved.
 * The accessibility role is what only the real control has.
 */
const pressableFor = (
  tree: ReactTestRenderer.ReactTestRenderer,
  testID: string,
) =>
  tree.root.findAll(
    node =>
      node.props?.testID === testID &&
      node.props?.accessibilityRole === 'button',
    {
      deep: true,
    },
  )[0];

/** A field's props — what it displays and what it reports back. */
const inputFor = (tree: ReactTestRenderer.ReactTestRenderer, testID: string) =>
  tree.root.findAll(
    node =>
      node.props?.testID === testID &&
      typeof node.props?.onChangeText === 'function',
    {
      deep: true,
    },
  )[0];

describe('what may reach the API', () => {
  it('reduces whatever the field delivers to digits', () => {
    // An SMS autofill hands over the message, and a paste hands over whatever
    // was copied. MOBILE_PATTERN and OTP_CODE_PATTERN accept neither.
    expect(sanitizeDigits('Your code is 445 912', OTP_LENGTH)).toBe('445912');
    expect(sanitizeDigits('+91 98490 12345', MOBILE_LENGTH)).toBe('9198490123');
  });

  it('never exceeds the length the backend validates', () => {
    // A field that can hold eleven digits is a field that can only fail
    // server-side, after a round trip.
    expect(sanitizeDigits('9'.repeat(20), MOBILE_LENGTH)).toHaveLength(
      MOBILE_LENGTH,
    );
    expect(sanitizeDigits('123456789', OTP_LENGTH)).toHaveLength(OTP_LENGTH);
  });
});

describe('what the screen shows back', () => {
  it('groups a number the way it is read aloud', () => {
    expect(formatMobile('9849012345')).toBe('98490 12345');
    expect(formatMobile('98490')).toBe('98490');
    expect(formatMobile('984')).toBe('984');
  });

  it('survives a backspace over the grouping space', () => {
    // The field shows "98490 12345"; deleting one character takes the space
    // with it, and stripping is what turns that back into nine digits rather
    // than eight.
    expect(formatMobile(sanitizeDigits('98490 1234', MOBILE_LENGTH))).toBe(
      '98490 1234',
    );
  });

  it('shows the number the server says it texted, not the one typed', () => {
    // A stub or staging backend can rewrite the destination. Showing the typed
    // number when the code went elsewhere is an unfixable support ticket.
    expect(formatSentTo('+919000000001', '9849012345')).toBe('+91 90000 00001');
    expect(formatSentTo(null, '9849012345')).toBe('+91 98490 12345');
    expect(formatSentTo('   ', '9849012345')).toBe('+91 98490 12345');
  });

  it('pads the cooldown so it never reads 0:7', () => {
    expect(formatCooldown(7)).toBe('0:07');
    expect(formatCooldown(30)).toBe('0:30');
    expect(formatCooldown(-1)).toBe('0:00');
  });

  it('points at the cell the next keystroke fills, and stops at the last one', () => {
    // There is no visible caret in a six-box field, so this index is the caret.
    expect(activeOtpIndex('')).toBe(0);
    expect(activeOtpIndex('445')).toBe(3);
    expect(activeOtpIndex('445912')).toBe(OTP_LENGTH - 1);
    expect(otpDigits('445')).toEqual(['4', '4', '5', '', '', '']);
  });
});

describe('the number field', () => {
  const renderPhone = (phone: string, onChangePhone = jest.fn()) =>
    render(
      <PhoneEntry
        phone={phone}
        dialCode="+91"
        onChangePhone={onChangePhone}
        onChangeDialCode={jest.fn()}
      />,
    );

  it('asks the OS for the phone keypad', () => {
    // The person's own keyboard, with their own paste and autofill — not a
    // pad this app has to reimplement.
    expect(inputFor(renderPhone(''), 'phone-input').props.keyboardType).toBe(
      'number-pad',
    );
  });

  it('shows the placeholder until a digit is entered', () => {
    const input = inputFor(renderPhone(''), 'phone-input').props;
    expect(input.value).toBe('');
    expect(input.placeholder).toBe(PHONE_COPY.placeholder);
  });

  it('shows the grouped number once there is one', () => {
    expect(inputFor(renderPhone('9849012345'), 'phone-input').props.value).toBe(
      '98490 12345',
    );
  });

  it('stores digits, whatever was typed or pasted', () => {
    const onChangePhone = jest.fn();
    const tree = renderPhone('', onChangePhone);
    ReactTestRenderer.act(() =>
      inputFor(tree, 'phone-input').props.onChangeText('+91 98490 12345'),
    );
    expect(onChangePhone).toHaveBeenCalledWith('9198490123');
  });

  it('leaves room for the space the grouping adds', () => {
    // maxLength counts what is displayed, and the displayed value is eleven
    // characters once the group separator is in it.
    expect(inputFor(renderPhone(''), 'phone-input').props.maxLength).toBe(
      MOBILE_LENGTH + 1,
    );
  });
});

describe('the call to action', () => {
  it('says what is missing rather than going grey', () => {
    // A faded accent button still looks pressable; people tap it and conclude
    // the app is broken. The inert state names the requirement instead.
    const tree = render(
      <AuthCta
        idleLabel={PHONE_COPY.ctaIdle}
        readyLabel={PHONE_COPY.ctaReady}
        ready={false}
        loading={false}
        onPress={jest.fn()}
        testID="cta"
      />,
    );

    expect(textOf(tree)).toContain(`Enter ${MOBILE_LENGTH} digits`);
    expect(pressableFor(tree, 'cta').props.accessibilityState.disabled).toBe(
      true,
    );
  });

  it('acts only once the field is complete', () => {
    const onPress = jest.fn();
    const tree = render(
      <AuthCta
        idleLabel={PHONE_COPY.ctaIdle}
        readyLabel={PHONE_COPY.ctaReady}
        ready
        loading={false}
        onPress={onPress}
        testID="cta"
      />,
    );

    expect(textOf(tree)).toContain(PHONE_COPY.ctaReady);
    ReactTestRenderer.act(() => pressableFor(tree, 'cta').props.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('the code step', () => {
  const renderOtp = (
    over: Partial<React.ComponentProps<typeof OtpEntry>> = {},
  ) =>
    render(
      <OtpEntry
        code=""
        onChangeCode={jest.fn()}
        onResend={jest.fn()}
        canResend
        resendSeconds={0}
        devCode={null}
        {...over}
      />,
    );

  it('is one field behind six cells', () => {
    // Six one-character inputs would have to reimplement paste, autofill and
    // backspace-across-cells, and get all three subtly wrong.
    const input = inputFor(renderOtp(), 'otp-input').props;
    expect(input.maxLength).toBe(OTP_LENGTH);
    expect(input.keyboardType).toBe('number-pad');
  });

  it('accepts the code out of an autofilled SMS', () => {
    const onChangeCode = jest.fn();
    const tree = renderOtp({ onChangeCode });
    ReactTestRenderer.act(() =>
      inputFor(tree, 'otp-input').props.onChangeText('445912'),
    );
    expect(onChangeCode).toHaveBeenCalledWith('445912');
  });

  it('warns against sharing the code, on the screen where it is asked for', () => {
    const {
      OtpSafetyNote,
    } = require('../src/modules/Login/sections/OtpSafetyNote');
    expect(textOf(render(<OtpSafetyNote />))).toContain(OTP_COPY.safetyNote);
  });

  it('shows the digits entered so far and nothing more', () => {
    const text = textOf(renderOtp({ code: '445' }));
    expect(text).toContain('4');
    expect(text).toContain('5');
  });

  it('offers a resend only after the cooldown, and shows the wait meanwhile', () => {
    const onResend = jest.fn();
    const waiting = renderOtp({ canResend: false, resendSeconds: 7, onResend });
    expect(textOf(waiting)).toContain('0:07');
    expect(
      pressableFor(waiting, 'otp-resend-sms').props.accessibilityState.disabled,
    ).toBe(true);

    const ready = renderOtp({ canResend: true, resendSeconds: 0, onResend });
    expect(textOf(ready)).toContain(OTP_COPY.retryChannel);
    ReactTestRenderer.act(() =>
      pressableFor(ready, 'otp-resend-sms').props.onPress(),
    );
    expect(onResend).toHaveBeenCalledTimes(1);
  });

  it('shows the dev code only when the backend supplies one', () => {
    expect(textOf(renderOtp())).not.toContain('Dev code');
    expect(textOf(renderOtp({ devCode: '445912' }))).toContain('Dev code');
  });
});

describe('registering a business profile', () => {
  it('separates the customer path from the business one, in words', () => {
    // The customer app has no sign-up, so people arrive here looking for one.
    expect(JOIN_COPY.subtitle).toContain('same number');
  });

  it('states the document requirement on each role, not only in the footnote', () => {
    // People tap before they read to the end of a screen.
    expect(ROLE_CARDS.every(role => role.requirement.length > 0)).toBe(true);
  });

  it('reports which role was chosen', () => {
    const onPress = jest.fn();
    const organizer = ROLE_CARDS[0];
    const tree = render(<RoleCard data={organizer} onPress={onPress} />);

    expect(textOf(tree)).toContain(organizer.title);
    ReactTestRenderer.act(() =>
      pressableFor(tree, `role-card-${organizer.key}`).props.onPress(),
    );
    expect(onPress).toHaveBeenCalledWith(organizer.key);
  });
});

/*
 * A picture of the finished screens, built from their own resolved styles.
 *
 * This is how the layout gets reviewed without a simulator: run
 * `EVENTLY_RENDER_OUT=… npx jest Auth` and open the file. It is skipped in a
 * normal run, so CI never depends on it.
 */
describe('render dump', () => {
  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out: string | undefined = process.env.EVENTLY_RENDER_OUT;
    if (!out) return;

    const { View } = require('react-native');
    const { AuthHero } = require('../src/modules/Login/sections/AuthHero');
    const {
      BusinessEntryCard,
    } = require('../src/modules/Login/sections/BusinessEntryCard');
    const { TermsNote } = require('../src/modules/Login/sections/TermsNote');
    const { OtpHeader } = require('../src/modules/Login/sections/OtpHeader');
    const {
      OtpSafetyNote,
    } = require('../src/modules/Login/sections/OtpSafetyNote');
    const {
      RequirementNote,
    } = require('../src/modules/Join/sections/RequirementNote');
    const { EventlyText } = require('../src/Components/EventlyText');
    const { styles: loginStyles } = require('../src/modules/Login/styles');
    const { styles: joinStyles } = require('../src/modules/Join/styles');
    const { brand } = require('../src/theme');

    const noop = () => {};
    const screen = {
      backgroundColor: brand.bg,
      minHeight: 844,
      display: 'flex' as const,
    };

    const signIn = (filled: boolean) => (
      <View style={screen}>
        <AuthHero topInset={44} />
        <View style={loginStyles.content}>
          <PhoneEntry
            phone={filled ? '9849012345' : ''}
            dialCode="+91"
            onChangePhone={noop}
            onChangeDialCode={noop}
          />
          <AuthCta
            idleLabel={PHONE_COPY.ctaIdle}
            readyLabel={PHONE_COPY.ctaReady}
            ready={filled}
            loading={false}
            onPress={noop}
          />
          <View style={loginStyles.spacer} />
          <View style={loginStyles.footer}>
            <BusinessEntryCard onPress={noop} />
            <TermsNote />
          </View>
        </View>
      </View>
    );

    const verify = (
      <View style={screen}>
        <OtpHeader sentTo="+91 98490 12345" onBack={noop} topInset={44} />
        <View style={loginStyles.content}>
          <OtpEntry
            code="4459"
            onChangeCode={noop}
            onResend={noop}
            canResend
            resendSeconds={0}
            devCode={null}
          />
          <AuthCta
            idleLabel={OTP_COPY.ctaIdle}
            readyLabel={OTP_COPY.ctaReady}
            ready={false}
            loading={false}
            onPress={noop}
          />
          <View style={loginStyles.spacer} />
          <View style={loginStyles.footer}>
            <OtpSafetyNote />
          </View>
        </View>
      </View>
    );

    const register = (
      <View style={screen}>
        <View style={[joinStyles.header, { paddingTop: 52 }]}>
          <View style={joinStyles.glow} />
          <View style={joinStyles.closeButton} />
          <EventlyText style={joinStyles.title} variant="h1">
            {JOIN_COPY.title}
          </EventlyText>
          <EventlyText style={joinStyles.subtitle} variant="caption">
            {JOIN_COPY.subtitle}
          </EventlyText>
        </View>
        <View style={joinStyles.content}>
          {ROLE_CARDS.map(role => (
            <RoleCard key={role.key} data={role} onPress={noop} />
          ))}
          <RequirementNote />
        </View>
      </View>
    );

    const panels: Array<[string, string]> = [
      ['Sign in — empty', toHtml(render(signIn(false)).toJSON())],
      ['Sign in — ten digits entered', toHtml(render(signIn(true)).toJSON())],
      ['Verify number', toHtml(render(verify).toJSON())],
      ['Register a business profile', toHtml(render(register).toJSON())],
    ];

    fs.writeFileSync(
      out,
      page(panels, {
        title: 'Auth',
        width: 390,
        background: brand.bg,
        padding: 0,
      }),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
