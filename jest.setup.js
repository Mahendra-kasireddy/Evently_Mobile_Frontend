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
