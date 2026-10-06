/**
 * The business portals the app renders from the web dashboard. Named by the
 * backend role ('vendor'), not the product word ('sub-vendor').
 */
export type BusinessRole = 'organizer' | 'vendor';

/**
 * Messages the web dashboard posts to the app.
 *
 * Mirrors `AppMessage` in evently-FrontEnd/src/lib/native/bridge.ts — change
 * the two together.
 */
export type AppMessage =
  | { type: 'logout' }
  | { type: 'sessionExpired' }
  | { type: 'session'; token: string; refreshToken: string }
  | { type: 'switchRole'; role: 'customer' | 'organizer' | 'vendor' };
