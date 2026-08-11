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
