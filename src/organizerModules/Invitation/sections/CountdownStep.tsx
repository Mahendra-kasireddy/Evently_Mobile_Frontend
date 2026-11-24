import { Pressable, View } from 'react-native';
import { AppText } from '../../../Components';
import { INVITATION_COPY as COPY, LIMITS } from '../constants';
import type { CountdownEditor } from '../editors';
import { styles as base, countdownStyles as s } from '../styles';
import { FormField, Group, SwitchRow } from './Fields';

/** Which event the countdown counts to, what replaces it, and the day-before notice. */
export function CountdownStep({ cd }: { cd: CountdownEditor }) {
  const form = cd.form;
  if (!form) return null;
  const onlyWhole = cd.targets.length <= 1;

  return (
    <View style={base.stack}>
      <Group title={COPY.countdownTarget}>
        <View style={s.targets} accessibilityRole="radiogroup">
          {cd.targets.map(t => {
            const on = form.countdownSubEventId === t.id;
            return (
              <Pressable
                key={t.id || 'whole'}
                style={[s.target, on && s.targetOn]}
                onPress={() => cd.set('countdownSubEventId', t.id)}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                accessibilityLabel={`${t.label}, ${t.line}`}
              >
                <View style={[s.radio, on && s.radioOn]}>
                  {on ? <View style={s.radioDot} /> : null}
                </View>
                <View style={s.targetText}>
                  <AppText variant="body" style={s.targetLabel}>
                    {t.label}
                  </AppText>
                  <AppText variant="caption" style={s.targetLine}>
                    {t.id ? t.line : `${COPY.countdownWholeHint} · ${t.line}`}
                  </AppText>
                </View>
              </Pressable>
            );
          })}
        </View>
        {onlyWhole ? (
          <AppText variant="caption" style={base.note}>
            {COPY.countdownNoEvents}
          </AppText>
        ) : null}
        <FormField
          label={COPY.countdownAfter}
          value={form.postEventMessage}
          onChangeText={v => cd.set('postEventMessage', v)}
          placeholder={COPY.countdownAfterPh}
          max={LIMITS.notification}
          multiline
        />
      </Group>

      <Group>
        <SwitchRow
          label={COPY.noticeTitle}
          hint={COPY.noticeLead}
          value={form.oneDayNotificationEnabled}
          onValueChange={v => cd.set('oneDayNotificationEnabled', v)}
        />
        {form.oneDayNotificationEnabled ? (
          <>
            <FormField
              label={COPY.noticeBody}
              value={form.oneDayNotificationMessage}
              onChangeText={v => cd.set('oneDayNotificationMessage', v)}
              placeholder={COPY.noticeBodyPh}
              max={LIMITS.notification}
              multiline
            />
            <FormField
              label={COPY.noticeMissed}
              value={form.missedNotificationMessage}
              onChangeText={v => cd.set('missedNotificationMessage', v)}
              placeholder={COPY.noticeMissedPh}
              max={LIMITS.notification}
              hint={COPY.noticeMissedWhy}
              multiline
            />
          </>
        ) : null}
      </Group>
    </View>
  );
}

export default CountdownStep;
