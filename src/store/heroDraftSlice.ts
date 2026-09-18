import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface HeroDraftState {
  occasion: string;
  /** ISO `YYYY-MM-DD`, or '' before the feed's default arrives. */
  when: string;
  where: string;
  guests: string;
  /**
   * A range from the server's list, sent only while `shareBudget` is on.
   *
   * Optional to the customer and optional on the wire: an organizer who knows
   * the budget quotes to it, which is worth having, but a customer who does
   * not want to anchor the price should not have to invent a number to get
   * past the form.
   */
  budget: string;
  shareBudget: boolean;
  /** True once the feed's defaults have seeded it, so they seed only once. */
  isSeeded: boolean;
}

/**
 * What the customer is assembling in Home's "tell us the basics" card.
 *
 * In the store rather than in Home's own state because two of the four fields
 * are edited on their own screens now: occasion and area each open a search
 * screen, and a picker that had to hand its answer back through navigation
 * params would have to know which screen pushed it. This way the picker
 * dispatches and whoever is showing the draft re-renders.
 *
 * Not persisted to disk. A draft is a few taps of intent, not work in
 * progress — the Plan wizard is what saves a plan, and restoring yesterday's
 * half-answered card would be presenting a stale event as the customer's own.
 */
/** The fields that hold text — everything but the two flags. */
export type HeroDraftTextField =
  | 'occasion'
  | 'when'
  | 'where'
  | 'guests'
  | 'budget';

const initialState: HeroDraftState = {
  occasion: '',
  when: '',
  where: '',
  guests: '',
  budget: '',
  shareBudget: false,
  isSeeded: false,
};

const heroDraftSlice = createSlice({
  name: 'heroDraft',
  initialState,
  reducers: {
    setHeroDraftField(
      state,
      action: PayloadAction<{ field: HeroDraftTextField; value: string }>,
    ) {
      const { field, value } = action.payload;
      state[field] = value;
    },

    /**
     * Turning sharing off clears the range rather than remembering it. A
     * budget kept behind an off switch is a value the customer believes they
     * withdrew, and the next brief would quietly carry it.
     */
    setShareBudget(state, action: PayloadAction<boolean>) {
      state.shareBudget = action.payload;
      if (!action.payload) state.budget = '';
    },
    /**
     * Seed from the feed, without overwriting anything the customer has
     * already chosen — the feed can arrive again on a refetch, and a refresh
     * that silently reset their date would be worse than no defaults at all.
     */
    seedHeroDraft(
      state,
      action: PayloadAction<Partial<Record<HeroDraftTextField, string>>>,
    ) {
      if (state.isSeeded) return;
      state.isSeeded = true;
      const seed = action.payload;
      for (const key of Object.keys(seed) as HeroDraftTextField[]) {
        const value = seed[key];
        if (!state[key] && value) state[key] = value;
      }
    },
    resetHeroDraft() {
      return initialState;
    },
  },
});

export const {
  setHeroDraftField,
  setShareBudget,
  seedHeroDraft,
  resetHeroDraft,
} = heroDraftSlice.actions;

export const selectHeroDraft = (state: {
  heroDraft: HeroDraftState;
}): HeroDraftState => state.heroDraft;

export default heroDraftSlice.reducer;
