import { usePlanScreenData } from '../Plan/hooks';
import { setHeroDraftField, selectHeroDraft } from '../../store/heroDraftSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { USE_TYPED_AREA_PREFIX } from './constants';
import { PickerScreen } from './PickerScreen';
import type { PickerOption } from './types';

/**
 * Where the event is.
 *
 * The list is the plan wizard's city options — the same cities the brief is
 * matched against — and anything typed is accepted on top of them. An Indian
 * locality is not reliably in any list ("Patrika Nagar" is a real place a real
 * event happens in), and a picker that refuses what someone typed sends them
 * back to a city that is not where their event is.
 */
export function AreaPickerScreen() {
  const dispatch = useAppDispatch();
  const draft = useAppSelector(selectHeroDraft);
  const { data } = usePlanScreenData();

  const options: PickerOption[] = (data?.cityOptions ?? []).map(city => ({
    label: city,
    value: city,
  }));

  return (
    <PickerScreen
      kind="area"
      options={options}
      selected={draft.where}
      onPick={option =>
        dispatch(setHeroDraftField({ field: 'where', value: option.value }))
      }
      allowTyped={query => ({
        label: `${USE_TYPED_AREA_PREFIX} “${query}”`,
        value: query,
        // Remembered as the place, not as the prompt that offered it.
        rememberAs: query,
      })}
    />
  );
}

export default AreaPickerScreen;
