import { View } from 'react-native';
import {
  AppText,
  EventlyIcon,
  GradientFill,
  PressableScale,
} from '../../../Components';
import { HOME_COPY as COPY } from '../constants';
import { ORG_ACCENT, ORG_ACTION_GRADIENT } from '../design';
import { goLiveStyles as s } from '../styles';
import type { GoLiveCardModel } from '../types';

/**
 * Where the organizer is on the way to going live — one card, one tap.
 *
 * Setup: a progress bar and the next step; the card opens setup at that step.
 * Waiting on review, rejected, or live without bank details: a short note.
 * Live with bank details on file: no card at all.
 */
export function GoLiveCard({
  model,
  onPress,
}: {
  model: Exclude<GoLiveCardModel, null>;
  onPress: () => void;
}) {
  if (model.kind === 'setup' || model.kind === 'changes') {
    const changes = model.kind === 'changes';
    const nextLine = model.readyToSubmit
      ? COPY.readyToSubmit
      : model.nextStepTitle
      ? COPY.next(model.nextStepTitle)
      : '';
    return (
      <PressableScale
        style={s.card}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${
          changes ? COPY.changesTitle : COPY.goLiveTitle
        }. ${COPY.progress(model.done, model.total)}`}
      >
        <View style={s.head}>
          <View style={s.badge}>
            <GradientFill
              colors={changes ? ['#ffc65c', '#e8902a'] : ORG_ACTION_GRADIENT}
              direction="diagonal"
            />
            <EventlyIcon
              name={changes ? 'alert-outline' : 'rocket-launch-outline'}
              size={22}
              color="#ffffff"
            />
          </View>
          <View style={s.headText}>
            <AppText variant="h3" style={s.title}>
              {changes ? COPY.changesTitle : COPY.goLiveTitle}
            </AppText>
            <AppText variant="bodySmall" style={s.body} numberOfLines={2}>
              {model.note}
            </AppText>
          </View>
          <EventlyIcon
            name="chevron-right"
            size={22}
            color={ORG_ACCENT.saffron}
          />
        </View>
        <View style={s.track}>
          <View style={[s.fill, { width: `${Math.max(4, model.percent)}%` }]}>
            <GradientFill colors={ORG_ACTION_GRADIENT} direction="across" />
          </View>
        </View>
        <View style={s.footer}>
          <AppText variant="caption" style={s.count}>
            {COPY.progress(model.done, model.total)}
          </AppText>
          {nextLine ? (
            <AppText variant="caption" style={s.next} numberOfLines={1}>
              {nextLine}
            </AppText>
          ) : (
            <AppText variant="caption" style={s.percent}>
              {`${model.percent}%`}
            </AppText>
          )}
        </View>
      </PressableScale>
    );
  }

  const note =
    model.kind === 'submitted'
      ? {
          icon: 'clock-outline',
          tone: ['#a084ff', '#5a35e0'] as [string, string],
          title: COPY.submittedTitle,
          body: COPY.submittedBody,
        }
      : model.kind === 'payout'
      ? {
          icon: 'bank-outline',
          tone: ['#3cc9a1', '#0e8a68'] as [string, string],
          title: COPY.payoutTitle,
          body: COPY.payoutBody,
        }
      : {
          icon: 'close-circle-outline',
          tone: ['#ff8a8a', '#d9462f'] as [string, string],
          title: COPY.rejectedTitle,
          body: model.note,
        };
  // Only the bank-details nudge leads somewhere; the others are information.
  const tappable = model.kind === 'payout';

  const content = (
    <View style={s.head}>
      <View style={s.badge}>
        <GradientFill colors={note.tone} direction="diagonal" />
        <EventlyIcon name={note.icon} size={22} color="#ffffff" />
      </View>
      <View style={s.headText}>
        <AppText variant="h3" style={s.title}>
          {note.title}
        </AppText>
        <AppText variant="bodySmall" style={s.body}>
          {note.body}
        </AppText>
      </View>
      {tappable ? (
        <EventlyIcon
          name="chevron-right"
          size={22}
          color={ORG_ACCENT.saffron}
        />
      ) : null}
    </View>
  );

  return tappable ? (
    <PressableScale
      style={s.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={note.title}
    >
      {content}
    </PressableScale>
  ) : (
    <View style={s.card}>{content}</View>
  );
}

export default GoLiveCard;
