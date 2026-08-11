import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyButton, EventlyIcon, EventlyText } from '../../Components';
import type { MainTabParamList } from '../../navigation/types';
import { PLAN_ACCENT, PLAN_BORDER, PLAN_GREEN } from './constants';
import { usePlanContainer } from './container';
import { CategoriesStep } from './sections/CategoriesStep';
import { EventDetailsForm } from './sections/EventDetailsForm';
import { FindOrganizers } from './sections/FindOrganizers';
import { IdeasRequests } from './sections/IdeasRequests';
import { OccasionPicker } from './sections/OccasionPicker';
import { PlanHero } from './sections/PlanHero';
import { ReviewStep } from './sections/ReviewStep';
import { Stepper } from './sections/Stepper';
import { eventDetailsStyles, styles } from './styles';
import { splitBannerSentence } from './utils';

export function PlanScreen() {
  const route = useRoute<RouteProp<MainTabParamList, 'Plan'>>();
  const container = usePlanContainer(route.params?.occasionId);

  if (container.isLoadingScreen) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <ActivityIndicator size="large" color={PLAN_ACCENT} />
        <EventlyText variant="body" style={styles.loadingText}>
          Setting up your plan…
        </EventlyText>
      </SafeAreaView>
    );
  }

  if (container.isScreenError) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <EventlyText variant="body" style={styles.errorText}>
          {container.screenErrorMessage ?? 'Something went wrong.'}
        </EventlyText>
        <EventlyButton
          title="Retry"
          onPress={container.refetchScreen}
          variant="outline"
          style={styles.retryButton}
          accentColor={PLAN_ACCENT}
        />
      </SafeAreaView>
    );
  }

  const data = container.screenData;
  if (!data || !container.currentOccasion) return null;

  if (container.submitSucceeded) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <View style={styles.successCard}>
          <EventlyIcon name="check-circle" size={48} color={PLAN_GREEN} />
          <EventlyText variant="h2" style={styles.successTitle}>
            Quote requested!
          </EventlyText>
          <EventlyText variant="body" style={styles.successSubtitle}>
            Your plan is saved and the quote request is on its way. You&rsquo;ll hear back within a day.
          </EventlyText>
        </View>
        <EventlyButton
          title="Start another plan"
          onPress={container.startNewPlan}
          variant="outline"
          style={styles.newPlanButton}
          accentColor={PLAN_ACCENT}
        />
      </SafeAreaView>
    );
  }

  const { stepIndices, stepIndex } = container;
  const isDetailsStep = stepIndex === stepIndices.detailsIndex;
  const isCategoriesStep = stepIndex === stepIndices.categoriesIndex;
  const isOrganizersStep = stepIndex === stepIndices.organizersIndex;
  const isReviewStep = stepIndex === stepIndices.reviewIndex;
  const stepInfo = container.steps[stepIndex];
  const occasionLabel = container.currentOccasion.label;

  const banner = splitBannerSentence(data.budgetBanner ?? '');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.fixedHeader}>
        <AppHeader title={`Plan your ${occasionLabel}`} onBackPress={container.goBack} compact />
        <Stepper steps={container.steps} current={stepIndex} onSelect={container.goToStep} />
      </View>

      <KeyboardAvoidingView style={styles.body} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <PlanHero
            occasionLabel={occasionLabel}
            isDetailsStep={isDetailsStep}
            heading={stepInfo?.heading ?? ''}
            subtitle={stepInfo?.subtitle ?? ''}
            trust={data.trust ?? []}
          />

          {isOrganizersStep ? (
            <FindOrganizers
              filters={data.filters}
              draft={container.draft}
              searchOrganizers={container.searchOrganizers}
              selectedOrganizerId={container.draft.selectedOrganizerId}
              onSelectOrganizer={container.selectOrganizer}
            />
          ) : isReviewStep ? (
            <ReviewStep
              draft={container.draft}
              occasionLabel={occasionLabel}
              categories={container.categories}
              recommendedOrganizer={container.recommendedOrganizer}
              selectedOrganizerDetails={container.selectedOrganizerDetails}
              submitPhase={container.submitPhase}
              submitError={container.submitError}
              planSaved={container.planSaved}
              canSubmitPlan={container.canSubmitPlan}
              footnote={data.footnote}
              whatNext={data.whatNext ?? []}
              quoteNote={data.quoteNote}
              onEditDetails={() => container.goToStep(stepIndices.detailsIndex)}
              onEditCategories={() => container.goToStep(stepIndices.categoriesIndex)}
              onEditOrganizer={() => container.goToStep(stepIndices.organizersIndex)}
              onSubmit={container.submitPlan}
            />
          ) : isDetailsStep ? (
            <>
              <OccasionPicker occasions={container.occasions} selectedId={container.draft.occasionId} onSelect={container.selectOccasion} />
              <EventDetailsForm
                draft={container.draft}
                cityOptions={data.cityOptions ?? []}
                guestOptions={data.guestOptions ?? []}
                budgetOptions={data.budgetOptions ?? []}
                onSetField={container.setField}
                onSelectGuests={container.selectGuests}
                onSelectBudget={container.selectBudget}
              />
              <IdeasRequests
                config={data.ideas}
                value={container.draft.ideas}
                onAdd={container.addIdea}
                onChange={(value) => container.setField('ideas', value)}
              />
              {data.budgetBanner ? (
                <View style={eventDetailsStyles.banner}>
                  <EventlyIcon name="information-outline" size={17} color={PLAN_GREEN} />
                  <EventlyText variant="body" style={eventDetailsStyles.bannerText}>
                    {banner.bold ? (
                      <EventlyText variant="body" style={eventDetailsStyles.bannerBold}>
                        {banner.bold}
                      </EventlyText>
                    ) : null}
                    {banner.rest}
                  </EventlyText>
                </View>
              ) : null}
            </>
          ) : isCategoriesStep ? (
            <CategoriesStep
              occasionLabel={occasionLabel}
              categories={container.categories}
              selected={container.draft.categories}
              onToggle={container.toggleCategory}
            />
          ) : null}
        </ScrollView>

        {!isOrganizersStep && !isReviewStep ? (
          <View style={styles.footerBar}>
            {container.blockReason ? (
              <EventlyText variant="caption" style={styles.blockReasonText}>
                {container.blockReason}
              </EventlyText>
            ) : null}
            <EventlyButton
              title={isDetailsStep ? data.continueLabel || 'Continue' : 'Continue to organizers'}
              onPress={container.continueStep}
              disabled={!container.canContinue}
              accentColor={container.canContinue ? PLAN_ACCENT : PLAN_BORDER}
              style={styles.floatingButton}
            />
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default PlanScreen;
