import { StatusBar } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../Components';
import { HOME_PAPER } from '../../modules/Home/design';
import type { RootStackParamList } from '../../navigation/types';
import { EmbeddedWebPage } from './sections/EmbeddedWebPage';
import { shellStyles as s } from './styles';

type Route = RouteProp<RootStackParamList, 'OrganizerWebPage'>;

/**
 * An organizer screen that is not native yet: its web page under the app's own
 * header and back arrow. Retired screen by screen as each is rebuilt natively.
 */
export function OrganizerWebPageScreen() {
  const { path, title } = useRoute<Route>().params;
  return (
    <SafeAreaView style={s.screen} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={HOME_PAPER.canvas} />
      <AppHeader title={title} />
      <EmbeddedWebPage path={path} mode="page" />
    </SafeAreaView>
  );
}

export default OrganizerWebPageScreen;
