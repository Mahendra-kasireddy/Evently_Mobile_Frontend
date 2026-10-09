import { metaballPath } from '../src/navigation/GooeyBubbles';

describe('the liquid neck between the + and a bubble', () => {
  const fab = { x: 200, y: 600 };

  it('joins them while the bubble is close', () => {
    const d = metaballPath(fab, 26, { x: 200, y: 540 }, 29);
    expect(d).toMatch(/^M [\d.-]+ [\d.-]+ C /);
    expect(d).not.toContain('NaN');
  });

  it('snaps once the bubble has pulled far enough away', () => {
    expect(metaballPath(fab, 26, { x: 200, y: 440 }, 29)).toBeNull();
  });

  it('draws nothing while one circle sits inside the other', () => {
    expect(metaballPath(fab, 26, { x: 200, y: 600 }, 13)).toBeNull();
  });
});
