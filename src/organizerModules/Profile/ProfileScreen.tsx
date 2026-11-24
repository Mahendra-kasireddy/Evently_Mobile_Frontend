import type { ReactNode } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppText,
  EventlyButton,
  FadeInUp,
  ThinkingOrbs,
} from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { OrganizerTopBar } from '../Navigation/sections/OrganizerTopBar';
import { MENU, PROFILE_COPY as COPY } from './constants';
import { useProfileContainer } from './container';
import { ORG_ACCENT, ORG_ORB_COLORS, ORG_PAPER } from './design';
import { IdentityCard } from './sections/IdentityCard';
import { MenuGroup } from './sections/MenuGroup';
import { WorkPhotos } from './sections/WorkPhotos';
import { styles as s } from './styles';
import type { ProfileAction } from './types';

/**
 * The organizer's Profile tab, laid out like the customer Profile: who they are
 * to customers on a gradient card, the photos of their work, and grouped rows
 * to everything about the business and the account.
 */
export function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const p = useProfileContainer();

  const go = (action: ProfileAction) => {
    switch (action) {
      case 'editProfile':
        return navigation.navigate('OrganizerEditProfile');
      case 'setup':
        return navigation.navigate('OrganizerSetup');
      case 'services':
        return navigation.navigate('OrganizerSetup', { step: 'services' });
      case 'bank':
        return navigation.navigate('OrganizerSetup', { step: 'bank' });
      case 'badges':
        return navigation.navigate('OrganizerBadges');
      case 'academy':
        return navigation.navigate('OrganizerAcademy');
      case 'coupons':
        return navigation.navigate('OrganizerCoupons');
      case 'subvendors':
        return navigation.navigate('OrganizerSubVendors');
      case 'notifications':
        return navigation.navigate('Notification');
      case 'switchCustomer':
        return p.switchToCustomer();
      case 'help':
        return navigation.navigate('LegalSupport');
      case 'signOut':
        return Alert.alert(
          'Log out?',
          'You can sign back in with your mobile number.',
          [
            { text: COPY.cancel, style: 'cancel' },
            { text: 'Log out', style: 'destructive', onPress: p.signOut },
          ],
        );
    }
  };

  const hintFor = (action: ProfileAction) =>
    action === 'switchCustomer' && p.switching
      ? COPY.switching
      : action === 'signOut' && p.signingOut
      ? COPY.signingOut
      : '';

  const frame = (body: ReactNode) => (
    <SafeAreaView style={s.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={ORG_PAPER.canvas} />
      <OrganizerTopBar title={COPY.title} />
      {body}
    </SafeAreaView>
  );

  if (p.isLoading) {
    return frame(
      <View style={s.centered}>
        <ThinkingOrbs size={56} colors={ORG_ORB_COLORS} label={COPY.loading} />
        <AppText variant="body" style={s.muted}>
          {COPY.loading}
        </AppText>
      </View>,
    );
  }

  if (p.errorMessage || !p.identity) {
    return frame(
      <View style={s.centered}>
        <AppText variant="h3" style={s.title}>
          {COPY.error}
        </AppText>
        {p.errorMessage ? (
          <AppText variant="body" style={s.muted}>
            {p.errorMessage}
          </AppText>
        ) : null}
        <EventlyButton
          title={COPY.retry}
          onPress={p.refresh}
          accentColor={ORG_ACCENT.saffron}
        />
      </View>,
    );
  }

  return frame(
    <ScrollView
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={p.refresh}
          tintColor={ORG_ACCENT.saffron}
          colors={[ORG_ACCENT.saffron]}
        />
      }
    >
      <FadeInUp>
        <IdentityCard
          identity={p.identity}
          uploading={p.uploading === 'photo'}
          onChangePhoto={p.changePhoto}
          onEdit={() => go('editProfile')}
        />
      </FadeInUp>

      {p.notice ? (
        <View style={s.notice}>
          <AppText variant="caption" style={s.noticeText}>
            {p.notice}
          </AppText>
        </View>
      ) : null}

      <FadeInUp delay={80}>
        <WorkPhotos
          images={p.gallery}
          full={p.galleryFull}
          uploading={p.uploading === 'gallery'}
          onAdd={p.addWorkPhoto}
          onRemove={p.removeWorkPhoto}
        />
      </FadeInUp>

      {MENU.map((group, index) => (
        <FadeInUp key={group.key} delay={80 * (index + 2)}>
          <MenuGroup group={group} hintFor={hintFor} onPress={go} />
        </FadeInUp>
      ))}
    </ScrollView>,
  );
}

export default ProfileScreen;
