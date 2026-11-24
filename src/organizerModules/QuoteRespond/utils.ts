/*
 * The quote form's arithmetic and shaping — pure, so it is unit-tested.
 *
 * Money matches `quote.service.ts` on the backend exactly:
 *   subtotal   = Σ line.price                              (no rounding)
 *   taxAmount  = Math.round(subtotal × taxRate / 100)       (half up, whole ₹)
 *   grandTotal = subtotal + taxAmount
 *   advance    = Math.round(grandTotal × advance% / 100)    (`quotationView`)
 * Line prices are whole rupees here (typed on the number pad; catering is
 * plates × rate, both whole numbers), so every figure is an integer and the
 * number the organizer sees is the number the customer gets.
 */
import { formatInr } from '../Shared';
import {
  ADVANCE_PRESETS,
  CATEGORY_TEMPLATES,
  DEFAULT_ADVANCE,
  DEFAULT_TAX_RATE,
  GENERIC_TEMPLATE,
  LIMITS,
  QUOTE_COPY as COPY,
} from './constants';
import type {
  AdvanceChoice,
  CategoryTemplate,
  EnquirySummary,
  LineForm,
  PreviewLine,
  QuotationDTO,
  QuoteBody,
  QuoteErrors,
  QuoteForm,
  QuoteLineBody,
  QuoteMode,
  QuoteRequestDTO,
  QuoteTotals,
} from './types';

// ---- Input ---------------------------------------------------------------------

/** Keeps digits only, at most `max` of them. */
export function digitsOnly(text: string, max: number): string {
  return text.replace(/\D/g, '').slice(0, max);
}

/** A percentage as typed: digits and one decimal point, two places at most. */
export function percentInput(text: string): string {
  const clean = text.replace(',', '.').replace(/[^\d.]/g, '');
  const [whole = '', ...rest] = clean.split('.');
  const intPart = whole.slice(0, 3);
  if (!rest.length) return intPart;
  return `${intPart}.${rest.join('').slice(0, 2)}`;
}

/** A typed number, or 0 when blank or not a number. */
export function toNumber(text: string | undefined | null): number {
  const n = Number(text ?? '');
  return Number.isFinite(n) && n > 0 ? n : 0;
}

// ---- Templates -----------------------------------------------------------------

/** The template for a requested category ("Food & Catering" → catering). */
export function templateForCategory(category: string): CategoryTemplate {
  const needle = category.trim().toLowerCase();
  const found = CATEGORY_TEMPLATES.find(t =>
    t.match.some(m => needle.includes(m)),
  );
  if (found) return found;
  const key =
    needle.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
    GENERIC_TEMPLATE.key;
  return { ...GENERIC_TEMPLATE, key };
}

/**
 * The template for a line. The key decides, so renaming a card never changes
 * how it is priced; only a line saved without a key is matched by its title.
 */
export function templateForLine(
  line: Pick<LineForm, 'key' | 'title'>,
): CategoryTemplate {
  const byKey = CATEGORY_TEMPLATES.find(t => t.key === line.key);
  if (byKey) return byKey;
  if (line.key) return { ...GENERIC_TEMPLATE, key: line.key };
  return templateForCategory(line.title);
}

/** Labels a template renders, so every input on the card is controlled. */
function templateLabels(t: CategoryTemplate): string[] {
  return [
    ...t.fields.map(f => f.label),
    ...(t.options ? [t.options.label] : []),
  ];
}

/**
 * One sub-item per field the template draws, keeping values already there and
 * any extra labels a quote written elsewhere carried (never lose detail).
 */
export function seedSubItems(
  template: CategoryTemplate,
  existing: Array<{ label: string; value: string }> = [],
): Array<{ label: string; value: string }> {
  const labels = templateLabels(template);
  const byLabel = new Map(existing.map(s => [s.label, s.value]));
  return [
    ...labels.map(label => ({ label, value: byLabel.get(label) ?? '' })),
    ...existing.filter(s => !labels.includes(s.label)).map(s => ({ ...s })),
  ];
}

let uidCounter = 0;
/** A local id for a line. */
export function nextUid(): string {
  uidCounter += 1;
  return `line-${uidCounter}`;
}

/** A blank card for one service. */
export function newLine(
  template: CategoryTemplate,
  title: string = template.label,
  uid: string = nextUid(),
): LineForm {
  return {
    uid,
    key: template.key,
    title: title.slice(0, LIMITS.title),
    subtitle: '',
    price: '',
    note: '',
    subItems: seedSubItems(template),
  };
}

/**
 * Adds a line after the last one of the same kind, so services of one
 * category stay together.
 */
export function insertLine(lines: LineForm[], line: LineForm): LineForm[] {
  let at = -1;
  lines.forEach((l, i) => {
    if (l.key === line.key) at = i;
  });
  if (at < 0) return [...lines, line];
  return [...lines.slice(0, at + 1), line, ...lines.slice(at + 1)];
}

export function subItemValue(line: LineForm, label: string): string {
  return line.subItems.find(s => s.label === label)?.value ?? '';
}

export function setSubItem(
  line: LineForm,
  label: string,
  value: string,
): LineForm {
  const has = line.subItems.some(s => s.label === label);
  return {
    ...line,
    subItems: has
      ? line.subItems.map(s => (s.label === label ? { ...s, value } : s))
      : [...line.subItems, { label, value }],
  };
}

// ---- Money ---------------------------------------------------------------------

/** Plates × rate for catering; null when the template has no such rule. */
export function derivedPrice(line: LineForm): number | null {
  const t = templateForLine(line);
  if (!t.derivePrice) return null;
  const [a, b] = t.derivePrice;
  return toNumber(subItemValue(line, a)) * toNumber(subItemValue(line, b));
}

/** What one line costs: plates × rate when both are filled, else the amount. */
export function lineAmount(line: LineForm): number {
  const derived = derivedPrice(line);
  if (derived !== null && derived > 0) return derived;
  return toNumber(line.price);
}

/** The advance % the form currently says. */
export function advancePercent(form: QuoteForm): number {
  return form.advanceChoice === 'custom'
    ? toNumber(form.advanceCustom)
    : form.advanceChoice;
}

/** Tax % as typed; blank is 0. */
export function taxPercent(form: QuoteForm): number {
  return toNumber(form.taxRate);
}

/** Exactly the backend's `computeTotals` plus `quotationView`'s advance. */
export function computeTotals(
  amounts: number[],
  taxRate: number,
  advancePercentage: number,
): QuoteTotals {
  const subtotal = amounts.reduce((sum, a) => sum + (a || 0), 0);
  const taxAmount = Math.round((subtotal * taxRate) / 100);
  const grandTotal = subtotal + taxAmount;
  return {
    subtotal,
    taxRate,
    taxAmount,
    grandTotal,
    advancePercentage,
    advanceAmount: Math.round((grandTotal * advancePercentage) / 100),
  };
}

export function formTotals(form: QuoteForm): QuoteTotals {
  return computeTotals(
    form.lines.map(lineAmount),
    taxPercent(form),
    advancePercent(form),
  );
}

/** A saved quotation's own figures, as the server computed them. */
export function quotationTotals(q: QuotationDTO): QuoteTotals {
  return {
    subtotal: q.subtotal,
    taxRate: q.taxRate,
    taxAmount: q.taxAmount,
    grandTotal: q.grandTotal,
    advancePercentage: q.advancePercentage,
    advanceAmount:
      q.advanceAmount ?? Math.round((q.grandTotal * q.advancePercentage) / 100),
  };
}

// ---- Form <-> API --------------------------------------------------------------

function advanceFrom(
  pct: number,
): Pick<QuoteForm, 'advanceChoice' | 'advanceCustom'> {
  const preset = ADVANCE_PRESETS.find(p => p === pct);
  return preset !== undefined
    ? { advanceChoice: preset, advanceCustom: '' }
    : { advanceChoice: 'custom', advanceCustom: String(pct) };
}

/** A fresh quote: one card per service the customer asked for. */
export function formForRequest(categories: string[]): QuoteForm {
  const lines = categories.length
    ? categories.map(c => newLine(templateForCategory(c), c))
    : [newLine(GENERIC_TEMPLATE, '')];
  return {
    lines,
    taxRate: String(DEFAULT_TAX_RATE),
    ...advanceFrom(DEFAULT_ADVANCE),
    notes: '',
    siteVisit: false,
  };
}

/** A saved quotation back into the form. */
export function formFromQuotation(q: QuotationDTO): QuoteForm {
  return {
    lines: q.lineItems.map(li => {
      const line: LineForm = {
        uid: nextUid(),
        key: li.key ?? '',
        title: li.title ?? '',
        subtitle: li.subtitle ?? '',
        price: li.price ? String(li.price) : '',
        note: li.note ?? '',
        subItems: [],
      };
      const t = templateForLine(line);
      return {
        ...line,
        key: line.key || t.key,
        subItems: seedSubItems(t, li.subItems ?? []),
      };
    }),
    taxRate: String(q.taxRate ?? DEFAULT_TAX_RATE),
    ...advanceFrom(q.advancePercentage ?? DEFAULT_ADVANCE),
    notes: q.notes ?? '',
    siteVisit: Boolean(q.siteVisitSuggested),
  };
}

/** The form for this enquiry: the saved quote if there is one, else a fresh one. */
export function initialForm(request: QuoteRequestDTO): QuoteForm {
  return request.myQuotation
    ? formFromQuotation(request.myQuotation)
    : formForRequest(request.categories ?? []);
}

/** What can be done with this enquiry. */
export function modeOf(request: QuoteRequestDTO): QuoteMode {
  const q = request.myQuotation;
  if (q) {
    if (q.status === 'draft') return 'draft';
    if (q.status === 'sent' || q.status === 'updated') return 'sent';
    if (q.status === 'superseded') return 'sent';
    return 'readonly';
  }
  return request.status === 'accepted' ||
    request.status === 'closed' ||
    request.status === 'cancelled'
    ? 'readonly'
    : 'new';
}

/** The banner above the form, if any. */
export function bannerFor(request: QuoteRequestDTO): string | null {
  const q = request.myQuotation;
  if (q) return COPY.banner[q.status] ?? null;
  return modeOf(request) === 'readonly' ? COPY.banner.closed : null;
}

/** A line goes out when it is named and — unless it is a draft — priced. */
function sendsLine(line: LineForm, asDraft: boolean): boolean {
  return Boolean(line.title.trim()) && (asDraft || lineAmount(line) > 0);
}

/** Services that will be left out of a sent quote (no price). */
export function droppedCount(form: QuoteForm): number {
  return form.lines.filter(l => !sendsLine(l, false)).length;
}

function lineBody(line: LineForm): QuoteLineBody {
  const subItems = line.subItems
    .map(s => ({ label: s.label.trim(), value: s.value.trim() }))
    .filter(s => s.label && s.value)
    .map(s => ({
      label: s.label.slice(0, LIMITS.subItem),
      value: s.value.slice(0, LIMITS.subItem),
    }));
  const body: QuoteLineBody = {
    title: line.title.trim().slice(0, LIMITS.title),
    price: lineAmount(line),
  };
  const key = line.key.trim().slice(0, LIMITS.key);
  if (key) body.key = key;
  const subtitle = line.subtitle.trim();
  if (subtitle) body.subtitle = subtitle.slice(0, LIMITS.subtitle);
  const note = line.note.trim();
  if (note) body.note = note.slice(0, LIMITS.note);
  if (subItems.length) body.subItems = subItems;
  return body;
}

/**
 * The request body for respond / updateQuotation. Every field is sent, so an
 * update can clear the notes or the site visit, and the server never falls
 * back to a default the organizer did not see (blank tax is sent as 0).
 */
export function buildBody(form: QuoteForm, asDraft: boolean): QuoteBody {
  return {
    lineItems: form.lines.filter(l => sendsLine(l, asDraft)).map(lineBody),
    taxRate: taxPercent(form),
    notes: form.notes.trim().slice(0, LIMITS.notes),
    advancePercentage: advancePercent(form),
    siteVisitSuggested: form.siteVisit,
    asDraft,
  };
}

function percentError(text: string, required: boolean): string | undefined {
  if (!text.trim()) return required ? COPY.percentRange : undefined;
  const n = Number(text);
  if (!Number.isFinite(n) || n < 0 || n > LIMITS.percentMax)
    return COPY.percentRange;
  return undefined;
}

/** Problems that stop a save; an empty `lines` map and no keys means none. */
export function validate(form: QuoteForm, asDraft: boolean): QuoteErrors {
  const errors: QuoteErrors = { lines: {} };
  for (const line of form.lines) {
    const title = line.title.trim();
    if (!title && lineAmount(line) > 0) errors.lines[line.uid] = COPY.needTitle;
    else if (title.length > LIMITS.title)
      errors.lines[line.uid] = COPY.titleTooLong;
    else if (line.note.trim().length > LIMITS.note)
      errors.lines[line.uid] = COPY.noteTooLong;
  }
  const tax = percentError(form.taxRate, false);
  if (tax) errors.taxRate = tax;
  const advance = percentError(
    form.advanceChoice === 'custom' ? form.advanceCustom : '0',
    true,
  );
  if (advance) errors.advance = advance;
  if (form.notes.trim().length > LIMITS.notes) errors.notes = COPY.notesTooLong;
  if (!asDraft && !form.lines.some(l => sendsLine(l, false)))
    errors.form = COPY.needPrice;
  return errors;
}

export function hasErrors(errors: QuoteErrors): boolean {
  return (
    Object.keys(errors.lines).length > 0 ||
    Boolean(errors.taxRate || errors.advance || errors.notes || errors.form)
  );
}

/** A comparable snapshot of the form, local ids left out. */
function snapshot(form: QuoteForm): string {
  return JSON.stringify({
    ...form,
    lines: form.lines.map(({ uid: _uid, ...rest }) => rest),
  });
}

export function isDirty(baseline: QuoteForm | null, form: QuoteForm | null) {
  if (!baseline || !form) return false;
  return snapshot(baseline) !== snapshot(form);
}

// ---- Display -------------------------------------------------------------------

export function summaryFor(r: QuoteRequestDTO): EnquirySummary {
  const facts = [
    r.when ? { icon: 'calendar-blank-outline', text: r.when } : null,
    r.where ? { icon: 'map-marker-outline', text: r.where } : null,
    r.guests
      ? { icon: 'account-group-outline', text: COPY.guests(r.guests) }
      : null,
    r.budget ? { icon: 'wallet-outline', text: COPY.budget(r.budget) } : null,
  ].filter((f): f is { icon: string; text: string } => f !== null);
  return {
    title: r.customerName || r.occasion || 'Enquiry',
    occasion: r.customerName ? r.occasion : '',
    facts,
    categories: r.categories ?? [],
    ideas: (r.ideas ?? '').trim(),
  };
}

/** The lines the customer will see, as they will read them. */
export function previewLines(form: QuoteForm): PreviewLine[] {
  return form.lines
    .filter(l => sendsLine(l, false))
    .map(l => {
      const t = templateForLine(l);
      const derived = derivedPrice(l);
      const details = l.subItems
        .filter(s => s.value.trim())
        .map(s => `${s.label}: ${s.value.trim()}`);
      if (derived && t.derivePrice) {
        const [a, b] = t.derivePrice;
        details.unshift(
          COPY.plateMaths(
            subItemValue(l, a),
            formatInr(toNumber(subItemValue(l, b))),
          ),
        );
      }
      return {
        uid: l.uid,
        icon: t.icon,
        title: l.title.trim(),
        amount: formatInr(lineAmount(l)),
        details,
        note: l.note.trim(),
      };
    });
}

/** Whether a template's derived price is in effect for this line. */
export function usesDerivedPrice(line: LineForm): boolean {
  const d = derivedPrice(line);
  return d !== null && d > 0;
}

/** The API's error message, which Nest sends as a list for validation errors. */
export function errorText(error: unknown, fallback: string): string {
  const message = (error as { message?: unknown } | null)?.message;
  if (Array.isArray(message)) return message.join('\n') || fallback;
  return typeof message === 'string' && message ? message : fallback;
}

export function isPreset(choice: AdvanceChoice): choice is 20 | 30 | 50 {
  return choice !== 'custom';
}
