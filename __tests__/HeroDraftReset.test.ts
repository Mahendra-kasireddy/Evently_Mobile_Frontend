import reducer, {
  resetHeroDraft,
  seedHeroDraft,
  setHeroDraftField,
  setShareBudget,
} from '../src/store/heroDraftSlice';

describe('the Home brief after it is sent', () => {
  it('starts over with fresh defaults, budget switched off', () => {
    let state = reducer(
      undefined,
      seedHeroDraft({ when: '2026-10-09', guests: '100' }),
    );
    state = reducer(
      state,
      setHeroDraftField({ field: 'occasion', value: 'Birthday' }),
    );
    state = reducer(
      state,
      setHeroDraftField({ field: 'where', value: 'Hyderabad' }),
    );
    state = reducer(
      state,
      setHeroDraftField({ field: 'guests', value: '300' }),
    );
    state = reducer(state, setShareBudget(true));
    state = reducer(
      state,
      setHeroDraftField({ field: 'budget', value: '₹2L–₹5L' }),
    );

    // What the container does once the server confirms the request.
    state = reducer(state, resetHeroDraft());
    state = reducer(
      state,
      seedHeroDraft({ when: '2026-10-10', guests: '100' }),
    );

    expect(state).toMatchObject({
      occasion: '',
      where: '',
      when: '2026-10-10',
      guests: '100',
      budget: '',
      shareBudget: false,
      isSeeded: true,
    });
  });
});
