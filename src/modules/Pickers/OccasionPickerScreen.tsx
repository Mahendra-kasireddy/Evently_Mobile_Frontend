import { useHomeFeed } from '../Home/hooks';
import { setHeroDraftField, selectHeroDraft } from '../../store/heroDraftSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { PickerScreen } from './PickerScreen';
import type { PickerOption } from './types';

/**
 * Which occasion the customer is planning.
 *
 * The list is the home feed's own occasion tiles, so the screen offers exactly
 * what the rest of Home does. List-only on purpose, unlike the area picker:
 * an occasion is matched against organizers' service categories server-side,
 * and a typed one would match nobody.
 */
export function OccasionPickerScreen() {
  const dispatch = useAppDispatch();
  const draft = useAppSelector(selectHeroDraft);
  const { data } = useHomeFeed();

  const options: PickerOption[] = (data?.occasions ?? []).map(occasion => ({
    label: occasion.label,
    value: occasion.label,
  }));

  return (
    <PickerScreen
      kind="occasion"
      options={options}
      selected={draft.occasion}
      onPick={option =>
        dispatch(setHeroDraftField({ field: 'occasion', value: option.value }))
      }
    />
  );
}

export default OccasionPickerScreen;
