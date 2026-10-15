import { Dimensions, StyleSheet } from 'react-native';
import { SPLASH_BG, SPLASH_INK } from './constants';

const { width } = Dimensions.get('window');
// The photo is 3:2; shown edge to edge at full width.
const ART_HEIGHT = Math.round(width / 1.5);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SPLASH_BG,
  },
  brand: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  logoWrap: {
    shadowColor: '#e8436f',
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    borderRadius: 30,
  },
  logo: { width: 120, height: 120 },
  wordRow: { marginTop: 18 },
  wordmark: {
    color: SPLASH_INK,
    fontWeight: '800',
    fontSize: 50,
    lineHeight: 60,
    letterSpacing: -0.5,
  },
  sparks: { position: 'absolute', top: 0, right: -26, width: 30, height: 34 },
  spark1: { position: 'absolute', top: 2, left: 6 },
  spark2: { position: 'absolute', top: 18, left: 18 },
  spark3: { position: 'absolute', top: 0, left: 22 },
  tagline: {
    marginTop: 6,
    color: SPLASH_INK,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  artWrap: { width: '100%', height: ART_HEIGHT },
  art: { width: '100%', height: '100%' },
  artFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
  },
});
