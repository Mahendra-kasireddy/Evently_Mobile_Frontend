import { Pressable, TextInput, View } from 'react-native';
import { AppText, EventlyIcon, PopIn } from '../../../Components';
import type { CheckInResult } from '../container';
import { CHECK_IN_TOKEN_MAX, PUBLIC_EVENTS_COPY } from '../constants';
import { DANGER, ORG_ACCENT, ORG_INK, STATUS_TONE } from '../design';
import { checkInStyles as s, styles as screen } from '../styles';
import { ActionButton } from './ActionButton';

const COPY = PUBLIC_EVENTS_COPY.checkIn;

const RESULT_BOX = {
  ok: s.resultOk,
  warn: s.resultWarn,
  bad: s.resultBad,
};
const RESULT_TITLE = {
  ok: s.resultTitleOk,
  warn: s.resultTitleWarn,
  bad: s.resultTitleBad,
};
const RESULT_INK = {
  ok: STATUS_TONE.green.ink,
  warn: STATUS_TONE.amber.ink,
  bad: DANGER,
};

/**
 * The door: one big box for the code, one button, and the server's answer
 * in colour. Everyone admitted this session is listed below.
 */
export function CheckInTab({ c, open }: { c: CheckInResult; open: boolean }) {
  if (!open) {
    return (
      <View style={screen.section}>
        <View style={s.card}>
          <EventlyIcon name="door-closed" size={28} color={ORG_INK.inkSoft} />
          <AppText variant="body" style={s.body}>
            {COPY.closed}
          </AppText>
        </View>
      </View>
    );
  }

  const onSubmit = () => {
    c.submit().catch(() => undefined);
  };

  return (
    <View style={screen.section}>
      <View style={s.card}>
        <AppText variant="h3" style={s.title}>
          {COPY.title}
        </AppText>
        <AppText variant="bodySmall" style={s.body}>
          {COPY.body}
        </AppText>
        <TextInput
          style={[s.input, c.error ? s.inputError : null]}
          value={c.value}
          onChangeText={c.setValue}
          placeholder={COPY.placeholder}
          placeholderTextColor={ORG_INK.inkFaint}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={CHECK_IN_TOKEN_MAX}
          returnKeyType="go"
          onSubmitEditing={onSubmit}
          editable={!c.busy}
          accessibilityLabel={COPY.placeholder}
        />
        {c.error ? (
          <AppText
            variant="caption"
            style={s.error}
            accessibilityLiveRegion="polite"
          >
            {c.error}
          </AppText>
        ) : null}
        <ActionButton
          title={c.busy ? COPY.checking : COPY.submit}
          icon="qrcode-scan"
          loading={c.busy}
          onPress={onSubmit}
        />
        <AppText variant="caption" style={s.note}>
          {COPY.noCamera}
        </AppText>
      </View>

      {c.result ? (
        <PopIn>
          <Pressable
            style={[s.result, RESULT_BOX[c.result.tone]]}
            onPress={c.clearResult}
            accessibilityRole="button"
            accessibilityLiveRegion="assertive"
            accessibilityLabel={[c.result.title, c.result.name, c.result.detail]
              .filter(Boolean)
              .join('. ')}
          >
            <EventlyIcon
              name={c.result.icon}
              size={40}
              color={RESULT_INK[c.result.tone]}
            />
            <View style={s.resultText}>
              <AppText
                variant="h3"
                style={[s.resultTitle, RESULT_TITLE[c.result.tone]]}
              >
                {c.result.title}
              </AppText>
              {c.result.name ? (
                <AppText variant="body" style={s.resultName}>
                  {c.result.name}
                </AppText>
              ) : null}
              {c.result.detail ? (
                <AppText variant="caption" style={s.resultDetail}>
                  {c.result.detail}
                </AppText>
              ) : null}
            </View>
          </Pressable>
        </PopIn>
      ) : null}

      <AppText variant="h3" style={screen.sectionTitle}>
        {COPY.recent}
      </AppText>
      <View style={s.recent}>
        {c.recent.length === 0 ? (
          <AppText variant="bodySmall" style={s.empty}>
            {COPY.noRecent}
          </AppText>
        ) : (
          c.recent.map(r => (
            <View key={r.id} style={s.recentRow}>
              <EventlyIcon
                name="check-circle"
                size={20}
                color={ORG_ACCENT.jade}
              />
              <View style={s.recentBody}>
                <AppText variant="body" style={s.recentName} numberOfLines={1}>
                  {r.name}
                </AppText>
                <AppText variant="caption" style={s.recentMeta}>
                  {r.detail}
                </AppText>
              </View>
              <AppText variant="label" style={s.recentAt}>
                {r.at}
              </AppText>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

export default CheckInTab;
