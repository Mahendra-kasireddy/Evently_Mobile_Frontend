/** Organizer-wide formatters, shared by every organizer screen. */

/** "₹1,25,000" — Indian grouping, whole rupees. */
export function formatInr(amount: number | null | undefined): string {
  const value = Number.isFinite(amount) ? Math.round(amount as number) : 0;
  return `₹${value.toLocaleString('en-IN')}`;
}

/** "₹1.2L", "₹45K" — for tight tiles. */
export function formatInrCompact(amount: number | null | undefined): string {
  const value = Number.isFinite(amount) ? (amount as number) : 0;
  if (value >= 1_00_00_000) return `₹${trim(value / 1_00_00_000)}Cr`;
  if (value >= 1_00_000) return `₹${trim(value / 1_00_000)}L`;
  if (value >= 1_000) return `₹${trim(value / 1_000)}K`;
  return `₹${Math.round(value)}`;
}

function trim(n: number): string {
  return n >= 10 ? String(Math.round(n)) : n.toFixed(1).replace(/\.0$/, '');
}

/** The parts of a date for a date tile: { day: '14', month: 'NOV', weekday: 'Fri' }. */
export function dateParts(iso: string | null | undefined): {
  day: string;
  month: string;
  weekday: string;
} | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return {
    day: String(date.getDate()),
    month: date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase(),
    weekday: date.toLocaleDateString('en-GB', { weekday: 'short' }),
  };
}

/** "Today", "Tomorrow", or "Fri, 14 Nov". */
export function relativeDay(
  iso: string | null | undefined,
  now = new Date(),
): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const start = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((start(date) - start(now)) / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}
