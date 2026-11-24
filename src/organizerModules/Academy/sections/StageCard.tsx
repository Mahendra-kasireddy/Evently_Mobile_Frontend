import type { ReactNode } from 'react';
import { View } from 'react-native';
import { AppText, EventlyIcon, GradientFill } from '../../../Components';
import { ACADEMY_COPY as COPY } from '../constants';
import { ORG_INK, STAGE_TINT } from '../design';
import { stageStyles as s, stageTintStyles } from '../styles';
import type { StageSummary } from '../types';

/**
 * One stage: its number, name and progress, then its rows. A locked stage
 * says which stage opens it and shows its rows greyed, so the organizer can
 * see what is coming.
 */
export function StageCard({
  stage,
  children,
}: {
  stage: StageSummary;
  children: ReactNode;
}) {
  const tint = stageTintStyles[stage.number];
  const percent = stage.total
    ? Math.round((stage.done / stage.total) * 100)
    : 0;
  return (
    <View style={[s.card, !stage.unlocked && s.cardLocked]}>
      <View style={s.head}>
        <View style={[s.badge, !stage.unlocked && s.badgeLocked]}>
          {stage.unlocked ? (
            <GradientFill
              colors={STAGE_TINT[stage.number].gradient}
              direction="diagonal"
            />
          ) : null}
          {stage.unlocked ? (
            <AppText variant="h3" style={s.badgeText}>
              {stage.number}
            </AppText>
          ) : (
            <EventlyIcon
              name="lock-outline"
              size={20}
              color={ORG_INK.inkFaint}
            />
          )}
        </View>
        <View style={s.headText}>
          <View style={s.stageRow}>
            <AppText variant="label" style={s.stageLabel}>
              {COPY.stageLabel(stage.number)}
            </AppText>
            <View style={[s.tag, tint.tag]}>
              <AppText variant="label" style={[s.tagText, tint.tagText]}>
                {stage.tag}
              </AppText>
            </View>
          </View>
          <AppText variant="h3" style={s.title}>
            {stage.title}
          </AppText>
          <AppText variant="caption" style={s.subtitle}>
            {stage.subtitle}
          </AppText>
        </View>
      </View>

      {stage.unlocked && stage.total > 0 ? (
        <View style={s.progressWrap}>
          <AppText variant="caption" style={s.progressText}>
            {COPY.progress(stage.done, stage.total)}
          </AppText>
          <View style={s.track}>
            <View
              style={[s.fill, tint.fill, { width: `${Math.max(3, percent)}%` }]}
            />
          </View>
        </View>
      ) : null}

      {!stage.unlocked ? (
        <View style={s.locked}>
          <EventlyIcon name="lock-outline" size={14} color={ORG_INK.inkSoft} />
          <AppText variant="caption" style={s.lockedText}>
            {COPY.lockedHint(stage.number)}
          </AppText>
        </View>
      ) : null}

      {children}
    </View>
  );
}

export default StageCard;
