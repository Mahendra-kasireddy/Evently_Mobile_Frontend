import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectEffectiveView } from '../../store/authSlice';
import { useAppSelector } from '../../store/hooks';
import { brand } from '../../theme';
import { BUSINESS_HOME_PATH } from './constants';
import { BusinessWebView, resumeUrlFor } from './sections/BusinessWebView';
import { styles } from './styles';
import type { BusinessRole } from './types';

/**
 * The home of an organizer or sub-vendor account: the web dashboard, full
 * screen, in place of the customer tabs.
 *
 * The business product is built once, on the web, and rendered here rather
 * than rebuilt natively — the native organizer home this replaces had drifted
 * into a customer tab bar wearing an organizer's first tab. Which portal
 * opens follows the account's chosen view (its default role, switched from
 * Profile or from inside the dashboard).
 */
export function BusinessHomeScreen() {
  const view = useAppSelector(selectEffectiveView);
  const role: BusinessRole = view === 'vendor' ? 'vendor' : 'organizer';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={brand.surface} />
      {/* Keyed by portal: an account holding both business roles that
          switches between them starts the other portal from scratch. */}
      <BusinessPortal key={role} role={role} />
    </SafeAreaView>
  );
}

function BusinessPortal({ role }: { role: BusinessRole }) {
  // The dashboard itself, whatever stage the organizer is at: until they are
  // verified it leads with their go-live checklist.
  return <BusinessWebView role={role} path={resumeUrlFor(role) ?? BUSINESS_HOME_PATH[role]} />;
}

export default BusinessHomeScreen;
