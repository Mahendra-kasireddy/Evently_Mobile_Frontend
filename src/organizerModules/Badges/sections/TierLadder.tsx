import { Fragment } from 'react';
import { View } from 'react-native';
import { AppText, EventlyIcon, GradientFill } from '../../../Components';
import { BADGES_COPY as COPY } from '../constants';
import { ORG_INK, tierLook } from '../design';
import { ladderStyles as s, styles as base } from '../styles';
import type { LadderStep } from '../types';

/** Silver → Gold → Platinum: where the organizer is, and the fee at each step. */
export function TierLadder({ steps }: { steps: LadderStep[] }) {
  return (
    <View style={base.card}>
      <AppText variant="h3" style={[base.cardTitle, s.title]}>
        {COPY.ladderTitle}
      </AppText>
      <View style={s.row}>
        {steps.map((step, i) => {
          const look = tierLook(step.tier);
          const reached = step.state !== 'ahead';
          const current = step.state === 'current';
          return (
            <Fragment key={step.tier}>
              {i > 0 ? <View style={[s.line, reached && s.lineDone]} /> : null}
              <View
                style={s.step}
                accessible
                accessibilityLabel={`${step.tier}, ${COPY.commission(
                  step.rate,
                )}${current ? `, ${COPY.you}` : ''}`}
              >
                <View style={[s.dot, current && s.dotCurrent]}>
                  {reached ? (
                    <GradientFill colors={look.gradient} direction="diagonal" />
                  ) : null}
                  <EventlyIcon
                    name={
                      step.state === 'ahead'
                        ? 'lock-outline'
                        : step.state === 'done'
                        ? 'check'
                        : 'medal'
                    }
                    size={20}
                    color={reached ? '#ffffff' : ORG_INK.inkFaint}
                  />
                </View>
                <AppText
                  variant="bodySmall"
                  style={[s.name, current && s.nameCurrent]}
                >
                  {step.tier}
                </AppText>
                <AppText variant="label" style={s.rate}>
                  {COPY.commission(step.rate)}
                </AppText>
                {current ? (
                  <View style={s.you}>
                    <AppText variant="label" style={s.youText}>
                      {COPY.you}
                    </AppText>
                  </View>
                ) : null}
              </View>
            </Fragment>
          );
        })}
      </View>
    </View>
  );
}

export default TierLadder;
