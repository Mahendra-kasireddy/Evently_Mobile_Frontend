import type { LegalSupportItem } from './types';

export const SUPPORT_EMAIL = 'support@evently.com';

// Mirrors the web app's footer "Company" column — none of these have real
// content/backend yet there either (all dead `href="#"` links); Contact Us
// is the one item with a real, working action (mailto).
export const LEGAL_SUPPORT_ITEMS: LegalSupportItem[] = [
  { key: 'contact', icon: 'email-outline', label: 'Contact Us', action: 'contact' },
  { key: 'privacy', icon: 'shield-lock-outline', label: 'Privacy Policy', action: 'placeholder' },
  { key: 'refund', icon: 'cash-refund', label: 'Refund Policy', action: 'placeholder' },
  { key: 'terms', icon: 'gavel', label: 'Terms & Conditions', action: 'placeholder' },
  { key: 'blog', icon: 'book-open-outline', label: 'Blog', action: 'placeholder' },
  { key: 'resources', icon: 'lightbulb-outline', label: 'Resources', action: 'placeholder' },
];
