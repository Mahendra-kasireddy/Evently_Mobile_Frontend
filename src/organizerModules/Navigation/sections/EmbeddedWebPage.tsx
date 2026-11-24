import { View } from 'react-native';
import { BusinessWebView } from '../../../modules/BusinessHome';
import { shellStyles as s } from '../styles';

/**
 * One page of the web organizer dashboard inside a native screen. The page is
 * told it is embedded, so it drops its own app bar and bottom tabs and the
 * native ones show instead. Sign-out, session refresh and role switches still
 * come back through BusinessWebView's bridge.
 */
export function EmbeddedWebPage({
  path,
  mode,
}: {
  path: string;
  /** 'tab' under the tab bar, 'page' under a native header with a back arrow. */
  mode: 'tab' | 'page';
}) {
  return (
    <View style={s.web}>
      <BusinessWebView role="organizer" path={path} embedded={mode} />
    </View>
  );
}

export default EmbeddedWebPage;
