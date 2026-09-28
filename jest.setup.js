// Safe-area insets come from the native view; under Jest there is no native
// view, so `useSafeAreaInsets` throws rather than returning zeros. The
// library's own mock returns a plausible set of insets for every screen that
// reads them — Home's hero photograph pads itself with them.
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

/*
 * The web view's entry point resolves `lib/WebView` through Metro's platform
 * extensions (`.ios.js` / `.android.js`), which plain Jest does not do — so
 * importing it throws here even though it is installed and fine on a device.
 * The stub is a plain View carrying the same props, which is enough for the
 * live block to be rendered and read.
 */
jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    WebView: (props) => React.createElement(View, { ...props, testID: 'live-webview' }),
  };
});

// Native modules with no JS-side fallback under Jest's fake native environment.
jest.mock('react-native-permissions', () => require('react-native-permissions/mock'));

jest.mock('@react-native-community/geolocation', () => ({
  setRNConfiguration: jest.fn(),
  requestAuthorization: jest.fn(),
  getCurrentPosition: jest.fn((success) =>
    success({
      coords: { latitude: 0, longitude: 0, altitude: null, accuracy: 0, altitudeAccuracy: null, heading: null, speed: null },
      timestamp: 0,
    }),
  ),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
  stopObserving: jest.fn(),
}));

/*
 * Razorpay builds a NativeEventEmitter the moment it is imported, which throws
 * under Jest's fake native environment — so importing any screen that reaches
 * the checkout would fail the whole suite before a test ran.
 *
 * `open` resolves with the shape a real success has. Nothing in the app trusts
 * it: the server verifies the signature, so a test that stubs a payment is
 * still testing the client's half of the flow and nothing more.
 */
jest.mock('react-native-razorpay', () => ({
  __esModule: true,
  default: {
    open: jest.fn(() =>
      Promise.resolve({
        razorpay_order_id: 'order_TEST',
        razorpay_payment_id: 'pay_TEST',
        razorpay_signature: 'signature_TEST',
      }),
    ),
  },
}));
