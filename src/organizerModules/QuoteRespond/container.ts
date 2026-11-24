import { useCallback, useEffect, useMemo, useState } from 'react';
import { QUOTE_COPY as COPY } from './constants';
import { useIncomingRequests } from './hooks';
import {
  respondToRequest,
  updateQuotation,
  withdrawQuotation,
} from './services';
import type {
  AdvanceChoice,
  CategoryTemplate,
  EnquirySummary,
  LineForm,
  PreviewLine,
  QuoteErrors,
  QuoteForm,
  QuoteMode,
  QuoteRequestDTO,
  QuoteTotals,
} from './types';
import {
  bannerFor,
  buildBody,
  digitsOnly,
  droppedCount,
  errorText,
  formTotals,
  hasErrors,
  initialForm,
  insertLine,
  isDirty,
  modeOf,
  newLine,
  percentInput,
  previewLines,
  quotationTotals,
  setSubItem,
  summaryFor,
  validate,
} from './utils';

export type SavingKind = 'send' | 'draft' | 'withdraw';

const NO_ERRORS: QuoteErrors = { lines: {} };

/** Drops one line's error once that line is edited. */
const clearLine = (uid: string) => (e: QuoteErrors) => {
  if (!e.lines[uid]) return e;
  const lines = { ...e.lines };
  delete lines[uid];
  return { ...e, lines };
};

export interface QuoteContainerResult {
  request: QuoteRequestDTO | null;
  /** Loaded, and the enquiry is not in the organizer's list any more. */
  notFound: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  retry: () => void;

  mode: QuoteMode;
  banner: string | null;
  summary: EnquirySummary | null;
  form: QuoteForm | null;
  totals: QuoteTotals;
  preview: PreviewLine[];
  errors: QuoteErrors;
  /** Services a send would leave out because they have no price. */
  dropped: number;
  dirty: boolean;

  updateLine: (uid: string, patch: Partial<LineForm>) => void;
  setLineField: (uid: string, label: string, value: string) => void;
  addLine: (template: CategoryTemplate) => void;
  removeLine: (uid: string) => void;
  setTaxRate: (text: string) => void;
  setAdvanceChoice: (choice: AdvanceChoice) => void;
  setAdvanceCustom: (text: string) => void;
  setNotes: (text: string) => void;
  setSiteVisit: (on: boolean) => void;

  /** Validates for a send or a draft; marks the problems and says if it is fine. */
  check: (asDraft: boolean) => boolean;
  /** Sends, updates or saves a draft. Resolves true on success. */
  save: (asDraft: boolean) => Promise<boolean>;
  withdraw: () => Promise<boolean>;
  saving: SavingKind | null;
  saveError: string | null;
  /** The success message once saved; the screen goes back shortly after. */
  done: string | null;
}

const EMPTY_TOTALS: QuoteTotals = {
  subtotal: 0,
  taxRate: 0,
  taxAmount: 0,
  grandTotal: 0,
  advancePercentage: 0,
  advanceAmount: 0,
};

/**
 * The quote for one enquiry: finds it in the incoming list, fills the form
 * from any saved quote, keeps the totals live, and sends, updates, saves a
 * draft or withdraws.
 */
export function useQuoteContainer(requestId: string): QuoteContainerResult {
  const incoming = useIncomingRequests();
  const request = useMemo(
    () => incoming.data?.find(r => r.id === requestId) ?? null,
    [incoming.data, requestId],
  );

  const [baseline, setBaseline] = useState<QuoteForm | null>(null);
  const [form, setForm] = useState<QuoteForm | null>(null);
  const [errors, setErrors] = useState<QuoteErrors>(NO_ERRORS);
  const [saving, setSaving] = useState<SavingKind | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  // Fill the form once, so a refetch never overwrites what is being typed.
  useEffect(() => {
    if (!request || baseline) return;
    const next = initialForm(request);
    setBaseline(next);
    setForm(next);
  }, [request, baseline]);

  const mode: QuoteMode = request ? modeOf(request) : 'new';

  const edit = useCallback(
    (
      fn: (f: QuoteForm) => QuoteForm,
      clear?: (e: QuoteErrors) => QuoteErrors,
    ) => {
      setForm(prev => (prev ? fn(prev) : prev));
      setErrors(prev => {
        const next = clear ? clear(prev) : prev;
        return next.form ? { ...next, form: undefined } : next;
      });
      setSaveError(null);
    },
    [],
  );

  const updateLine = useCallback(
    (uid: string, patch: Partial<LineForm>) =>
      edit(
        f => ({
          ...f,
          lines: f.lines.map(l => (l.uid === uid ? { ...l, ...patch } : l)),
        }),
        clearLine(uid),
      ),
    [edit],
  );

  const setLineField = useCallback(
    (uid: string, label: string, value: string) =>
      edit(
        f => ({
          ...f,
          lines: f.lines.map(l =>
            l.uid === uid ? setSubItem(l, label, value) : l,
          ),
        }),
        clearLine(uid),
      ),
    [edit],
  );

  const addLine = useCallback(
    (template: CategoryTemplate) =>
      edit(f => ({ ...f, lines: insertLine(f.lines, newLine(template)) })),
    [edit],
  );

  const removeLine = useCallback(
    (uid: string) =>
      edit(
        f => ({ ...f, lines: f.lines.filter(l => l.uid !== uid) }),
        clearLine(uid),
      ),
    [edit],
  );

  const setTaxRate = useCallback(
    (text: string) =>
      edit(
        f => ({ ...f, taxRate: percentInput(text) }),
        e => ({ ...e, taxRate: undefined }),
      ),
    [edit],
  );

  const setAdvanceChoice = useCallback(
    (choice: AdvanceChoice) =>
      edit(
        f => ({ ...f, advanceChoice: choice }),
        e => ({ ...e, advance: undefined }),
      ),
    [edit],
  );

  const setAdvanceCustom = useCallback(
    (text: string) =>
      edit(
        f => ({ ...f, advanceCustom: digitsOnly(text, 3) }),
        e => ({ ...e, advance: undefined }),
      ),
    [edit],
  );

  const setNotes = useCallback(
    (text: string) =>
      edit(
        f => ({ ...f, notes: text }),
        e => ({ ...e, notes: undefined }),
      ),
    [edit],
  );

  const setSiteVisit = useCallback(
    (on: boolean) => edit(f => ({ ...f, siteVisit: on })),
    [edit],
  );

  const check = useCallback(
    (asDraft: boolean) => {
      if (!form) return false;
      const found = validate(form, asDraft);
      setErrors(found);
      if (hasErrors(found)) {
        setSaveError(found.form ?? COPY.fixFields);
        return false;
      }
      setSaveError(null);
      return true;
    },
    [form],
  );

  const save = useCallback(
    async (asDraft: boolean) => {
      if (!form || !request || saving || !check(asDraft)) return false;
      const existing = request.myQuotation;
      const body = buildBody(form, asDraft);
      setSaving(asDraft ? 'draft' : 'send');
      setSaveError(null);
      try {
        await (existing
          ? updateQuotation(existing.id, body)
          : respondToRequest(request.id, body));
        // What was saved is the new "unchanged", so leaving does not ask.
        setBaseline(form);
        setDone(
          asDraft
            ? COPY.draftDone
            : mode === 'sent'
            ? COPY.updatedDone
            : COPY.sentDone,
        );
        return true;
      } catch (error) {
        setSaveError(errorText(error, COPY.saveFailed));
        return false;
      } finally {
        setSaving(null);
      }
    },
    [form, request, saving, check, mode],
  );

  const withdraw = useCallback(async () => {
    const existing = request?.myQuotation;
    if (!existing || saving) return false;
    setSaving('withdraw');
    setSaveError(null);
    try {
      await withdrawQuotation(existing.id);
      setBaseline(form);
      setDone(COPY.withdrawnDone);
      return true;
    } catch (error) {
      setSaveError(errorText(error, COPY.withdrawFailed));
      return false;
    } finally {
      setSaving(null);
    }
  }, [request, saving, form]);

  const totals = useMemo(() => {
    if (mode === 'readonly' && request?.myQuotation)
      return quotationTotals(request.myQuotation);
    return form ? formTotals(form) : EMPTY_TOTALS;
  }, [mode, request, form]);

  return {
    request,
    notFound: !incoming.loading && !!incoming.data && !request,
    isLoading: incoming.loading && !incoming.data,
    errorMessage:
      !incoming.data && incoming.error ? incoming.error.message : null,
    retry: incoming.refetch,

    mode,
    banner: request ? bannerFor(request) : null,
    summary: useMemo(() => (request ? summaryFor(request) : null), [request]),
    form,
    totals,
    preview: useMemo(() => (form ? previewLines(form) : []), [form]),
    errors,
    dropped: form ? droppedCount(form) : 0,
    dirty: !done && mode !== 'readonly' && isDirty(baseline, form),

    updateLine,
    setLineField,
    addLine,
    removeLine,
    setTaxRate,
    setAdvanceChoice,
    setAdvanceCustom,
    setNotes,
    setSiteVisit,

    check,
    save,
    withdraw,
    saving,
    saveError,
    done,
  };
}
