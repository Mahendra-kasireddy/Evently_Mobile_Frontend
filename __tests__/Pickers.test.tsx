/**
 * @format
 *
 * The four fields of Home's "tell us the basics" card.
 *
 * Each one used to open the same sheet of chips, which meant a date was a row
 * of words ("This weekend") rather than a date, and a city the platform had
 * not listed could not be entered at all. These are about the two things that
 * replaced it: a search screen that accepts what the customer typed, and
 * sheets that speak in the units of what they are asking for.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  return function MockIcon({ name }: { name: string }) {
    return <Text>{` icon:${name}`}</Text>;
  };
});

const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack, navigate: jest.fn() }),
}));

const mockRecents = jest.fn();
const mockRemember = jest.fn();
const mockForget = jest.fn();
jest.mock('../src/modules/Pickers/hooks', () => ({
  useRecents: () => ({
    recents: mockRecents(),
    remember: mockRemember,
    forget: mockForget,
  }),
}));

import { PickerScreen } from '../src/modules/Pickers/PickerScreen';
import { GuestsSheet } from '../src/modules/Pickers/sections/GuestsSheet';
import {
  PICKER_COPY,
  USE_TYPED_AREA_PREFIX,
} from '../src/modules/Pickers/constants';
import heroDraftReducer, {
  seedHeroDraft,
  setHeroDraftField,
  type HeroDraftState,
} from '../src/store/heroDraftSlice';
import { todayIso } from '../src/Components/CalendarSheet';

const CITIES = [
  { label: 'Bengaluru', value: 'Bengaluru' },
  { label: 'Hyderabad', value: 'Hyderabad' },
  { label: 'Chennai', value: 'Chennai' },
];

function render(node: React.ReactElement): ReactTestRenderer.ReactTestRenderer {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(node);
  });
  return tree;
}

function textOf(tree: ReactTestRenderer.ReactTestRenderer): string {
  const out: string[] = [];
  const walk = (n: unknown): void => {
    if (n == null) return;
    if (typeof n === 'string') {
      if (!n.startsWith(' icon:')) out.push(n);
      return;
    }
    if (Array.isArray(n)) return n.forEach(walk);
    walk((n as { children?: unknown }).children);
  };
  walk(tree.toJSON());
  return out.join(' | ');
}

const controlFor = (
  tree: ReactTestRenderer.ReactTestRenderer,
  testID: string,
) =>
  tree.root.findAll(
    node =>
      node.props?.testID === testID &&
      node.props?.accessibilityRole === 'button',
    { deep: true },
  )[0];

const inputFor = (tree: ReactTestRenderer.ReactTestRenderer, testID: string) =>
  tree.root.findAll(
    node =>
      node.props?.testID === testID &&
      typeof node.props?.onChangeText === 'function',
    { deep: true },
  )[0];

const type = (
  tree: ReactTestRenderer.ReactTestRenderer,
  testID: string,
  text: string,
) =>
  ReactTestRenderer.act(() => inputFor(tree, testID).props.onChangeText(text));

beforeEach(() => {
  jest.clearAllMocks();
  mockRecents.mockReturnValue([]);
});

describe('the search screen', () => {
  const area = (
    over: Partial<React.ComponentProps<typeof PickerScreen>> = {},
  ) =>
    render(
      <PickerScreen
        kind="area"
        options={CITIES}
        selected=""
        onPick={jest.fn()}
        allowTyped={query => ({
          label: `${USE_TYPED_AREA_PREFIX} “${query}”`,
          value: query,
          rememberAs: query,
        })}
        {...over}
      />,
    );

  it('lists what the platform offers before anything is typed', () => {
    expect(textOf(area())).toContain('Hyderabad');
  });

  it('narrows to what matches', () => {
    const tree = area();
    type(tree, 'picker-search', 'chen');
    const text = textOf(tree);
    expect(text).toContain('Chennai');
    expect(text).not.toContain('Bengaluru');
  });

  it('offers to use an area the platform has never heard of', () => {
    /*
     * The reason the area picker is not list-only. "Patrika Nagar" is a real
     * place a real event happens in, and a picker that refuses it sends the
     * customer back to a city that is not where their event is.
     */
    const tree = area();
    type(tree, 'picker-search', 'Patrika Nagar');
    expect(textOf(tree)).toContain('Patrika Nagar');
    expect(controlFor(tree, 'picker-row-Patrika Nagar')).toBeDefined();
  });

  it('does not offer to "use" something already in the list', () => {
    // Two ways to pick Hyderabad, stacked on each other, is one too many.
    const tree = area();
    type(tree, 'picker-search', 'Hyderabad');
    expect(textOf(tree)).not.toContain(USE_TYPED_AREA_PREFIX);
  });

  it('remembers the place, not the prompt that offered it', () => {
    // The row reads `Use “Patrika Nagar”`; the recents list must not.
    const tree = area();
    type(tree, 'picker-search', 'Patrika Nagar');
    ReactTestRenderer.act(() =>
      controlFor(tree, 'picker-row-Patrika Nagar').props.onPress(),
    );
    expect(mockRemember).toHaveBeenCalledWith('Patrika Nagar', 'Patrika Nagar');
  });

  it('reports the pick and closes', () => {
    const onPick = jest.fn();
    const tree = area({ onPick });
    ReactTestRenderer.act(() =>
      controlFor(tree, 'picker-row-Hyderabad').props.onPress(),
    );

    expect(onPick).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'Hyderabad' }),
    );
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('shows recent picks when the field is empty', () => {
    mockRecents.mockReturnValue([
      { id: 'r1', kind: 'area', label: 'Kukatpally', value: 'Kukatpally' },
    ]);
    const text = textOf(area());
    expect(text).toContain(PICKER_COPY.recentsHeading);
    expect(text).toContain('Kukatpally');
  });

  it('hides them once someone starts typing', () => {
    // Somebody typing has a place in mind; where they have been is in the way.
    mockRecents.mockReturnValue([
      { id: 'r1', kind: 'area', label: 'Kukatpally', value: 'Kukatpally' },
    ]);
    const tree = area();
    type(tree, 'picker-search', 'chen');
    expect(textOf(tree)).not.toContain(PICKER_COPY.recentsHeading);
  });

  it('is list-only when no typed answer is allowed', () => {
    // An occasion is matched against organizers' service categories, so one
    // the platform does not know would match nobody.
    const tree = render(
      <PickerScreen
        kind="occasion"
        options={CITIES}
        selected=""
        onPick={jest.fn()}
      />,
    );
    type(tree, 'picker-search', 'Sangeet');
    expect(textOf(tree)).not.toContain(USE_TYPED_AREA_PREFIX);
  });
});

describe('the guests sheet', () => {
  const sheet = (
    over: Partial<React.ComponentProps<typeof GuestsSheet>> = {},
  ) =>
    render(
      <GuestsSheet
        visible
        value="100"
        options={['50', '100', '200']}
        onSelect={jest.fn()}
        onClose={jest.fn()}
        {...over}
      />,
    );

  it('offers the presets the server sent', () => {
    expect(textOf(sheet())).toContain('200');
  });

  it('takes a number that is not one of them', () => {
    // Someone who already knows their headcount should not have to find the
    // nearest chip to it.
    const onSelect = jest.fn();
    const tree = sheet({ onSelect });
    type(tree, 'guests-custom', '275');
    ReactTestRenderer.act(() =>
      controlFor(tree, 'guests-done').props.onPress(),
    );
    expect(onSelect).toHaveBeenCalledWith('275');
  });

  it('keeps the custom field to digits', () => {
    const tree = sheet();
    type(tree, 'guests-custom', '2a7!5');
    expect(inputFor(tree, 'guests-custom').props.value).toBe('275');
  });

  it('will not apply an empty field', () => {
    expect(
      controlFor(sheet(), 'guests-done').props.accessibilityState.disabled,
    ).toBe(true);
  });
});

describe('the draft the card is assembling', () => {
  const initial = (): HeroDraftState =>
    heroDraftReducer(undefined, { type: '@@INIT' });

  it('opens answerable rather than blank', () => {
    // Today and a hundred guests, so two of the four rows are already true.
    const seeded = heroDraftReducer(
      initial(),
      seedHeroDraft({ when: todayIso(), guests: '100' }),
    );
    expect(seeded.when).toBe(todayIso());
    expect(seeded.guests).toBe('100');
  });

  it('does not reset what the customer chose when the feed arrives again', () => {
    /*
     * The feed is refetched on focus and after a submit. Seeding twice would
     * mean a refresh silently putting their date back to today.
     */
    const seeded = heroDraftReducer(
      initial(),
      seedHeroDraft({ when: todayIso() }),
    );
    const chosen = heroDraftReducer(
      seeded,
      setHeroDraftField({ field: 'when', value: '2026-12-25' }),
    );
    const again = heroDraftReducer(chosen, seedHeroDraft({ when: todayIso() }));

    expect(again.when).toBe('2026-12-25');
  });

  it('records a pick made on another screen', () => {
    // The whole reason the draft is in the store: the area picker is its own
    // screen and cannot hand an answer back through props.
    const next = heroDraftReducer(
      initial(),
      setHeroDraftField({ field: 'where', value: 'Patrika Nagar' }),
    );
    expect(next.where).toBe('Patrika Nagar');
  });
});
