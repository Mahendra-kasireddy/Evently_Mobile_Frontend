import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { GuestSheet } from '../src/modules/GuestList/sections/GuestSheet';
import { GUEST_COPY } from '../src/modules/GuestList/constants';
import {
  eventDateParts,
  guestStats,
  localNumber,
  matchesQuery,
  toRow,
} from '../src/modules/GuestList/utils';
import type { GuestDTO } from '../src/modules/GuestList/types';

const guest = (over: Partial<GuestDTO> = {}): GuestDTO => ({
  id: 'g1',
  name: 'Sruthi Reddy',
  phone: '+919849011234',
  phoneDisplay: '+91 98490 11234',
  group: 'family',
  sharedSections: [],
  lastSharedAt: null,
  viewed: false,
  ...over,
});

describe('the redesigned guest list', () => {
  it('gives every guest a status: not sent, invited, opened', () => {
    expect(toRow(guest()).status).toBe('new');
    expect(toRow(guest({ lastSharedAt: '2026-10-01' })).status).toBe('invited');
    expect(
      toRow(guest({ lastSharedAt: '2026-10-01', viewed: true })).status,
    ).toBe('opened');
  });

  it('counts the list for the numbers card', () => {
    const list = [
      guest({ id: '1' }),
      guest({ id: '2', lastSharedAt: 'x' }),
      guest({ id: '3', lastSharedAt: 'x', viewed: true }),
    ];
    expect(guestStats(list)).toEqual({
      total: 3,
      invited: 2,
      opened: 1,
      notSent: 1,
    });
  });

  it('finds a guest by name, or by any spelling of their number', () => {
    const row = toRow(guest());
    expect(matchesQuery(row, 'sru')).toBe(true);
    expect(matchesQuery(row, '98490 11')).toBe(true);
    expect(matchesQuery(row, 'venkat')).toBe(false);
  });

  it('shows an event date as a person reads it, never as an ISO string', () => {
    expect(eventDateParts('2026-10-06')).toEqual({
      day: '6',
      month: 'OCT',
      line: 'Tue, 6 Oct 2026',
    });
    expect(eventDateParts('')).toBeNull();
    expect(eventDateParts('not a date')).toBeNull();
  });

  it('types the number beside a fixed +91', () => {
    expect(localNumber('+91 98490 11234')).toBe('98490 11234');
    expect(localNumber('9849011234')).toBe('9849011234');
  });
});

describe('the add sheet, redesigned', () => {
  const mounted: ReactTestRenderer.ReactTestRenderer[] = [];
  afterEach(() =>
    mounted.splice(0).forEach(t => ReactTestRenderer.act(() => t.unmount())),
  );

  it('offers "Save & add another", and keeps the sheet for the next guest', () => {
    const saved: Array<[string, boolean | undefined]> = [];
    let tree!: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <GuestSheet
          visible
          initial={null}
          isSaving={false}
          errorMessage={null}
          onSave={(d, another) => saved.push([d.name, another])}
          onClose={() => undefined}
        />,
      );
    });
    mounted.push(tree);
    const input = tree.root
      .findAll(n => n.props?.accessibilityLabel === GUEST_COPY.name)
      .at(-1);
    const phone = tree.root
      .findAll(n => n.props?.accessibilityLabel === GUEST_COPY.phone)
      .at(-1);
    ReactTestRenderer.act(() => {
      input?.props.onChangeText('Ravi');
      phone?.props.onChangeText('9849011234');
    });
    const another = tree.root
      .findAll(n => n.props?.accessibilityLabel === GUEST_COPY.saveAnother)
      .at(0);
    ReactTestRenderer.act(() => another?.props.onPress());
    expect(saved).toEqual([['Ravi', true]]);
  });

  it('has no "add another" when editing somebody', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <GuestSheet
          visible
          initial={toRow(guest()).draft}
          isSaving={false}
          errorMessage={null}
          onSave={() => undefined}
          onClose={() => undefined}
        />,
      );
    });
    mounted.push(tree);
    expect(
      tree.root.findAll(
        n => n.props?.accessibilityLabel === GUEST_COPY.saveAnother,
      ),
    ).toHaveLength(0);
  });
});
