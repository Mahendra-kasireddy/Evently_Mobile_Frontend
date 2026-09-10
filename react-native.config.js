/**
 * Native assets bundled with the app.
 *
 * Poppins is linked rather than fetched at runtime: a mobile app that waits on
 * a font download shows a frame of the system face first, and offline it never
 * gets the font at all. `npx react-native-asset` reads this file, copies the
 * files into android/app/src/main/assets/fonts and registers them in the iOS
 * project — so a fresh clone needs that command run once before a native build.
 */
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts'],
};
