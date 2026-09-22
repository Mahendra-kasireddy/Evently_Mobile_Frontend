/**
 * Which side of the host's life a guest is from.
 *
 * `other` is not on the chip row: it is where a guest imported from a
 * phonebook lands, because nothing in an address book says whether somebody is
 * family. Those guests show under "Everyone" until the host files them.
 */
export type GuestGroup = 'family' | 'friends' | 'work' | 'other';

/** GET /invitation/mine/:bookingId/guests */
export interface GuestDTO {
  id: string;
  name: string;
  phone: string;
  phoneDisplay: string;
  group?: GuestGroup;
  sharedSections: string[];
  lastSharedAt: string | null;
  viewed: boolean;
}

/** POST .../guests/bulk — every entry attempted, one bad number kept apart. */
export interface BulkAddResultDTO {
  added: GuestDTO[];
  skipped: Array<{ name: string; reason: string }>;
}

/** What the add/edit sheet submits. */
export interface GuestDraft {
  name: string;
  phone: string;
  group: GuestGroup;
}

/** One row, ready to draw. */
export interface GuestRowViewModel {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  /** "+91 98490 11234 · Family" — the group half dropped when unfiled. */
  metaLine: string;
  group: GuestGroup;
  /** The values the edit sheet opens with. */
  draft: GuestDraft;
}

/** One chip on the filter row. `key` is null for "Everyone". */
export interface GroupFilterOption {
  key: GuestGroup | null;
  label: string;
  count: number;
}
