import { AppHeader } from '../../../Components';

/**
 * The header on an organizer tab: the app's standard header with the tab's
 * name and a back arrow. Back on a tab returns to Home (the tab navigator's
 * first tab), as on every other screen.
 */
export function OrganizerTopBar({ title }: { title: string }) {
  return <AppHeader title={title} />;
}

export default OrganizerTopBar;
