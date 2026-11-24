import { Pressable, Switch, TextInput, View } from 'react-native';
import { AppText } from '../../../Components';
import {
  APPROVAL_LABEL_MAX,
  IDEAS_COPY,
  PLAN_STATUSES,
  PLAN_STATUS_LABEL,
  TEXT_MAX,
} from '../constants';
import type { ReplySheetResult } from '../container';
import { ORG_ACCENT, ORG_INK } from '../design';
import { sheetStyles as s } from '../styles';
import { Sheet } from './Sheet';

const COPY = IDEAS_COPY.reply;

/**
 * Replying to a post: where it stands, what you are doing about it, and —
 * optionally — what the customer should sign off on. One reply per post on
 * the server; sending again replaces it.
 */
export function ReplySheet({ r }: { r: ReplySheetResult }) {
  const { form, errors } = r;
  return (
    <Sheet
      visible={r.visible}
      icon="reply-outline"
      title={COPY.title}
      closeLabel={COPY.close}
      busy={r.saving}
      onClose={r.close}
      primary={{
        title: r.saving ? COPY.saving : COPY.save,
        onPress: () => {
          r.save().catch(() => undefined);
        },
      }}
      cancelLabel={COPY.cancel}
    >
      {r.idea ? (
        <AppText variant="bodySmall" style={s.quote} numberOfLines={3}>
          {r.idea.text}
        </AppText>
      ) : null}

      <View style={s.field}>
        <AppText variant="bodySmall" style={s.label}>
          {COPY.statusLabel}
        </AppText>
        <View style={s.segment} accessibilityRole="radiogroup">
          {PLAN_STATUSES.map(status => {
            const on = form.status === status;
            return (
              <Pressable
                key={status}
                style={[s.segmentItem, on && s.segmentOn]}
                onPress={() => r.setField('status', status)}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
              >
                <AppText
                  variant="bodySmall"
                  style={[s.segmentText, on && s.segmentTextOn]}
                >
                  {PLAN_STATUS_LABEL[status]}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={s.field}>
        <View style={s.labelRow}>
          <AppText variant="bodySmall" style={s.label}>
            {COPY.textLabel}
          </AppText>
          {form.text.length > TEXT_MAX - 200 ? (
            <AppText variant="label" style={s.counter}>
              {`${form.text.length}/${TEXT_MAX}`}
            </AppText>
          ) : null}
        </View>
        <TextInput
          style={[s.input, s.inputMulti, errors.text ? s.inputError : null]}
          value={form.text}
          onChangeText={text => r.setField('text', text)}
          placeholder={COPY.placeholder}
          placeholderTextColor={ORG_INK.inkFaint}
          maxLength={TEXT_MAX}
          multiline
          editable={!r.saving}
          accessibilityLabel={COPY.textLabel}
        />
        {errors.text ? (
          <AppText variant="caption" style={s.error}>
            {errors.text}
          </AppText>
        ) : null}
      </View>

      <View style={s.switchRow}>
        <View style={s.switchText}>
          <AppText variant="bodySmall" style={s.label}>
            {COPY.askLabel}
          </AppText>
          <AppText variant="caption" style={s.hint}>
            {r.idea?.approval === 'approved' ? COPY.reaskNote : COPY.askHint}
          </AppText>
        </View>
        <Switch
          value={form.askApproval}
          onValueChange={on => r.setField('askApproval', on)}
          trackColor={{ true: ORG_ACCENT.saffron, false: ORG_INK.inkFaint }}
          accessibilityLabel={COPY.askLabel}
        />
      </View>

      {form.askApproval ? (
        <View style={s.field}>
          <AppText variant="bodySmall" style={s.label}>
            {COPY.approvalLabel}
          </AppText>
          <TextInput
            style={[s.input, errors.approvalLabel ? s.inputError : null]}
            value={form.approvalLabel}
            onChangeText={text => r.setField('approvalLabel', text)}
            placeholder={COPY.approvalPlaceholder}
            placeholderTextColor={ORG_INK.inkFaint}
            maxLength={APPROVAL_LABEL_MAX}
            editable={!r.saving}
            accessibilityLabel={COPY.approvalLabel}
          />
          {errors.approvalLabel ? (
            <AppText variant="caption" style={s.error}>
              {errors.approvalLabel}
            </AppText>
          ) : null}
        </View>
      ) : null}

      {r.error ? (
        <AppText
          variant="caption"
          style={s.error}
          accessibilityLiveRegion="polite"
        >
          {r.error}
        </AppText>
      ) : null}
    </Sheet>
  );
}

export default ReplySheet;
