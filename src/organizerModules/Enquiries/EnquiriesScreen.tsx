import type { ReactNode } from 'react';
import { FlatList, RefreshControl, StatusBar, View } from 'react-native';
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
import { ENQUIRIES_COPY as COPY } from './constants';
import { useEnquiriesContainer } from './container';
import { ORG_ACCENT, ORG_ORB_COLORS, ORG_PAPER } from './design';
import { EmptyState } from './sections/EmptyState';
import { EnquiryCard } from './sections/EnquiryCard';
import { Toolbar } from './sections/Toolbar';
import { styles as s } from './styles';
import type { EnquiryItem } from './types';

/**
 * The organizer's enquiries — the web's Inbox and Quote builder as one list.
 *
 * Chips say where each enquiry is (New, Drafts, Sent, Confirmed, Closed) with a
 * count; search narrows by name, occasion, place or service. Each card has one
 * action, and the whole card opens the quote for that enquiry.
 */
export function EnquiriesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const e = useEnquiriesContainer();

  const open = (item: EnquiryItem) =>
    navigation.navigate('OrganizerQuote', { requestId: item.id });

  const frame = (body: ReactNode) => (
    <SafeAreaView style={s.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={ORG_PAPER.canvas} />
      <OrganizerTopBar title={COPY.title} />
      {body}
    </SafeAreaView>
  );

  if (e.isLoading) {
    return frame(
      <View style={s.centered}>
        <ThinkingOrbs size={56} colors={ORG_ORB_COLORS} label={COPY.loading} />
        <AppText variant="body" style={s.muted}>
          {COPY.loading}
        </AppText>
      </View>,
    );
  }

  if (e.errorMessage) {
    return frame(
      <View style={s.centered}>
        <AppText variant="h3" style={s.title}>
          {COPY.error}
        </AppText>
        <AppText variant="body" style={s.muted}>
          {e.errorMessage}
        </AppText>
        <EventlyButton
          title={COPY.retry}
          onPress={e.refresh}
          accentColor={ORG_ACCENT.saffron}
        />
      </View>,
    );
  }

  return frame(
    <FlatList
      data={e.items}
      keyExtractor={item => item.id}
      contentContainerStyle={s.list}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <Toolbar
          chips={e.chips}
          filter={e.filter}
          onFilter={e.setFilter}
          query={e.query}
          onQuery={e.setQuery}
          showNotice={e.filter === 'new' && e.items.length > 0}
        />
      }
      ListHeaderComponentStyle={s.listHeader}
      ListEmptyComponent={
        <EmptyState
          filter={e.filter}
          query={e.query}
          onClearSearch={() => e.setQuery('')}
        />
      }
      renderItem={({ item, index }) => (
        <FadeInUp delay={Math.min(index, 6) * 50}>
          <EnquiryCard item={item} onOpen={() => open(item)} />
        </FadeInUp>
      )}
      refreshControl={
        <RefreshControl
          refreshing={e.isRefreshing}
          onRefresh={e.refresh}
          tintColor={ORG_ACCENT.saffron}
          colors={[ORG_ACCENT.saffron]}
        />
      }
    />,
  );
}

export default EnquiriesScreen;
