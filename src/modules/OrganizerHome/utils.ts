const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** `2026-08-12` → `12,34,567`-style Indian grouping, without relying on Hermes' Intl/ICU data. */
export function formatInr(value: number | null | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
  const negative = value < 0;
  const digits = Math.round(Math.abs(value)).toString();
  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3);
  const grouped = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3 : last3;
  return `${negative ? '-' : ''}₹${grouped}`;
}

/** `Today` for the current date, otherwise a short weekday (`Sat`). Compares by UTC day. */
export function dayLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const now = new Date();
  const sameDay = d.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
  return sameDay ? 'Today' : WEEKDAYS[d.getUTCDay()];
}

/** `2m ago` / `3h ago` / `4d ago` / falls back to a short date beyond a week. */
export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const mins = Math.floor((Date.now() - then) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const d = new Date(then);
  return `${d.getUTCDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()]}`;
}

export function enquiryLabel(r: { customerName: string; occasion: string; where: string }): string {
  return r.customerName ? `${r.customerName} · ${r.occasion || 'Event'}` : [r.occasion || 'Event', r.where].filter(Boolean).join(' · ');
}

export function categoriesLabel(count: number): string {
  return `${count} ${count === 1 ? 'category' : 'categories'}`;
}
