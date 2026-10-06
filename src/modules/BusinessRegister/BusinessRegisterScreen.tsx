import { useCallback, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyButton, EventlyText } from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { saveDefaultRole } from '../../services/defaultRole';
import {
  selectAuthRoles,
  selectAuthToken,
  selectEffectiveView,
  setActiveView,
} from '../../store/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { BusinessWebView, SUBVENDOR_ONBOARDING_PATH } from '../BusinessHome';
import { AUTH_COPY, REG_ACCENT, REGISTER_COPY, SIGNUP_COPY } from './constants';
import { useOrganizerSignup } from './container';
import { AuthGateSection } from './sections/AuthGateSection';
import { SignupDetailsSection } from './sections/SignupDetailsSection';
import { screenStyles as s } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'BusinessRegister'>;

/**
 * Registering a business, from "Register your business" or Profile.
 *
 *   1. Verify the mobile (skipped when already signed in) — the same OTP as
 *      customers, so a business joins the account the number already has.
 *   2. Organizer: five basic details on one screen, then straight into the
 *      dashboard. Services, portfolio, documents and bank details are its
 *      go-live checklist, done whenever the organizer is ready; verification
 *      happens after that, and is what lists them for customers. An account
 *      that is already an organizer skips the form.
 *      Sub-vendor: the web sign-up wizard, in place; finishing it opens the
 *      dashboard.
 *
 * Either way the business becomes the account's default, so from then on
 * signing in opens the dashboard rather than the customer app.
 *
 * Registered in every branch of the root stack: verifying the OTP, and then
 * the role becoming the active view, both swap the branch, and a route that
 * exists in both survives the swap with its state.
 */
export function BusinessRegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { role } = useRoute<Route>().params;
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectAuthToken);
  const roles = useAppSelector(selectAuthRoles);
  const view = useAppSelector(selectEffectiveView);
  const copy = AUTH_COPY[role];

  const openDashboard = useCallback(
    () => navigation.reset({ index: 0, routes: [{ name: 'BusinessHome' }] }),
    [navigation],
  );

  const organizer = useOrganizerSignup(role === 'organizer');

  // Registered: the dashboard and its go-live checklist take it from here.
  useEffect(() => {
    if (role === 'organizer' && organizer.done && view === 'organizer') openDashboard();
  }, [role, organizer.done, view, openDashboard]);

  // A number that is already a sub-vendor signs in rather than signs up.
  const isVendor = roles.includes('vendor');
  useEffect(() => {
    if (role !== 'subvendor' || !token || !isVendor || view === 'vendor') return;
    saveDefaultRole('vendor').catch(() => undefined);
    dispatch(setActiveView('vendor'));
  }, [role, token, isVendor, view, dispatch]);

  // Sub-vendor: once the account is in the sub-vendor view — already one, or
  // the web wizard just finished and handed over the new session — go home.
  useEffect(() => {
    if (role === 'subvendor' && view === 'vendor') openDashboard();
  }, [role, view, openDashboard]);

  if (!token) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        <AppHeader title={copy.header} />
        <AuthGateSection copy={copy} />
      </SafeAreaView>
    );
  }

  if (role === 'subvendor') {
    if (isVendor) return <Loading />;
    return (
      <SafeAreaView style={s.container} edges={['top', 'bottom']}>
        <AppHeader title={REGISTER_COPY.subvendorHeader} compact />
        <View style={s.web}>
          <BusinessWebView role="vendor" path={SUBVENDOR_ONBOARDING_PATH} />
        </View>
      </SafeAreaView>
    );
  }

  if (organizer.needsDetails && !organizer.done) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        <AppHeader title={SIGNUP_COPY.header} />
        <SignupDetailsSection
          config={organizer.config}
          configLoading={organizer.configLoading}
          configError={organizer.configError}
          onRetryConfig={organizer.retryConfig}
          submitting={organizer.submitting}
          error={organizer.error}
          onSubmit={organizer.submit}
        />
      </SafeAreaView>
    );
  }

  // A returning organizer being resumed.
  if (organizer.error) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        <AppHeader title={copy.header} />
        <View style={s.centerFill}>
          <EventlyText variant="body" style={s.centerText}>
            {organizer.error}
          </EventlyText>
          <EventlyButton
            title={REGISTER_COPY.retry}
            onPress={() => organizer.submit()}
            accentColor={REG_ACCENT}
          />
        </View>
      </SafeAreaView>
    );
  }

  return <Loading label={REGISTER_COPY.settingUp} />;
}

function Loading({ label }: { label?: string }) {
  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <View style={s.centerFill}>
        <ActivityIndicator size="large" color={REG_ACCENT} />
        {label ? (
          <EventlyText variant="body" style={s.centerText}>
            {label}
          </EventlyText>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

export default BusinessRegisterScreen;
