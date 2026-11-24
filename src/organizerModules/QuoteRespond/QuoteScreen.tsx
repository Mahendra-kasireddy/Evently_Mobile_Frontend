import { useEffect, useState, type ReactNode } from 'react';
import { Alert, Pressable, ScrollView, StatusBar, View } from 'react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppHeader,
  AppText,
  EventlyButton,
  EventlyIcon,
  FadeInUp,
  KeyboardAvoider,
  ThinkingOrbs,
} from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { formatInr } from '../Shared';
import { QUOTE_COPY as COPY, SUCCESS_PAUSE_MS } from './constants';
import { useQuoteContainer } from './container';
import {
  AMBER_INK,
  DANGER,
  ORG_ACCENT,
  ORG_ORB_COLORS,
  ORG_PAPER,
} from './design';
import { AddService } from './sections/AddService';
import { EnquiryCard } from './sections/EnquiryCard';
import { LineCard } from './sections/LineCard';
import { PreviewModal } from './sections/PreviewModal';
import { QuotePreview } from './sections/QuotePreview';
import { SummaryFooter } from './sections/SummaryFooter';
import { TermsCard } from './sections/TermsCard';
import { styles as s } from './styles';

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <View style={s.section}>
      <View style={s.sectionHead}>
        <AppText variant="h3" style={s.sectionTitle}>
          {title}
        </AppText>
        {hint ? (
          <AppText variant="caption" style={s.sectionHint}>
            {hint}
          </AppText>
        ) : null}
      </View>
      {children}
    </View>
  );
}

/**
 * Reply to an enquiry with a quote.
 *
 * The enquiry on top, then one card per service with its price, then the
 * terms; the total stays pinned at the bottom with the one thing to do —
 * send (or update) the quote — and a draft to come back to. A quote the
 * customer has already acted on opens as a read-only summary.
 */
export function QuoteScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } =
    useRoute<RouteProp<RootStackParamList, 'OrganizerQuote'>>();
  const q = useQuoteContainer(params.requestId);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Back with unsaved edits — arrow, swipe or Android back — asks first.
  useEffect(
    () =>
      navigation.addListener('beforeRemove', event => {
        if (!q.dirty || q.saving) return;
        event.preventDefault();
        Alert.alert(COPY.discardTitle, COPY.discardBody, [
          { text: COPY.keepEditing, style: 'cancel' },
          {
            text: COPY.discard,
            style: 'destructive',
            onPress: () => navigation.dispatch(event.data.action),
          },
        ]);
      }),
    [navigation, q.dirty, q.saving],
  );

  // Saved: let the confirmation register, then go back to the enquiries.
  useEffect(() => {
    if (!q.done) return undefined;
    const timer = setTimeout(() => {
      if (navigation.canGoBack()) navigation.goBack();
    }, SUCCESS_PAUSE_MS);
    return () => clearTimeout(timer);
  }, [q.done, navigation]);

  const onSend = () => {
    if (!q.check(false)) return;
    const updating = q.mode === 'sent';
    const who = q.request?.customerName || COPY.theCustomer;
    Alert.alert(
      updating ? COPY.confirmUpdateTitle : COPY.confirmSendTitle,
      COPY.confirmBody(
        who,
        formatInr(q.totals.grandTotal),
        formatInr(q.totals.advanceAmount),
      ) + (q.dropped ? COPY.confirmDropped(q.dropped) : ''),
      [
        { text: COPY.cancel, style: 'cancel' },
        {
          text: updating ? COPY.confirmUpdate : COPY.confirmSend,
          onPress: () => {
            q.save(false);
          },
        },
      ],
    );
  };

  const onDraft = () => {
    q.save(true);
  };

  const onWithdraw = () =>
    Alert.alert(COPY.withdrawTitle, COPY.withdrawBody, [
      { text: COPY.cancel, style: 'cancel' },
      {
        text: COPY.withdrawConfirm,
        style: 'destructive',
        onPress: () => {
          q.withdraw();
        },
      },
    ]);

  const title =
    q.mode === 'new'
      ? COPY.title
      : q.mode === 'draft'
      ? COPY.titleDraft
      : COPY.titleSent;
  const editable = q.mode !== 'readonly';

  const previewButton =
    q.form && editable ? (
      <Pressable
        style={s.headerAction}
        onPress={() => setPreviewOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={COPY.previewA11y}
      >
        <EventlyIcon name="eye-outline" size={16} color={AMBER_INK} />
        <AppText variant="label" style={s.headerActionText}>
          {COPY.preview}
        </AppText>
      </Pressable>
    ) : undefined;

  const frame = (body: ReactNode) => (
    <SafeAreaView style={s.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={ORG_PAPER.canvas} />
      <AppHeader title={title} rightElement={previewButton} />
      {body}
    </SafeAreaView>
  );

  const hydrating = !q.notFound && !!q.request && !q.form;
  if (q.isLoading || hydrating) {
    return frame(
      <View style={s.centered}>
        <ThinkingOrbs size={56} colors={ORG_ORB_COLORS} label={COPY.loading} />
        <AppText variant="body" style={s.muted}>
          {COPY.loading}
        </AppText>
      </View>,
    );
  }

  if (q.errorMessage && !q.request) {
    return frame(
      <View style={s.centered}>
        <AppText variant="h3" style={s.title}>
          {COPY.error}
        </AppText>
        <AppText variant="body" style={s.muted}>
          {q.errorMessage}
        </AppText>
        <EventlyButton
          title={COPY.retry}
          onPress={q.retry}
          accentColor={ORG_ACCENT.saffron}
        />
      </View>,
    );
  }

  if (q.notFound || !q.request || !q.form || !q.summary) {
    return frame(
      <View style={s.centered}>
        <EventlyIcon
          name="file-question-outline"
          size={40}
          color={ORG_ACCENT.saffron}
        />
        <AppText variant="h3" style={s.title}>
          {COPY.notFoundTitle}
        </AppText>
        <AppText variant="body" style={s.muted}>
          {COPY.notFoundBody}
        </AppText>
        <EventlyButton
          title={COPY.back}
          onPress={() => navigation.goBack()}
          variant="outline"
          accentColor={ORG_ACCENT.saffron}
        />
      </View>,
    );
  }

  const form = q.form;

  const banner = q.banner ? (
    <View style={s.banner}>
      <EventlyIcon name="information-outline" size={18} color={AMBER_INK} />
      <AppText variant="bodySmall" style={s.bannerText}>
        {q.banner}
      </AppText>
    </View>
  ) : null;

  if (!editable) {
    return frame(
      <ScrollView contentContainerStyle={s.content}>
        {banner}
        <EnquiryCard summary={q.summary} />
        <Section title={COPY.titleSent}>
          <QuotePreview
            lines={q.preview}
            totals={q.totals}
            notes={form.notes}
            siteVisit={form.siteVisit}
          />
        </Section>
      </ScrollView>,
    );
  }

  return frame(
    <KeyboardAvoider style={s.flex}>
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {banner}
        <FadeInUp>
          <EnquiryCard summary={q.summary} />
        </FadeInUp>

        <Section title={COPY.servicesTitle} hint={COPY.servicesHint}>
          {form.lines.length ? null : (
            <AppText variant="body" style={s.muted}>
              {COPY.noServices}
            </AppText>
          )}
          {form.lines.map(line => (
            <LineCard
              key={line.uid}
              line={line}
              error={q.errors.lines[line.uid]}
              onChange={patch => q.updateLine(line.uid, patch)}
              onField={(label, value) => q.setLineField(line.uid, label, value)}
              onRemove={() => q.removeLine(line.uid)}
            />
          ))}
          <AddService onAdd={q.addLine} />
        </Section>

        <Section title={COPY.termsTitle}>
          <TermsCard
            form={form}
            errors={q.errors}
            grandTotal={q.totals.grandTotal}
            onNotes={q.setNotes}
            onTax={q.setTaxRate}
            onAdvanceChoice={q.setAdvanceChoice}
            onAdvanceCustom={q.setAdvanceCustom}
            onSiteVisit={q.setSiteVisit}
          />
        </Section>

        {q.mode === 'sent' ? (
          <Pressable
            style={s.withdraw}
            onPress={onWithdraw}
            disabled={q.saving !== null || q.done !== null}
            accessibilityRole="button"
          >
            <EventlyIcon name="undo-variant" size={18} color={DANGER} />
            <AppText variant="body" style={s.withdrawText}>
              {COPY.withdraw}
            </AppText>
          </Pressable>
        ) : null}
      </ScrollView>

      <SummaryFooter
        mode={q.mode}
        totals={q.totals}
        saving={q.saving}
        saveError={q.saveError}
        done={q.done}
        onSend={onSend}
        onDraft={onDraft}
      />

      <PreviewModal
        visible={previewOpen}
        onClose={() => setPreviewOpen(false)}
        lines={q.preview}
        totals={q.totals}
        notes={form.notes}
        siteVisit={form.siteVisit}
      />
    </KeyboardAvoider>,
  );
}

export default QuoteScreen;
