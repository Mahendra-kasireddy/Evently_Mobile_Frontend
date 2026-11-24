import { RefreshControl, ScrollView, StatusBar, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppHeader,
  AppText,
  EventlyButton,
  FadeInUp,
  ThinkingOrbs,
} from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { ACADEMY_COPY as COPY } from './constants';
import { useAcademyContainer } from './container';
import { ORG_ACCENT, ORG_ORB_COLORS, ORG_PAPER } from './design';
import { AcademyHero } from './sections/AcademyHero';
import { HelpCard } from './sections/HelpCard';
import { ItemRow } from './sections/ItemRow';
import { StageCard } from './sections/StageCard';
import { styles as s } from './styles';

/**
 * Evently Academy: three stages, top to bottom. Stage 1's lessons are done
 * one tap at a time, the next one highlighted; Stage 2's workshops are
 * registered for; Stage 3's master class is optional. Later stages stay
 * visible but locked until the one before is finished.
 */
export function AcademyScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const a = useAcademyContainer();

  const content = a.isLoading ? (
    <View style={s.centered}>
      <ThinkingOrbs size={56} colors={ORG_ORB_COLORS} label={COPY.loading} />
      <AppText variant="body" style={s.muted}>
        {COPY.loading}
      </AppText>
    </View>
  ) : a.errorMessage || !a.data ? (
    <View style={s.centered}>
      <AppText variant="h3" style={s.title}>
        {COPY.error}
      </AppText>
      {a.errorMessage ? (
        <AppText variant="body" style={s.muted}>
          {a.errorMessage}
        </AppText>
      ) : null}
      <EventlyButton
        title={COPY.retry}
        onPress={a.refresh}
        accentColor={ORG_ACCENT.saffron}
      />
    </View>
  ) : (
    <ScrollView
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={a.isRefreshing}
          onRefresh={a.refresh}
          tintColor={ORG_ACCENT.saffron}
          colors={[ORG_ACCENT.saffron]}
        />
      }
    >
      <FadeInUp>
        <AcademyHero percent={a.percent} stage={a.data.trainingStage} />
      </FadeInUp>

      {a.notice ? (
        <View style={s.notice}>
          <AppText variant="caption" style={s.noticeText}>
            {a.notice}
          </AppText>
        </View>
      ) : null}

      <FadeInUp delay={60}>
        <StageCard stage={a.stages[0]}>
          {a.lessons.length === 0 ? (
            <AppText variant="caption" style={s.muted}>
              {COPY.noLessons}
            </AppText>
          ) : (
            a.lessons.map(lesson => (
              <ItemRow
                key={lesson.key}
                icon="play-circle-outline"
                title={lesson.title}
                meta={lesson.minutes}
                done={lesson.done}
                doneLabel={COPY.done}
                actionLabel={lesson.next ? COPY.start : COPY.watch}
                primary={lesson.next}
                disabled={false}
                busy={a.busy === `lesson:${lesson.key}`}
                onPress={() => a.act('lesson', lesson.key)}
              />
            ))
          )}
        </StageCard>
      </FadeInUp>

      <FadeInUp delay={120}>
        <StageCard stage={a.stages[1]}>
          {a.data.stage2.workshops.length === 0 ? (
            <AppText variant="caption" style={s.muted}>
              {COPY.noWorkshops}
            </AppText>
          ) : (
            a.data.stage2.workshops.map(w => (
              <ItemRow
                key={w.key}
                icon="calendar-account-outline"
                title={w.title}
                meta={w.when}
                done={w.registered}
                doneLabel={COPY.registered}
                actionLabel={COPY.register}
                primary={a.data!.stage2.unlocked}
                disabled={!a.data!.stage2.unlocked}
                busy={a.busy === `workshop:${w.key}`}
                onPress={() => a.act('workshop', w.key)}
              />
            ))
          )}
        </StageCard>
      </FadeInUp>

      <FadeInUp delay={180}>
        <StageCard stage={a.stages[2]}>
          {a.data.stage3.items.length === 0 ? (
            <AppText variant="caption" style={s.muted}>
              {COPY.noItems}
            </AppText>
          ) : (
            a.data.stage3.items.map(item => (
              <ItemRow
                key={item.key}
                icon="star-circle-outline"
                title={item.title}
                done={item.completed}
                doneLabel={COPY.done}
                actionLabel={COPY.markDone}
                primary={false}
                disabled={!a.data!.stage3.unlocked}
                busy={a.busy === `stage3:${item.key}`}
                onPress={() => a.act('stage3', item.key)}
              />
            ))
          )}
        </StageCard>
      </FadeInUp>

      <FadeInUp delay={240}>
        <HelpCard onPress={() => navigation.navigate('Contact')} />
      </FadeInUp>
    </ScrollView>
  );

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={ORG_PAPER.canvas} />
      <AppHeader title={COPY.title} />
      {content}
    </SafeAreaView>
  );
}

export default AcademyScreen;
