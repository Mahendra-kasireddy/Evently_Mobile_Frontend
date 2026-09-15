/**
 * @format
 *
 * Why a picture does or does not appear.
 *
 * Every image in this app is a stored file reached over HTTP, and there are
 * only three ways one goes missing: the record carries no file, the URL is not
 * one React Native can fetch, or the platform refuses the request. The first
 * two are testable here. The third is iOS App Transport Security, which lives
 * in Info.plist and is asserted at the bottom.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  return function MockIcon({ name }: { name: string }) {
    return <Text>{` icon:${name}`}</Text>;
  };
});

import { Image } from 'react-native';
import { EventlyImage } from '../src/Components/EventlyImage';
import { absoluteFileUrl } from '../src/services/urls';

interface Stats {
  isDirectory(): boolean;
}
const fs: {
  readFileSync(p: string, enc: string): string;
  readdirSync(p: string): string[];
  statSync(p: string): Stats;
} = require('fs');
const path: { join(...parts: string[]): string } = require('path');
declare const __dirname: string;

const render = (node: React.ReactElement): ReactTestRenderer.ReactTestRenderer => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(node);
  });
  return tree;
};

/** How many real <Image> elements the component decided to mount. */
const images = (node: React.ReactElement): number => render(node).root.findAllByType(Image).length;

describe('absoluteFileUrl', () => {
  it('makes the local driver’s root-relative path fetchable', () => {
    /*
     * The backend's local storage driver returns "/api/upload/file/<key>". A
     * browser resolves that against the page it is on; React Native has no
     * page, so a relative URI simply fails.
     */
    expect(absoluteFileUrl('/api/upload/file/gallery/x.png')).toBe(
      'http://localhost:3000/api/upload/file/gallery/x.png',
    );
  });

  it('leaves an already-absolute URL alone', () => {
    // The S3 driver returns these, and double-prefixing would break them.
    expect(absoluteFileUrl('https://cdn.example.com/x.png')).toBe('https://cdn.example.com/x.png');
  });

  it('gives nothing back for nothing', () => {
    expect(absoluteFileUrl('')).toBe('');
    expect(absoluteFileUrl(null)).toBe('');
    expect(absoluteFileUrl(undefined)).toBe('');
  });
});

describe('EventlyImage', () => {
  it('treats an empty uri as no image, not a broken one', () => {
    /*
     * `{ uri: '' }` is an object and therefore truthy, so it used to reach
     * <Image>, fail to load, and paint the broken-image placeholder. A record
     * with no photo is not a record with a broken photo.
     */
    expect(images(<EventlyImage source={{ uri: '' }} />)).toBe(0);
    expect(images(<EventlyImage source={{ uri: '   ' }} />)).toBe(0);
  });

  it('still mounts an image for a real url', () => {
    expect(images(<EventlyImage source={{ uri: 'http://localhost:3000/a.png' }} />)).toBe(1);
  });

  it('mounts nothing when there is no source at all', () => {
    expect(images(<EventlyImage source={null} />)).toBe(0);
    expect(images(<EventlyImage source={undefined} />)).toBe(0);
  });
});

describe('every stored file is absolutised before it is rendered', () => {
  it('passes no raw .url straight into an image source', () => {
    /*
     * The bug this prevents is a quiet one: a screen renders `{ uri: file.url }`
     * with the server's root-relative path, and only that screen's pictures go
     * missing. Three onboarding surfaces had it while the rest of the app was
     * correct, so nothing looked systematically wrong.
     *
     * Locally-picked files (file:// or content:// from the image picker) are
     * already absolute, so they are exempt by name.
     */
    const LOCAL_PICKER = /picked|local|asset/i;

    const walk = (dir: string): string[] =>
      fs.readdirSync(dir).flatMap((entry: string) => {
        const full = path.join(dir, entry);
        return fs.statSync(full).isDirectory() ? walk(full) : [full];
      });

    const offenders: string[] = [];
    for (const file of walk(path.join(__dirname, '..', 'src')).filter((f) => f.endsWith('.tsx'))) {
      const text = fs.readFileSync(file, 'utf8');
      for (const m of text.matchAll(/source=\{\{\s*uri:\s*([A-Za-z][\w.?]*)\s*\}\}/g)) {
        const expression = m[1];
        if (expression.endsWith('.url') && !LOCAL_PICKER.test(expression)) {
          offenders.push(`${file.split('/src/')[1]}: ${m[0]}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});

describe('iOS will actually fetch them', () => {
  it('exempts the development host from App Transport Security', () => {
    /*
     * With NSAllowsArbitraryLoads false and no exception, iOS refuses cleartext
     * HTTP. React Native's own networking is exempt in a debug build, so the
     * API kept working and every screen filled with text — while <Image>, which
     * goes through NSURLSession, was refused for every photo.
     *
     * The symptom was a placeholder on every image in the app with nothing
     * wrong in the JavaScript, which is why it took so long to find.
     */
    const plist = fs.readFileSync(
      path.join(__dirname, '..', 'ios', 'Evently_Mobile_Frontend', 'Info.plist'),
      'utf8',
    );

    expect(plist).toContain('NSExceptionDomains');
    expect(plist).toContain('localhost');
    expect(plist).toContain('NSExceptionAllowsInsecureHTTPLoads');
  });

  it('does not open the app up to arbitrary cleartext', () => {
    // The exemption is loopback only; a release build must still refuse
    // cleartext to a real host.
    const plist = fs.readFileSync(
      path.join(__dirname, '..', 'ios', 'Evently_Mobile_Frontend', 'Info.plist'),
      'utf8',
    );

    expect(plist).toMatch(/<key>NSAllowsArbitraryLoads<\/key>\s*<false\/>/);
  });
});
