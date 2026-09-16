import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyText } from '../../Components';
import { colors } from '../../theme';
import { getLocationTrace } from '../../services/location';
import { useLocationContainer } from './container';
import { LocationDetails } from './sections/LocationDetails';
import { LocationErrorState } from './sections/LocationErrorState';
import { styles } from './styles';

/**
 * DIAGNOSTIC — set back to false, and delete the block it guards, once the
 * fresh-install failure is understood.
 *
 * Deliberately a plain constant rather than __DEV__. The failure only appears
 * in release builds installed from an APK, which is exactly where __DEV__ is
 * false and console output goes nowhere a developer can read it — so a
 * diagnostic gated on __DEV__ is absent from the only build that fails.
 */
const SHOW_LOCATION_TRACE = true;

export function LocationScreen() {
  const { status, coordinates, place, errorCode, retry, openSettings } = useLocationContainer();

  /*
   * Read straight from the service rather than through the store.
   *
   * The trace is diagnostic, not state: putting it in the slice would mean an
   * action, a reducer and a selector that all have to be taken out again, and
   * would make this temporary block look like part of the design. Reading it
   * during render is safe here because every step that ends a read also changes
   * `status`, so the render that shows the outcome is the render that reads the
   * finished trace.
   */
  const trace = SHOW_LOCATION_TRACE ? getLocationTrace() : [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="Location" />

      {/*
        Rendered on what the screen has, not on what the read is doing.

        A position that is on screen stays on screen: a refresh that is refused
        indoors, or takes eight seconds to admit it has nothing, must not blank
        out the answer the customer was already looking at. So coordinates win
        over status, and the read only gets to speak for itself when there is
        nothing to show — which, once this device has ever had a fix, is only
        ever its very first run.
      */}
      {coordinates ? (
        <LocationDetails
          coordinates={coordinates}
          place={place}
          isRefreshing={status === 'loading'}
          onRefresh={retry}
        />
      ) : status === 'error' ? (
        <LocationErrorState errorCode={errorCode} onRetry={retry} onOpenSettings={openSettings} />
      ) : (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <EventlyText variant="body" style={styles.loadingText}>
            Getting your location…
          </EventlyText>
        </View>
      )}

      {/*
        DIAGNOSTIC — delete with SHOW_LOCATION_TRACE above.

        Shown in every state, including while the spinner is up, because the
        state it fails in is itself the thing in question. `status` is printed
        alongside the steps so a run that produces no steps at all — the read
        never started — is distinguishable from one whose steps all failed.
      */}
      {SHOW_LOCATION_TRACE ? (
        <View style={styles.trace}>
          <EventlyText variant="caption" style={styles.traceLine}>
            {`status=${status} coords=${coordinates ? 'yes' : 'no'} error=${errorCode ?? 'none'}`}
          </EventlyText>
          {trace.length === 0 ? (
            <EventlyText variant="caption" style={styles.traceLine}>
              (no read has started)
            </EventlyText>
          ) : (
            trace.map((line, index) => (
              <EventlyText key={`${index}-${line}`} variant="caption" style={styles.traceLine}>
                {line}
              </EventlyText>
            ))
          )}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

export default LocationScreen;
