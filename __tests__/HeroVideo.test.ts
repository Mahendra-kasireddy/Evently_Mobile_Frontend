import { canPlayVideo, videoHtml } from '../src/modules/Invitation/sections/HeroVideo';

describe('invitation video', () => {
  it('can play: the WebView the app already ships is the player', () => {
    expect(canPlayVideo).toBe(true);
  });

  it('plays the cover silent, looping and without controls', () => {
    const html = videoHtml('https://cdn.example/v.mp4', 'ambient', 'cover');
    expect(html).toMatch(/<video [^>]*\bmuted\b/);
    expect(html).toMatch(/<video [^>]*\bloop\b/);
    expect(html).toMatch(/<video [^>]*\bplaysinline\b/);
    expect(html).not.toMatch(/<video [^>]*\bcontrols\b/);
    expect(html).toContain('object-fit:cover');
  });

  it('plays full screen with sound and controls, fitted whole', () => {
    const html = videoHtml('https://cdn.example/v.mp4', 'player', 'contain');
    expect(html).toMatch(/<video [^>]*\bcontrols\b/);
    expect(html).not.toMatch(/<video [^>]*\bmuted\b/);
    expect(html).toContain('object-fit:contain');
  });

  it('cannot be broken out of by the URL', () => {
    const html = videoHtml('https://x/a.mp4"><script>alert(1)</script>', 'player', 'contain');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&quot;&gt;&lt;script&gt;');
  });
});
