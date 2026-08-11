import { CATEGORY_ICON_NAME, DEFAULT_OCCASION_ICON, OCCASION_ICON_NAME } from './constants';
import type { NormalizedApiError } from '../../services/errors';
import type {
  PlanCategoryDTO,
  PlanDraft,
  PlanOccasionDTO,
  PlanStepDTO,
  PlanUpsertDTO,
} from './types';

export interface OccasionOption extends PlanOccasionDTO {
  icon: string;
}

export interface CategoryOption extends PlanCategoryDTO {
  iconName: string;
}

export function mapOccasions(dtos: PlanOccasionDTO[]): OccasionOption[] {
  return dtos.map((o) => ({ ...o, icon: OCCASION_ICON_NAME[o.id] ?? DEFAULT_OCCASION_ICON }));
}

export function mapCategories(dtos: PlanCategoryDTO[]): CategoryOption[] {
  return dtos.map((c) => ({ ...c, iconName: CATEGORY_ICON_NAME[c.icon] ?? 'checkbox-blank-circle-outline' }));
}

const REVIEW_FALLBACK: PlanStepDTO = {
  id: 'review',
  label: 'Review',
  heading: 'Review & submit',
  subtitle: 'Check everything looks right, then submit your plan and request a quote. You can go back and edit any step.',
};

/** Guarantees a Review step exists even if the CMS config predates it. */
export function ensureReviewStep(steps: PlanStepDTO[]): PlanStepDTO[] {
  return steps.some((s) => s.id === 'review') ? steps : [...steps, REVIEW_FALLBACK];
}

export interface StepIndices {
  detailsIndex: number;
  categoriesIndex: number;
  organizersIndex: number;
  reviewIndex: number;
}

/**
 * Resolves step indices dynamically instead of hardcoding them (web hardcodes
 * `onEdit(1)`/`onEdit(2)` in ReviewStep.tsx, which silently breaks if the CMS
 * ever reorders steps — we avoid reproducing that).
 */
export function resolveStepIndices(steps: PlanStepDTO[]): StepIndices {
  const organizersIndex = steps.findIndex((s) => s.id === 'organizers');
  const reviewIndex = steps.findIndex((s) => s.id === 'review');
  const categoriesIndex = steps.findIndex((s, i) => i !== 0 && i !== organizersIndex && i !== reviewIndex);
  return { detailsIndex: 0, categoriesIndex, organizersIndex, reviewIndex };
}

/** Maps the client draft to the persistence payload — matches web's draftToUpsert exactly. */
export function draftToUpsert(draft: PlanDraft): PlanUpsertDTO {
  return {
    occasion: draft.occasionId,
    eventDate: draft.eventDate || undefined,
    city: draft.city,
    area: draft.area,
    guests: draft.guests,
    budget: draft.budget,
    ideas: draft.ideas,
    categories: draft.categories,
  };
}

/** True once the user has entered anything worth persisting — gates autosave. */
export function isMeaningful(draft: PlanDraft): boolean {
  return Boolean(draft.city || draft.area || draft.guests || draft.budget || draft.ideas || draft.categories.length);
}

/** Per-step gate for advancing: returns a reason string when the step is incomplete. */
export function blockReasonFor(step: number, indices: StepIndices, draft: PlanDraft): string | undefined {
  if (step === indices.detailsIndex) {
    if (!draft.city.trim()) return 'Add your event city to continue.';
    if (!draft.guests) return 'Choose a guest count to continue.';
  }
  if (step === indices.categoriesIndex && draft.categories.length === 0) {
    return 'Pick at least one service to continue.';
  }
  return undefined;
}

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatEventDate(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function locationLabel(area: string, city: string, fallback: string): string {
  return [area, city].filter(Boolean).join(', ') || fallback;
}

/** Falls back to the raw id for custom, user-typed categories (which have no matching preset). */
export function categoryTitles(ids: string[], categories: PlanCategoryDTO[]): string[] {
  return ids.map((id) => categories.find((c) => c.id === id)?.title ?? id).filter(Boolean);
}

/** Parses a rating filter label like "4.5+" into a numeric threshold. Robust to any CMS-provided ratings list. */
export function ratingThreshold(label: string): number | undefined {
  const n = Number.parseFloat(label);
  return Number.isNaN(n) ? undefined : n;
}

/** Splits the budget banner into a bold lead sentence + rest, matching web's renderBanner(). */
export function splitBannerSentence(text: string): { bold: string; rest: string } {
  const idx = text.indexOf('. ');
  if (idx === -1) return { bold: '', rest: text };
  return { bold: text.slice(0, idx + 1), rest: text.slice(idx + 1) };
}

/** Pulls the real server detail out of a normalized API error, matching web's ReviewStep detailOf(). */
export function detailOf(err: NormalizedApiError | null): string {
  if (!err) return '';
  const parts: string[] = [];
  if (err.message) parts.push(err.message);
  if (err.status) parts.push(`(${err.status})`);
  return parts.join(' ');
}
