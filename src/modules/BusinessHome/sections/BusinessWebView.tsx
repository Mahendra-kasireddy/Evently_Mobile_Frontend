import { type ComponentRef, useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Linking, Platform, View } from 'react-native';
import { WebView, type WebViewMessageEvent, type WebViewNavigation } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';
import { EventlyButton, EventlyText } from '../../../Components';
import { decodeJwtRoles, isJwtFresh } from '../../../services/jwt';
import { refreshSession } from '../../../services/sessionRefresh';
import {
  clearSession,
  selectAuthToken,
  setActiveView,
  setSession,
  toAppView,
} from '../../../store/authSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { brand } from '../../../theme';
import {
  APP_USER_AGENT,
  BUSINESS_HOME_COPY as COPY,
  CUSTOMER_PATHS,
  MAX_SESSION_RETRIES,
  SESSION_RETRY_WINDOW_MS,
  WEB_LOGIN_PATH,
} from '../constants';
import { logoutOnServer } from '../services';
import { styles } from '../styles';
import type { BusinessRole } from '../types';
import { buildInjectedScript, isWebAppUrl, parseAppMessage, webPathOf, webUrl } from '../utils';

/**
 * Last page shown per portal, for this run of the app. A remount — a session
 * refresh, or the screen being rebuilt — reopens where the person was rather
 * than throwing them back to the dashboard's first page.
 */
const lastUrlByRole: Partial<Record<BusinessRole, string>> = {};

export function resumeUrlFor(role: BusinessRole): string | undefined {
  return lastUrlByRole[role];
}

function forgetResumeUrls(): void {
  delete lastUrlByRole.organizer;
  delete lastUrlByRole.vendor;
}

interface BusinessWebViewProps {
  /** The portal being shown. A session that gains this role makes it the active view. */
  role: BusinessRole;
  /** Path on the web app ("/organizer/home") or an absolute web-app URL to open. */
  path: string;
}

/**
 * The web dashboard, signed in with the app's session.
 *
 * The app owns the session: it holds the only refresh token, and the page
 * gets just the access token, written into its storage before its scripts
 * run. Everything the page cannot do for itself comes back as a message —
 * see `AppMessage` — and is handled here.
 */
export function BusinessWebView({ role, path }: BusinessWebViewProps) {
  const dispatch = useAppDispatch();
  const storeToken = useAppSelector(selectAuthToken);
  const storeTokenRef = useRef(storeToken);
  storeTokenRef.current = storeToken;

  const webRef = useRef<ComponentRef<typeof WebView>>(null);
  /** The token baked into the page currently loaded. */
  const [pageToken, setPageToken] = useState<string | null>(null);
  /** Bumped to remount the WebView — the only way to re-run the boot script with a new token. */
  const [generation, setGeneration] = useState(0);
  const [startUrl, setStartUrl] = useState(() => webUrl(path));
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const currentUrl = useRef(startUrl);
  const canGoBack = useRef(false);
  const expiries = useRef<number[]>([]);
  const loggingOut = useRef(false);

  // A token for the first load. The stored one may be minutes from expiry —
  // or long past it after the app sat in the background — so trade it in
  // first rather than letting the page boot, fail, and reload.
  useEffect(() => {
    let alive = true;
    const current = storeTokenRef.current;
    (current && isJwtFresh(current) ? Promise.resolve(current) : refreshSession()).then(token => {
      // null: the session is over and has been cleared; the navigator takes
      // the person back to sign-in and this screen unmounts.
      if (alive && token) setPageToken(token);
    });
    return () => {
      alive = false;
    };
  }, []);

  const remount = useCallback((token: string) => {
    setPageToken(token);
    setStartUrl(currentUrl.current);
    setFailed(false);
    setLoading(true);
    setGeneration(g => g + 1);
  }, []);

  /** The page's token was refused: renew it and reload the page with the new one. */
  const handleExpired = useCallback(() => {
    if (loggingOut.current) return;
    const now = Date.now();
    expiries.current = [...expiries.current.filter(t => now - t < SESSION_RETRY_WINDOW_MS), now];
    if (expiries.current.length > MAX_SESSION_RETRIES) {
      setFailed(true);
      return;
    }
    // The app may already hold a newer token than the page (it refreshed for
    // a native request); hand that over before spending the refresh token.
    const current = storeTokenRef.current;
    const renewed =
      current && current !== pageToken && isJwtFresh(current)
        ? Promise.resolve(current)
        : refreshSession();
    renewed.then(token => {
      if (token) remount(token);
    });
  }, [pageToken, remount]);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const msg = parseAppMessage(event.nativeEvent.data);
      if (!msg) return;
      switch (msg.type) {
        case 'logout':
          loggingOut.current = true;
          forgetResumeUrls();
          logoutOnServer()
            .catch(() => undefined)
            .finally(() => dispatch(clearSession()));
          return;
        case 'session':
          // The server reissued the pair (a business registration does), so
          // the refresh token the app held is dead — adopt the new one. The
          // page already has the access token; no reload needed.
          dispatch(setSession({ token: msg.token, refreshToken: msg.refreshToken }));
          setPageToken(msg.token);
          if (decodeJwtRoles(msg.token).includes(role)) dispatch(setActiveView(role));
          return;
        case 'switchRole':
          // The page has already made it the account's default on the server.
          forgetResumeUrls();
          dispatch(setActiveView(toAppView(msg.role)));
          return;
        case 'sessionExpired':
          handleExpired();
          return;
      }
    },
    [dispatch, handleExpired, role],
  );

  const handleNavigationChange = useCallback(
    (nav: WebViewNavigation) => {
      canGoBack.current = nav.canGoBack;
      const pagePath = webPathOf(nav.url);
      if (!pagePath) return;
      if (pagePath === WEB_LOGIN_PATH) {
        // The page did not see the app's session — the boot script lost a race
        // or the token was refused before the page could report it.
        handleExpired();
        return;
      }
      if (CUSTOMER_PATHS.includes(pagePath)) {
        // The web sends an account here only when its token lacks this
        // portal's role. That account belongs on the customer side.
        forgetResumeUrls();
        dispatch(setActiveView('customer'));
        return;
      }
      currentUrl.current = nav.url;
      lastUrlByRole[role] = nav.url;
    },
    [dispatch, handleExpired, role],
  );

  /** Keeps the dashboard in the WebView; anything off-site opens in the system browser or app. */
  const handleShouldStartLoad = useCallback((req: ShouldStartLoadRequest) => {
    const { url } = req;
    if (isWebAppUrl(url) || /^(about|blob|data):/i.test(url)) return true;
    // Embedded frames (a map, a video) load in place.
    if (req.isTopFrame === false) return true;
    Linking.openURL(url).catch(() => undefined);
    return false;
  }, []);

  // Android's back button walks the dashboard's own history first.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBack.current) return false;
      webRef.current?.goBack();
      return true;
    });
    return () => sub.remove();
  }, []);

  if (failed) {
    return (
      <View style={styles.center}>
        <EventlyText variant="h2" style={styles.errorTitle}>
          {COPY.errorTitle}
        </EventlyText>
        <EventlyText variant="body" style={styles.muted}>
          {COPY.errorBody}
        </EventlyText>
        <EventlyButton
          title={COPY.retry}
          accentColor={brand.accent}
          style={styles.retry}
          onPress={() => {
            expiries.current = [];
            const token = storeTokenRef.current ?? pageToken;
            if (token) remount(token);
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.web}>
      {pageToken ? (
        <WebView
          key={generation}
          ref={webRef}
          source={{ uri: startUrl }}
          style={styles.web}
          injectedJavaScriptBeforeContentLoaded={buildInjectedScript(pageToken, Platform.OS)}
          onMessage={handleMessage}
          onNavigationStateChange={handleNavigationChange}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
          onLoadEnd={() => setLoading(false)}
          onError={() => setFailed(true)}
          // The OS may kill a backgrounded page's process; bring it back.
          onContentProcessDidTerminate={() => webRef.current?.reload()}
          onRenderProcessGone={() => remount(pageToken)}
          applicationNameForUserAgent={APP_USER_AGENT}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          allowFileAccess
          allowsBackForwardNavigationGestures
          pullToRefreshEnabled
          setSupportMultipleWindows={false}
          webviewDebuggingEnabled={__DEV__}
        />
      ) : null}
      {loading ? (
        <View style={styles.overlay} pointerEvents="none">
          <ActivityIndicator size="large" color={brand.accent} />
          <EventlyText variant="body" style={styles.muted}>
            {COPY.loading}
          </EventlyText>
        </View>
      ) : null}
    </View>
  );
}

export default BusinessWebView;
