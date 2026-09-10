import { apiClient } from '../../services/apiClient';
import { fetchGuests } from '../Invitation/services';
import { fetchIdeaBoard } from '../Workspace/services';
import { MY_BOOKINGS_ENDPOINT } from './constants';
import type { BookingDTO, EventExtras } from './types';

export async function fetchMyBookings(): Promise<BookingDTO[]> {
  const { data } = await apiClient.get<BookingDTO[]>(MY_BOOKINGS_ENDPOINT);
  return data;
}

const NO_EXTRAS: EventExtras = { ideas: null, guests: null };

/**
 * The two counts the "Jump to" tiles show, for one event.
 *
 * Both calls already exist — the guest list behind the invitation screen and
 * the board behind the workspace — so this composes them rather than adding
 * endpoints of its own.
 *
 * Neither failure is an error worth surfacing. An invitation still in the
 * organizer's draft has no guest list to fetch, and a board can be empty or
 * not yet open to this booking; in both cases the tile simply keeps its
 * wording. A screen that fell over because a count was missing would be worse
 * than one that says "Ready to share".
 */
export async function fetchEventExtras(bookingId: string | null): Promise<EventExtras> {
  if (!bookingId) return NO_EXTRAS;

  const [ideas, guests] = await Promise.all([
    fetchIdeaBoard(bookingId)
      .then((board) => board.counts)
      .catch(() => null),
    fetchGuests(bookingId)
      .then((list) => ({
        shared: list.length,
        opened: list.filter((g) => g.viewed).length,
      }))
      .catch(() => null),
  ]);

  return { ideas, guests };
}
