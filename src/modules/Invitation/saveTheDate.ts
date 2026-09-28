import type { CardColourDTO, InvitationSubEventDTO } from './types';

/**
 * Save-the-Date helpers for the customer's review of the invitation.
 *
 * The API decides which cards reach whom; these only shape what has already
 * arrived. Nothing here filters by guest — that answer is the server's, and a
 * second copy of it on the client would be one that could disagree.
 */

/** `2026-10-09` → `Friday`; '' or malformed → ''. */
export function dayOfWeek(day: string): string {
  if (!day) return '';
  const d = new Date(`${day}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { weekday: 'long' });
}

/** `2026-10-09` → `9 October 2026`; '' or malformed → ''. */
export function cardDate(day: string): string {
  if (!day) return '';
  const d = new Date(`${day}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** `18:00` → `6:00 PM`; anything unparseable comes back as it went in. */
export function clockLabel(time: string): string {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time ?? '');
  if (!match) return time ?? '';
  const hour = Number(match[1]);
  const suffix = hour < 12 ? 'AM' : 'PM';
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}:${match[2]} ${suffix}`;
}

export interface CardTone {
  wash: string;
  ink: string;
}

/**
 * A card's colours: its own palette entry when the organizer picked one, and a
 * quiet default otherwise.
 *
 * Resolved against the palette the API served rather than a local table, so a
 * colour the server does not offer cannot be rendered even if it reached here.
 */
export function cardTone(
  colourId: string,
  palette: CardColourDTO[] | undefined,
  fallbackInk: string,
): CardTone {
  const picked = (palette ?? []).find((c) => c.id === colourId);
  if (picked) return { wash: picked.wash, ink: picked.ink };
  return { wash: '#ffffff', ink: fallbackInk };
}

/** Venue name and address, without repeating one that is also the other. */
export function venueOf(sub: InvitationSubEventDTO): string {
  return [sub.venueName, sub.venueAddress]
    .filter((v, i, all) => v && all.indexOf(v) === i)
    .join(', ');
}
