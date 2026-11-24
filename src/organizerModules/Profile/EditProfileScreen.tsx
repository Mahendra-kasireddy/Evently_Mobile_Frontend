import { useEffect } from 'react';
import { Alert, Pressable, ScrollView, StatusBar, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppHeader,
  AppText,
  EventlyButton,
  EventlyIcon,
  KeyboardAvoider,
  ThinkingOrbs,
} from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import {
  BIO_MAX,
  BUSINESS_NAME_MAX,
  PROFILE_COPY as COPY,
  TAGLINE_MAX,
} from './constants';
import { useEditProfileContainer } from './container';
import { ORG_ACCENT, ORG_ORB_COLORS, ORG_PAPER } from './design';
import { FormField } from './sections/FormField';
import { editStyles as e, styles as s } from './styles';

/**
 * Edit business profile: the names, tagline and story customers read, and the
 * services offered. Only what changed is saved, and leaving with unsaved edits
 * asks first.
 */
export function EditProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const f = useEditProfileContainer();

  // Back with unsaved edits — arrow, swipe or Android back — asks first.
  useEffect(
    () =>
      navigation.addListener('beforeRemove', event => {
        if (!f.dirty || f.saving) return;
        event.preventDefault();
        Alert.alert(COPY.discardTitle, COPY.discardBody, [
          { text: COPY.keepEditing, style: 'cancel' },
          {
            text: COPY.discard,
            style: 'destructive',
            onPress: () => navigation.dispatch(event.data.action),
          },
        ]);
      }),
    [navigation, f.dirty, f.saving],
  );

  const onSave = () => {
    f.save().then(ok => {
      if (ok) navigation.goBack();
    });
  };

  const body = f.isLoading ? (
    <View style={s.centered}>
      <ThinkingOrbs size={56} colors={ORG_ORB_COLORS} label={COPY.loading} />
    </View>
  ) : f.errorMessage ? (
    <View style={s.centered}>
      <AppText variant="h3" style={s.title}>
        {COPY.error}
      </AppText>
      <AppText variant="body" style={s.muted}>
        {f.errorMessage}
      </AppText>
      <EventlyButton
        title={COPY.retry}
        onPress={f.retry}
        accentColor={ORG_ACCENT.saffron}
      />
    </View>
  ) : (
    <KeyboardAvoider style={s.container}>
      <ScrollView
        contentContainerStyle={e.content}
        keyboardShouldPersistTaps="handled"
      >
        <FormField
          label={COPY.businessName}
          value={f.form.businessName}
          onChangeText={v => f.setField('businessName', v)}
          placeholder={COPY.businessNamePh}
          max={BUSINESS_NAME_MAX}
          error={f.errors.businessName}
          autoCapitalize="words"
        />
        <FormField
          label={COPY.displayName}
          value={f.form.displayName}
          onChangeText={v => f.setField('displayName', v)}
          placeholder={COPY.displayNamePh}
          hint={COPY.displayNameHint}
          max={BUSINESS_NAME_MAX}
          error={f.errors.displayName}
          autoCapitalize="words"
        />
        <FormField
          label={COPY.tagline}
          value={f.form.tagline}
          onChangeText={v => f.setField('tagline', v)}
          placeholder={COPY.taglinePh}
          max={TAGLINE_MAX}
          error={f.errors.tagline}
        />
        <FormField
          label={COPY.about}
          value={f.form.businessDescription}
          onChangeText={v => f.setField('businessDescription', v)}
          placeholder={COPY.aboutPh}
          max={BIO_MAX}
          error={f.errors.businessDescription}
          multiline
        />

        {f.categories.length ? (
          <View style={e.field}>
            <AppText variant="bodySmall" style={e.label}>
              {COPY.services}
            </AppText>
            <AppText variant="caption" style={e.hint}>
              {COPY.servicesHint}
            </AppText>
            <View style={e.chips}>
              {f.categories.map(c => {
                const on = f.form.secondaryCategories.includes(c.key);
                return (
                  <Pressable
                    key={c.key}
                    style={[e.chip, on && e.chipOn]}
                    onPress={() => f.toggleCategory(c.key)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: on }}
                  >
                    {on ? (
                      <EventlyIcon name="check" size={14} color="#a8560f" />
                    ) : null}
                    <AppText
                      variant="bodySmall"
                      style={[e.chipText, on && e.chipTextOn]}
                    >
                      {c.label}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={e.footer}>
        {f.saveError ? (
          <AppText variant="caption" style={e.saveError}>
            {f.saveError}
          </AppText>
        ) : null}
        <EventlyButton
          title={f.saving ? COPY.saving : COPY.save}
          onPress={onSave}
          loading={f.saving}
          disabled={!f.dirty || f.saving}
          accentColor={ORG_ACCENT.saffron}
        />
      </SafeAreaView>
    </KeyboardAvoider>
  );

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={ORG_PAPER.canvas} />
      <AppHeader title={COPY.editTitle} />
      {body}
    </SafeAreaView>
  );
}

export default EditProfileScreen;
