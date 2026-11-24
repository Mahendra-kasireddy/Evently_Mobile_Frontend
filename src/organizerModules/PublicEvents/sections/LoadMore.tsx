import { PUBLIC_EVENTS_COPY as COPY } from '../constants';
import { ActionButton } from './ActionButton';

/** The next page, on request. */
export function LoadMore({
  loading,
  onPress,
}: {
  loading: boolean;
  onPress: () => void;
}) {
  return (
    <ActionButton
      title={loading ? COPY.loadingMore : COPY.loadMore}
      icon="chevron-down"
      kind="ghost"
      loading={loading}
      onPress={onPress}
    />
  );
}

export default LoadMore;
