import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import {
  AppHeader,
  EventlyButton,
  EventlyIcon,
  EventlyText,
  KeyboardAvoider,
} from '../../Components';
import type { MainTabParamList } from '../../navigation/types';
import { PLAN_ACCENT, PLAN_BG, PLAN_GREEN, PLAN_TEXT_MUTED } from './constants';
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

/**
 * The soft edge under the fixed header.
 *
 * Replaces a 1px rule that cut the occasion tiles in half as they scrolled
 * beneath it. Drawn with react-native-svg — already a dependency and already
 * used by OccasionPicker — rather than adding a gradient library for 14px of
 * chrome. Not touchable, or it would swallow taps meant for the first tiles.
 */
function HeaderFade() {
  return (
    <View style={styles.headerFade} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id="planHeaderFade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={PLAN_BG} stopOpacity={1} />
            <Stop offset="1" stopColor={PLAN_BG} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect
          x={0}
          y={0}
          width="100%"
          height="100%"
          fill="url(#planHeaderFade)"
        />
      </Svg>
    </View>
  );
}

export function PlanScreen() {
  const route = useRoute<RouteProp<MainTabParamList, 'Plan'>>();
  const container = usePlanContainer(
    route.params?.occasionId,
    route.params?.organizerId,
    route.params?.eventDate,
  );

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
            Your plan is saved and the quote request is on its way. You&rsquo;ll
            hear back within a day.
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
        {/*
          No back arrow: Plan is a bottom-tab root, so there is nothing behind it
          to go back to. Moving between steps is the Stepper right below.
        */}
        <AppHeader
          title={`Plan your ${occasionLabel}`}
          showBackButton={false}
          compact
        />
        <Stepper
          steps={container.steps}
          current={stepIndex}
          onSelect={container.goToStep}
        />
      </View>

      <KeyboardAvoider style={styles.body}>
        <HeaderFade />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
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
              selectedOrganizerIds={container.draft.selectedOrganizerIds}
              onToggleOrganizer={container.toggleOrganizer}
              canAddOrganizer={container.canAddOrganizer}
              onReviewShortlist={container.reviewShortlist}
            />
          ) : isReviewStep ? (
            <ReviewStep
              draft={container.draft}
              occasionLabel={occasionLabel}
              categories={container.categories}
              recommendedOrganizer={container.recommendedOrganizer}
              selectedOrganizers={container.selectedOrganizers}
              submitPhase={container.submitPhase}
              submitError={container.submitError}
              planSaved={container.planSaved}
              canSubmitPlan={container.canSubmitPlan}
              footnote={data.footnote}
              whatNext={data.whatNext ?? []}
              quoteNote={data.quoteNote}
              onEditDetails={() => container.goToStep(stepIndices.detailsIndex)}
              onEditCategories={() =>
                container.goToStep(stepIndices.categoriesIndex)
              }
              onEditOrganizer={() =>
                container.goToStep(stepIndices.organizersIndex)
              }
              onSubmit={container.submitPlan}
            />
          ) : isDetailsStep ? (
            <>
              <OccasionPicker
                occasions={container.occasions}
                selectedId={container.draft.occasionId}
                onSelect={container.selectOccasion}
              />
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
                onChange={value => container.setField('ideas', value)}
              />
              {data.budgetBanner ? (
                <View style={eventDetailsStyles.banner}>
                  <EventlyIcon
                    name="information-outline"
                    size={17}
                    color={PLAN_GREEN}
                  />
                  <EventlyText
                    variant="body"
                    style={eventDetailsStyles.bannerText}
                  >
                    {banner.bold ? (
                      <EventlyText
                        variant="body"
                        style={eventDetailsStyles.bannerBold}
                      >
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
            {/*
              No reason line above the button.
              
              `blockReason` is still computed by the container and still gates
              `canContinue` — it simply is not printed here any more. The button
              carries the state on its own: an outline while the step is
              unanswered, a filled accent once it is.

              Disabled keeps the muted text colour rather than EventlyButton's
              usual 50% dim, because a label nobody can read cannot say the
              control is waiting rather than broken. See `continueDisabled` in
              ./styles.
            */}
            <EventlyButton
              title={
                isDetailsStep
                  ? data.continueLabel || 'Continue'
                  : 'Continue to organizers'
              }
              onPress={container.continueStep}
              disabled={!container.canContinue}
              variant={container.canContinue ? 'primary' : 'outline'}
              accentColor={
                container.canContinue ? PLAN_ACCENT : PLAN_TEXT_MUTED
              }
              style={[
                styles.floatingButton,
                !container.canContinue && styles.continueDisabled,
              ]}
            />
          </View>
        ) : null}
      </KeyboardAvoider>
    </SafeAreaView>
  );
}

export default PlanScreen;
