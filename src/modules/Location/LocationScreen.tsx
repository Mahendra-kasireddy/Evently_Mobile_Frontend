import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyText } from '../../Components';
import { colors } from '../../theme';
import { useLocationContainer } from './container';
import { LocationDetails } from './sections/LocationDetails';
import { LocationErrorState } from './sections/LocationErrorState';
import { styles } from './styles';

export function LocationScreen() {
  const { status, coordinates, place, trace, errorCode, retry, openSettings } =
    useLocationContainer();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="Location" />

      {/*
        'idle' is a real on-screen state, not just an internal starting value:
        the read is kicked off by an effect, so the first paint of this screen
        happens before it. Grouping it with 'loading' is what it looks like to
        the customer — the location is on its way — and, more to the point,
        leaving it out renders a blank screen under the header with no way
        forward if the read never starts.
      */}
      {(status === 'idle' || status === 'loading') && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <EventlyText variant="body" style={styles.loadingText}>
            Getting your location…
          </EventlyText>
        </View>
      )}

      {status === 'success' && coordinates && <LocationDetails coordinates={coordinates} place={place} onRefresh={retry} />}

      {/*
        Success without coordinates cannot happen through the slice, which sets
        them together — but it is the one combination that would render nothing
        at all, so it falls back to the error state rather than a blank screen.
      */}
      {((status === 'success' && !coordinates) || status === 'error') && (
        <LocationErrorState errorCode={errorCode} onRetry={retry} onOpenSettings={openSettings} />
      )}

      {/*
        DIAGNOSTIC — delete this block, `trace` in the slice, and getLocationTrace
        once the Android read is understood.

        Every way this screen can fail looks identical from outside: no position.
        A release build forwards no console output anywhere readable, and the
        device under test is not always on a USB cable, so the screen is the only
        channel that reaches a developer. Shown in every state, because the state
        it fails in is itself the thing in question.
      */}
      {trace.length > 0 ? (
        <View style={styles.trace}>
          {trace.map((line, index) => (
            <EventlyText key={`${index}-${line}`} variant="caption" style={styles.traceLine}>
              {line}
            </EventlyText>
          ))}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

export default LocationScreen;
