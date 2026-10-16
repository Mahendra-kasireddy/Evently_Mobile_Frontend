import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppHeader,
  AppText,
  EventlyIcon,
  GradientFill,
} from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme';
import {
  EDIT_PROFILE_COPY as EDIT,
  PREF_TOGGLES,
  SETTINGS_ACCENT,
  SETTINGS_COPY as COPY,
} from './constants';
import { useSettingsContainer } from './container';
import { initialsOf } from './utils';
import { styles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const AVATAR_GRADIENT: [string, string] = ['#ff8a5c', '#7c5cdb'];

/**
 * Settings — how the app behaves for this account: what it tells you about,
 * and closing the account. Your name, email, city and photo are edited on
 * their own screen (Edit profile), which the top row opens.
 */
export function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const {
    user,
    photoUrl,
    prefs,
    prefsLoading,
    prefError,
    togglePref,
    closing,
    closeError,
    closeAccount,
    refetch,
  } = useSettingsContainer();
  const [failedUrl, setFailedUrl] = useState('');
  const showPhoto = !!photoUrl && failedUrl !== photoUrl;

  const confirmClose = () =>
    Alert.alert(COPY.closeTitle, COPY.closeBody, [
      { text: COPY.closeCancel, style: 'cancel' },
      { text: COPY.closeConfirm, style: 'destructive', onPress: closeAccount },
    ]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title={COPY.title} compact />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
      >
        {/* Profile — one row into its own screen. */}
        <TouchableOpacity
          style={styles.profileRow}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('EditProfile')}
          accessibilityRole="button"
          accessibilityLabel={EDIT.title}
          testID="settings-edit-profile"
        >
          <View style={styles.rowAvatar}>
            {showPhoto ? (
              <Image
                source={{ uri: photoUrl }}
                style={styles.avatarImage}
                onError={() => setFailedUrl(photoUrl)}
              />
            ) : (
              <>
                <GradientFill colors={AVATAR_GRADIENT} direction="diagonal" />
                <AppText style={styles.rowAvatarText}>
                  {initialsOf(user?.name ?? '')}
                </AppText>
              </>
            )}
          </View>
          <View style={styles.rowText}>
            <AppText style={styles.rowTitle} numberOfLines={1}>
              {user?.name || EDIT.noName}
            </AppText>
            <AppText variant="caption" style={styles.rowSub} numberOfLines={1}>
              {EDIT.rowSubtitle}
            </AppText>
          </View>
          <EventlyIcon
            name="chevron-right"
            size={22}
            color={colors.textMuted}
          />
        </TouchableOpacity>

        {/* Notifications */}
        <AppText
          variant="overline"
          style={[styles.sectionTitle, styles.sectionGap]}
        >
          {COPY.notificationsSection}
        </AppText>
        <View style={styles.card}>
          {!prefs && prefsLoading ? (
            <ActivityIndicator
              color={SETTINGS_ACCENT}
              style={styles.prefsLoading}
            />
          ) : (
            PREF_TOGGLES.map((t, i) => (
              <View
                key={t.key}
                style={[styles.prefRow, i > 0 && styles.prefRowBorder]}
              >
                <View style={styles.rowText}>
                  <AppText style={styles.prefTitle}>{t.title}</AppText>
                  <AppText variant="caption" style={styles.rowSub}>
                    {t.subtitle}
                  </AppText>
                </View>
                <Switch
                  value={!!prefs?.[t.key]}
                  onValueChange={v => togglePref(t.key, v)}
                  disabled={!prefs}
                  trackColor={{ false: '#e3dfdc', true: '#f7a988' }}
                  thumbColor={prefs?.[t.key] ? SETTINGS_ACCENT : '#ffffff'}
                  accessibilityLabel={t.title}
                />
              </View>
            ))
          )}
        </View>
        <AppText variant="caption" style={styles.sectionNote}>
          {COPY.notificationsNote}
        </AppText>
        {prefError ? (
          <AppText variant="caption" style={styles.saveError}>
            {COPY.prefSaveError}
          </AppText>
        ) : null}

        {/* Account */}
        <AppText
          variant="overline"
          style={[styles.sectionTitle, styles.sectionGap]}
        >
          {COPY.dangerSection}
        </AppText>
        <TouchableOpacity
          style={styles.dangerRow}
          activeOpacity={0.85}
          onPress={confirmClose}
          disabled={closing}
          accessibilityRole="button"
          accessibilityLabel={COPY.closeAccount}
          testID="settings-close-account"
        >
          <View style={styles.dangerIcon}>
            <EventlyIcon
              name="account-remove-outline"
              size={18}
              color="#d93b3b"
            />
          </View>
          <View style={styles.rowText}>
            <AppText style={styles.dangerTitle}>{COPY.closeAccount}</AppText>
            <AppText variant="caption" style={styles.rowSub}>
              {COPY.closeHint}
            </AppText>
          </View>
          {closing ? <ActivityIndicator color="#d93b3b" /> : null}
        </TouchableOpacity>
        {closeError ? (
          <AppText variant="caption" style={styles.saveError}>
            {COPY.closeError}
          </AppText>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

export default SettingsScreen;
