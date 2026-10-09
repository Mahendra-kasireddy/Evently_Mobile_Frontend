import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
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
import { colors } from '../../theme';
import { PLAN_ACCENT, PLAN_BG, PLAN_GREEN, PLAN_TEXT_MUTED } from './constants';
import { usePlanContainer } from './container';
import { CategoriesStep } from './sections/CategoriesStep';
import { EventDetailsForm } from './sections/EventDetailsForm';
import { FindOrganizers } from './sections/FindOrganizers';
import { IdeasRequests } from './sections/IdeasRequests';
import { OccasionPicker } from './sections/OccasionPicker';
import { PlanHero } from './sections/PlanHero';
import { ReviewStep } from './sections/ReviewStep';
import { StepPills } from './sections/StepPills';
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
  const navigation = useNavigation();
  const container = usePlanContainer(
    route.params?.occasionId,
    route.params?.organizerId,
    route.params?.eventDate,
    route.params?.requestId,
  );

  /*
   * Every navigation into Plan, not just the first.
   *
   * A tab stays mounted, so tapping "Birthday" on Home after the wizard had
   * already opened on "Wedding" used to leave Wedding selected. Each navigate()
   * hands over a fresh params object; apply it, then clear it so a plain tap
   * on the Plan tab later does not re-apply a stale choice.
   */
  const { applyEntry } = container;
  const entryParams = route.params;
  useEffect(() => {
    const occasionId = entryParams?.occasionId;
    const organizerId = entryParams?.organizerId;
    const eventDate = entryParams?.eventDate;
    if (!occasionId && !organizerId && !eventDate) return;
    applyEntry({ occasionId, organizerId, eventDate });
    navigation.setParams({
      occasionId: undefined,
      organizerId: undefined,
      eventDate: undefined,
    } as never);
  }, [entryParams, applyEntry, navigation]);

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
            {container.isEditingBrief ? 'Brief updated!' : 'Quote requested!'}
          </EventlyText>
          <EventlyText variant="body" style={styles.successSubtitle}>
            {container.isEditingBrief
              ? /* Said plainly, because it is the cost of editing: a quote
                   priced against the old brief is not a quote for this event
                   any more, and the customer should not go looking for it. */
                'The organizers you asked have your new brief. Any quote they had already sent no longer applies, so they will send a fresh one.'
              : 'Your plan is saved and the quote request is on its way. You’ll hear back within a day.'}
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
  const selectedOrganizerCount = container.draft.selectedOrganizerIds.length;
  const occasionLabel = container.currentOccasion.label;

  const banner = splitBannerSentence(data.budgetBanner ?? '');

  // A short tagline under the header title, one per step.
  const headerSubtitle = isDetailsStep
    ? 'Create your dream celebration'
    : isCategoriesStep
    ? 'Bring your vision to life'
    : isOrganizersStep
    ? 'Find the best organizers'
    : isReviewStep
    ? 'One last look before you send'
    : undefined;

  // Back walks the plan's own steps first; on the first step it leaves the
  // tab (the tab navigator returns to Home) rather than doing nothing.
  const handleBack = () => {
    if (stepIndex > 0) {
      container.goBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home' as never);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* The standard app header, unwrapped: it carries its own 16pt gutters,
          so it lines up with every other screen's header. */}
      <AppHeader
        title={`Plan your ${occasionLabel}`}
        subtitle={headerSubtitle}
        onBackPress={handleBack}
      />
      <KeyboardAvoider style={styles.body}>
        <HeaderFade />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Position is a "Step N of 4" pill rather than a progress bar. The
              Details hero draws its own, inside the floral header. */}
          {isDetailsStep ? null : (
            <View style={styles.stepPillsGap}>
              <StepPills
                stepNumber={stepIndex + 1}
                stepCount={container.steps.length}
                stepLabel={stepInfo?.label ?? ''}
              />
            </View>
          )}

          {isCategoriesStep || isOrganizersStep ? null : (
            <PlanHero
              occasionLabel={occasionLabel}
              isDetailsStep={isDetailsStep}
              heading={stepInfo?.heading ?? ''}
              subtitle={stepInfo?.subtitle ?? ''}
              trust={data.trust ?? []}
              stepNumber={stepIndex + 1}
              stepCount={container.steps.length}
              stepLabel={stepInfo?.label ?? ''}
            />
          )}

          {isOrganizersStep ? (
            <FindOrganizers
              filters={data.filters}
              draft={container.draft}
              searchOrganizers={container.searchOrganizers}
              selectedOrganizerIds={container.draft.selectedOrganizerIds}
              onToggleOrganizer={container.toggleOrganizer}
              canAddOrganizer={container.canAddOrganizer}
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
              isEditing={container.isEditingBrief}
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
              {/* The occasion comes first: it names the step's heading and
                  frames every answer below it. */}
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
                  <View style={eventDetailsStyles.bannerIcon}>
                    <EventlyIcon
                      name="lightbulb-on-outline"
                      size={19}
                      color={colors.onPrimary}
                    />
                  </View>
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
                  {/* A small green sprout, as in the design: budget as
                      something that grows into a plan, not a gate. */}
                  <EventlyIcon
                    name="sprout-outline"
                    size={30}
                    color={PLAN_GREEN}
                  />
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

          {!isOrganizersStep && !isReviewStep ? (
            <View style={styles.inlineContinue}>
              {/*
                At the end of the page, after the last field, rather than pinned
                over it: the customer reaches it once they have read the step,
                and the form is not covered by a bar while they fill it in.

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
        </ScrollView>

        {/* One request, several organizers: the shortlist travels with the
            customer down the list, and sends to everyone ticked at once. */}
        {isOrganizersStep && selectedOrganizerCount > 0 ? (
          <View style={[styles.footerBar, styles.shortlistFooter]}>
            <View style={styles.shortlistFooterText}>
              <EventlyText
                variant="subtitle"
                style={styles.shortlistFooterCount}
              >
                {selectedOrganizerCount === 1
                  ? '1 organizer selected'
                  : `${selectedOrganizerCount} organizers selected`}
              </EventlyText>
              <EventlyText variant="caption" style={styles.shortlistFooterHint}>
                Each sends their own quote to compare
              </EventlyText>
            </View>
            <EventlyButton
              title={
                selectedOrganizerCount === 1
                  ? 'Request quote'
                  : `Request ${selectedOrganizerCount} quotes`
              }
              onPress={container.reviewShortlist}
              accentColor={PLAN_ACCENT}
              style={styles.shortlistFooterButton}
            />
          </View>
        ) : null}
      </KeyboardAvoider>
    </SafeAreaView>
  );
}

export default PlanScreen;
