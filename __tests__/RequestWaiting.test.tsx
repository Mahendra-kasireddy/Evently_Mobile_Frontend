import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { RequestWaiting } from '../src/modules/CompareQuotes/sections/RequestWaiting';
import {
  guestsLabel,
  mapCompare,
  prettyDate,
} from '../src/modules/CompareQuotes/utils';

const textOf = (tree: ReactTestRenderer.ReactTestRenderer) =>
  tree.root
    .findAll(n => (n.type as unknown) === 'Text')
    .map(n =>
      Array.isArray(n.props.children)
        ? n.props.children.join('')
        : n.props.children,
    )
    .join(' | ');

const model = mapCompare(
  {
    id: 'r1',
    occasion: 'Birthday',
    when: '2026-10-09',
    where: 'Hyderabad',
    guests: '100',
    status: 'open',
    quotations: [],
    sentToCount: 2,
    awaiting: [
      {
        id: 'o1',
        name: 'MAHENDRA EVENTS',
        initials: '',
        avatarColor: '#7c5bd6',
        tier: '',
        rating: 0,
      },
      {
        id: 'o2',
        name: 'Mad Events',
        initials: 'ME',
        avatarColor: '#7c5bd6',
        tier: 'Gold',
        rating: 4.6,
      },
    ],
  },
  'Birthday',
);

const mounted: ReactTestRenderer.ReactTestRenderer[] = [];
afterEach(() => {
  mounted.splice(0).forEach(t => ReactTestRenderer.act(() => t.unmount()));
});
const render = (justSent: boolean) => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <RequestWaiting
        model={model}
        justSent={justSent}
        onHome={() => undefined}
      />,
    );
  });
  mounted.push(tree);
  return tree;
};

describe('a request with no quotes yet', () => {
  it('reads dates and guests like a person would', () => {
    expect(prettyDate('2026-10-09')).toBe('Fri, 9 Oct 2026');
    expect(prettyDate('next spring')).toBe('next spring');
    expect(guestsLabel('100')).toBe('100 guests');
    expect(guestsLabel('500+')).toBe('500+ guests');
  });

  it('heads the screen "Your request", not "Compare quotes"', () => {
    expect(model.heading).toBe('Your request');
  });

  it('just sent: confirms, shows the brief, and what happens next', () => {
    const text = textOf(render(true));
    expect(text).toContain('Request sent!');
    expect(text).toContain('Hyderabad');
    expect(text).toContain('100 guests');
    expect(text).toContain('Quotes arrive');
    expect(text).not.toContain('2026-10-09');
  });

  it('names who it was sent to, with initials even when the server sent none', () => {
    const text = textOf(render(true));
    expect(text).toContain('Sent to 2 organizers');
    expect(text).toContain('MAHENDRA EVENTS');
    expect(text).toContain('★ 4.6 · Gold');
    expect(model.awaiting[0].initials).toBe('ME');
  });

  it('opened later: says it is still waiting', () => {
    expect(textOf(render(false))).toContain('Waiting for quotes');
  });
});
