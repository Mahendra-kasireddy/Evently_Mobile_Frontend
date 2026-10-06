import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyButton, EventlyIcon, EventlyText } from '../../Components';
import { selectAuthToken } from '../../store/authSlice';
import { useAppSelector } from '../../store/hooks';
import { useOrganizerOnboarding } from './container';
import { ONB_COPY, ORG_ACCENT, ORG_DANGER, ORG_GREEN_DARK } from './constants';
import { useOnboardingConfig, useServicesConfig } from './hooks';
import { AuthGateSection } from './sections/AuthGateSection';
import { StepBank } from './sections/StepBank';
import { StepBasic } from './sections/StepBasic';
import { StepPortfolio } from './sections/StepPortfolio';
import { StepProgress } from './sections/StepProgress';
import { StepServices } from './sections/StepServices';
import { StepVerification } from './sections/StepVerification';
import { SubmittedPanel } from './sections/SubmittedPanel';
import { screenStyles } from './styles';

export function OrganizerOnboardingScreen() {
  const token = useAppSelector(selectAuthToken);
  const onb = useOrganizerOnboarding();
  const configQuery = useOnboardingConfig();
  const servicesConfigQuery = useServicesConfig();

  if (!token) {
    return (
      <SafeAreaView style={screenStyles.container} edges={['top']}>
        <AppHeader title="Become an organizer" />
        <AuthGateSection />
      </SafeAreaView>
    );
  }

  if (onb.bootstrapping || !onb.ready) {
    return (
      <SafeAreaView style={screenStyles.container} edges={['top']}>
        <AppHeader title="Become an organizer" />
        <View style={screenStyles.centerFill}>
          {onb.bootstrapError ? (
            <>
              <EventlyText variant="body" style={screenStyles.centerText}>
                {onb.bootstrapError}
              </EventlyText>
              <EventlyButton title="Try again" onPress={onb.retryBootstrap} accentColor={ORG_ACCENT} />
            </>
          ) : (
            <ActivityIndicator color={ORG_ACCENT} />
          )}
        </View>
      </SafeAreaView>
    );
  }

  if (onb.submitted) {
    return <SubmittedPanel />;
  }

  const currentIndex = onb.steps.findIndex((s) => s.id === onb.currentId);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === onb.steps.length - 1;
  const currentTitle = onb.steps[currentIndex]?.title ?? '';
  const currentSaveState = onb.saveState[onb.currentId];

  const handlePrimaryPress = () => {
    if (isLast) {
      onb.submit();
    } else {
      onb.goNext();
    }
  };

  return (
    <SafeAreaView style={screenStyles.container} edges={['top']}>
      <AppHeader title={ONB_COPY.title} compact showBackButton={false} />
      <StepProgress steps={onb.steps} onSelect={onb.goToStep} />

      <ScrollView style={screenStyles.scroll} contentContainerStyle={screenStyles.content} keyboardShouldPersistTaps="handled">
        <View>
          <EventlyText variant="h2" style={screenStyles.stepTitle}>
            {currentTitle}
          </EventlyText>
          {onb.currentId === 'basic' ? (
            <View style={[screenStyles.noteBox, screenStyles.basicNote]}>
              <EventlyIcon name="clock-outline" size={16} color={ORG_GREEN_DARK} />
              <EventlyText variant="caption" style={screenStyles.noteText}>
                {ONB_COPY.verifyNote}
              </EventlyText>
            </View>
          ) : null}
        </View>

        {onb.currentId === 'basic' ? <StepBasic onb={onb} config={configQuery.data ?? undefined} /> : null}
        {onb.currentId === 'verification' ? (
          <StepVerification onb={onb} servicesConfig={servicesConfigQuery.data ?? undefined} />
        ) : null}
        {onb.currentId === 'bank' ? <StepBank onb={onb} /> : null}
        {onb.currentId === 'services' ? <StepServices onb={onb} servicesConfig={servicesConfigQuery.data ?? undefined} /> : null}
        {onb.currentId === 'portfolio' ? <StepPortfolio onb={onb} /> : null}

        {onb.formError ? (
          <View style={screenStyles.formErrorBox}>
            <EventlyIcon name="alert-circle-outline" size={16} color={ORG_DANGER} />
            <EventlyText variant="body" style={screenStyles.formErrorText}>
              {onb.formError}
            </EventlyText>
          </View>
        ) : null}

        {currentSaveState === 'saved' ? (
          <EventlyText variant="caption" style={screenStyles.savedHint}>
            Saved
          </EventlyText>
        ) : null}
      </ScrollView>

      <View style={screenStyles.footerBar}>
        {!isFirst ? (
          <EventlyButton title="Back" onPress={onb.goBack} variant="outline" accentColor={ORG_ACCENT} style={screenStyles.footerButton} />
        ) : null}
        <EventlyButton
          title={isLast ? 'Submit for review' : 'Save & Continue'}
          onPress={handlePrimaryPress}
          loading={isLast ? onb.isSubmitting : false}
          accentColor={ORG_ACCENT}
          style={screenStyles.footerButton}
        />
      </View>
    </SafeAreaView>
  );
}

export default OrganizerOnboardingScreen;
