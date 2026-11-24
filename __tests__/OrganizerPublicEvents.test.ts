import {
  attendeeQuery,
  buildEventBody,
  buildTicketBody,
  canTransition,
  checkInBody,
  combineDateTime,
  coordinateText,
  emptyEventForm,
  emptyTicketForm,
  errorMessage,
  filterAttendees,
  formFromEvent,
  formFromTicket,
  hasMorePages,
  isCheckInOpen,
  isEditable,
  liveBody,
  liveFormFrom,
  loadErrorMessage,
  mapAttendee,
  mapCheckIn,
  mapDashboard,
  mapEventCard,
  mapTicket,
  matchesAttendee,
  memoriesBody,
  memoriesFormFrom,
  mergeById,
  normalizeTimeText,
  parseTime,
  priceText,
  recentFrom,
  splitIso,
  statusActions,
  validateEventForm,
  validateLiveForm,
  validateMemories,
  validateTicketForm,
  withCheckedIn,
} from '../src/organizerModules/PublicEvents/utils';
import type {
  AttendeeDTO,
  DashboardDTO,
  EventForm,
  PublicEventDTO,
  PublicEventStatus,
  PublicEventSummaryDTO,
  TicketForm,
  TicketTypeDTO,
} from '../src/organizerModules/PublicEvents/types';

const NOW = new Date(2026, 9, 29, 12, 0); // 29 Oct 2026, local noon
const at = (y: number, m: number, d: number, h = 0, min = 0) =>
  new Date(y, m - 1, d, h, min).toISOString();

const eventForm = (over: Partial<EventForm> = {}): EventForm => ({
  ...emptyEventForm(),
  title: 'Comedy Night',
  startDate: '2026-11-14',
  startTime: '19:30',
  ...over,
});

const ticketForm = (over: Partial<TicketForm> = {}): TicketForm => ({
  ...emptyTicketForm(),
  name: 'General',
  price: '499',
  totalQuantity: '200',
  ...over,
});

const attendee = (over: Partial<AttendeeDTO> = {}): AttendeeDTO => ({
  ticketId: 't1',
  code: 'AB12CD34EF',
  status: 'valid',
  checkedInAt: null,
  customerName: 'Asha Rao',
  customerEmail: 'asha@example.com',
  customerPhone: '9876543210',
  ticketTypeName: 'General',
  bookingReference: 'EV-1001',
  ...over,
});

const ticketType = (over: Partial<TicketTypeDTO> = {}): TicketTypeDTO => ({
  id: 'tt1',
  name: 'General',
  description: '',
  price: 499,
  totalQuantity: 100,
  availableQuantity: 60,
  salesStart: null,
  salesEnd: null,
  maxPerCustomer: 0,
  status: 'active',
  archived: false,
  sold: 40,
  onSale: true,
  ...over,
});

const event = (over: Partial<PublicEventDTO> = {}): PublicEventDTO => ({
  id: 'e1',
  title: 'Comedy Night',
  description: 'Laughs',
  coverUrl: '/api/upload/file/cover/x.png',
  startDateTime: at(2026, 11, 14, 19, 30),
  endDateTime: at(2026, 11, 14, 22, 0),
  venue: {
    name: 'Shilpakala Vedika',
    address: 'Madhapur',
    city: 'Hyderabad',
    state: 'Telangana',
    latitude: 17.45,
    longitude: 78.38,
  },
  status: 'draft',
  ...over,
});

// ---- Status rules ---------------------------------------------------------------

describe('status rules (mirrors ALLOWED_TRANSITIONS)', () => {
  it('allows exactly the server table', () => {
    expect(canTransition('draft', 'published')).toBe(true);
    expect(canTransition('draft', 'cancelled')).toBe(true);
    expect(canTransition('draft', 'completed')).toBe(false);
    expect(canTransition('published', 'draft')).toBe(true);
    expect(canTransition('published', 'completed')).toBe(true);
    expect(canTransition('sold_out', 'draft')).toBe(true);
    expect(canTransition('sold_out', 'published')).toBe(false);
    expect(canTransition('completed', 'published')).toBe(false);
    expect(canTransition('cancelled', 'draft')).toBe(false);
  });

  it('offers the right buttons per status', () => {
    const keys = (s: PublicEventStatus) => statusActions(s, 1).map(a => a.key);
    expect(keys('draft')).toEqual(['publish', 'cancel']);
    expect(keys('published')).toEqual(['complete', 'unpublish', 'cancel']);
    expect(keys('sold_out')).toEqual(['complete', 'unpublish', 'cancel']);
    expect(keys('completed')).toEqual([]);
    expect(keys('cancelled')).toEqual([]);
  });

  it('holds publishing back until there is a ticket type', () => {
    const [publish] = statusActions('draft', 0);
    expect(publish.key).toBe('publish');
    expect(publish.blockedReason).toMatch(/ticket type/i);
    expect(statusActions('draft', 2)[0].blockedReason).toBe('');
  });

  it('marks the forward move primary and cancel as danger', () => {
    const actions = statusActions('published', 1);
    expect(actions.find(a => a.key === 'complete')?.primary).toBe(true);
    expect(actions.find(a => a.key === 'cancel')?.danger).toBe(true);
    expect(actions.find(a => a.key === 'unpublish')?.primary).toBe(false);
  });

  it('knows when editing and check-in are possible', () => {
    expect(isEditable('draft')).toBe(true);
    expect(isEditable('sold_out')).toBe(true);
    expect(isEditable('completed')).toBe(false);
    expect(isEditable('cancelled')).toBe(false);
    expect(isCheckInOpen('draft')).toBe(false);
    expect(isCheckInOpen('published')).toBe(true);
    expect(isCheckInOpen('sold_out')).toBe(true);
    expect(isCheckInOpen('completed')).toBe(true);
    expect(isCheckInOpen('cancelled')).toBe(false);
  });
});

// ---- Times --------------------------------------------------------------------

describe('date and time', () => {
  it('normalizes typed times', () => {
    expect(normalizeTimeText('1930')).toBe('19:30');
    expect(normalizeTimeText('193')).toBe('19:3');
    expect(normalizeTimeText('19:3')).toBe('19:3');
    expect(normalizeTimeText('19:')).toBe('19:');
    expect(normalizeTimeText('9:30')).toBe('9:30');
    expect(normalizeTimeText('ab7')).toBe('7');
    expect(normalizeTimeText('19:305')).toBe('19:30');
  });

  it('parses only real times', () => {
    expect(parseTime('19:30')).toEqual({ h: 19, m: 30 });
    expect(parseTime('9:05')).toEqual({ h: 9, m: 5 });
    expect(parseTime('24:00')).toBeNull();
    expect(parseTime('12:60')).toBeNull();
    expect(parseTime('1930')).toBeNull();
    expect(parseTime('')).toBeNull();
  });

  it('combines a date box and a time box on the device clock', () => {
    expect(combineDateTime('2026-11-14', '19:30')).toBe(
      at(2026, 11, 14, 19, 30),
    );
    expect(combineDateTime('', '19:30')).toBeNull();
    expect(combineDateTime('2026-11-14', '7pm')).toBeNull();
  });

  it('splits an instant back into the boxes', () => {
    expect(splitIso(at(2026, 11, 14, 7, 5))).toEqual({
      date: '2026-11-14',
      time: '07:05',
    });
    expect(splitIso(null)).toEqual({ date: '', time: '' });
    expect(splitIso('nope')).toEqual({ date: '', time: '' });
  });
});

// ---- Event form ---------------------------------------------------------------------

describe('validateEventForm', () => {
  it('requires a name, a start date and a start time', () => {
    const errors = validateEventForm(emptyEventForm());
    expect(errors.title).toBeTruthy();
    expect(errors.startDate).toBeTruthy();
    expect(errors.startTime).toBeTruthy();
  });

  it('accepts a minimal valid event', () => {
    expect(validateEventForm(eventForm())).toEqual({});
  });

  it('checks the name length', () => {
    expect(validateEventForm(eventForm({ title: 'ab' })).title).toMatch(/3/);
    expect(
      validateEventForm(eventForm({ title: 'x'.repeat(121) })).title,
    ).toBeTruthy();
  });

  it('rejects a malformed time', () => {
    expect(
      validateEventForm(eventForm({ startTime: '25:00' })).startTime,
    ).toBeTruthy();
  });

  it('refuses an end before the start', () => {
    const errors = validateEventForm(
      eventForm({ endDate: '2026-11-14', endTime: '18:00' }),
    );
    expect(errors.endTime).toMatch(/before/);
  });

  it('reads an end time alone as the same day', () => {
    expect(validateEventForm(eventForm({ endTime: '22:00' }))).toEqual({});
    expect(validateEventForm(eventForm({ endTime: '18:00' })).endTime).toMatch(
      /before/,
    );
  });

  it('asks for an end time when only the end date is set', () => {
    expect(
      validateEventForm(eventForm({ endDate: '2026-11-15' })).endTime,
    ).toBeTruthy();
  });

  it('checks the map pin', () => {
    expect(
      validateEventForm(eventForm({ latitude: '91', longitude: '78' }))
        .latitude,
    ).toBeTruthy();
    expect(
      validateEventForm(eventForm({ latitude: '17', longitude: '-181' }))
        .longitude,
    ).toBeTruthy();
    expect(
      validateEventForm(eventForm({ latitude: '17.4' })).longitude,
    ).toBeTruthy();
    expect(
      validateEventForm(eventForm({ latitude: 'abc', longitude: '78' }))
        .latitude,
    ).toBeTruthy();
    expect(
      validateEventForm(eventForm({ latitude: '-17.45', longitude: '78.38' })),
    ).toEqual({});
  });

  it('keeps only number characters in the coordinate boxes', () => {
    expect(coordinateText('-17.4a5')).toBe('-17.45');
    expect(coordinateText('1-7')).toBe('17');
    expect(coordinateText('1.2.3')).toBe('1.23');
  });
});

describe('buildEventBody', () => {
  it('combines date and time and leaves blanks out on create', () => {
    const body = buildEventBody(
      eventForm({ endTime: '22:00', city: ' Hyderabad ' }),
      'create',
    );
    expect(body).toEqual({
      title: 'Comedy Night',
      startDateTime: at(2026, 11, 14, 19, 30),
      endDateTime: at(2026, 11, 14, 22, 0),
      venue: { city: 'Hyderabad' },
    });
  });

  it('sends the pin only as a pair of numbers', () => {
    const body = buildEventBody(
      eventForm({ latitude: '17.45', longitude: '78.38' }),
      'create',
    );
    expect(body.venue).toEqual({ latitude: 17.45, longitude: 78.38 });
  });

  it('clears fields on edit: blanks as "" and the end as null', () => {
    const body = buildEventBody(
      eventForm({ description: '', coverUrl: '' }),
      'edit',
    );
    expect(body.description).toBe('');
    expect(body.coverUrl).toBe('');
    expect(body.endDateTime).toBeNull();
    expect(body.venue).toEqual({ name: '', address: '', city: '', state: '' });
  });

  it('round-trips an event through the form', () => {
    const e = event();
    const form = formFromEvent(e);
    expect(form.startDate).toBe('2026-11-14');
    expect(form.startTime).toBe('19:30');
    expect(form.latitude).toBe('17.45');
    const body = buildEventBody(form, 'edit');
    expect(body.startDateTime).toBe(e.startDateTime);
    expect(body.endDateTime).toBe(e.endDateTime);
    expect(body.coverUrl).toBe(e.coverUrl);
    expect(body.venue?.latitude).toBe(17.45);
  });
});

// ---- Ticket types ------------------------------------------------------------------

describe('validateTicketForm', () => {
  it('accepts a valid ticket', () => {
    expect(validateTicketForm(ticketForm())).toEqual({});
    expect(validateTicketForm(ticketForm({ price: '0' }))).toEqual({});
    expect(validateTicketForm(ticketForm({ price: '499.50' }))).toEqual({});
  });

  it('requires name, price and quantity', () => {
    const errors = validateTicketForm(emptyTicketForm());
    expect(errors.name).toBeTruthy();
    expect(errors.price).toBeTruthy();
    expect(errors.totalQuantity).toBeTruthy();
  });

  it('needs at least one ticket, and no fewer than are sold', () => {
    expect(
      validateTicketForm(ticketForm({ totalQuantity: '0' })).totalQuantity,
    ).toMatch(/at least 1/);
    expect(
      validateTicketForm(ticketForm({ totalQuantity: '30' }), 40).totalQuantity,
    ).toMatch(/40/);
    expect(validateTicketForm(ticketForm({ totalQuantity: '40' }), 40)).toEqual(
      {},
    );
  });

  it('caps price and per-customer limit', () => {
    expect(
      validateTicketForm(ticketForm({ price: '10000001' })).price,
    ).toBeTruthy();
    expect(
      validateTicketForm(ticketForm({ price: '1.234' })).price,
    ).toBeTruthy();
    expect(
      validateTicketForm(ticketForm({ maxPerCustomer: '51' })).maxPerCustomer,
    ).toBeTruthy();
    expect(validateTicketForm(ticketForm({ maxPerCustomer: '10' }))).toEqual(
      {},
    );
  });

  it('checks the sales window', () => {
    expect(
      validateTicketForm(
        ticketForm({
          salesStartDate: '2026-11-01',
          salesStartTime: '10:00',
          salesEndDate: '2026-11-01',
          salesEndTime: '09:00',
        }),
      ).salesEndTime,
    ).toBeTruthy();
    expect(
      validateTicketForm(ticketForm({ salesStartDate: '2026-11-01' }))
        .salesStartTime,
    ).toBeTruthy();
    expect(
      validateTicketForm(ticketForm({ salesEndTime: '10:00' })).salesEndDate,
    ).toBeTruthy();
  });

  it('keeps price text to rupees and paise', () => {
    expect(priceText('0499.505')).toBe('499.50');
    expect(priceText('₹1,200')).toBe('1200');
  });
});

describe('buildTicketBody', () => {
  it('builds a create body with numbers and only what was given', () => {
    expect(
      buildTicketBody(
        ticketForm({ salesStartDate: '2026-11-01', salesStartTime: '10:00' }),
        'create',
      ),
    ).toEqual({
      name: 'General',
      price: 499,
      totalQuantity: 200,
      status: 'active',
      salesStart: at(2026, 11, 1, 10, 0),
    });
  });

  it('clears the window and limit on edit', () => {
    const body = buildTicketBody(ticketForm({ status: 'paused' }), 'edit');
    expect(body.salesStart).toBeNull();
    expect(body.salesEnd).toBeNull();
    expect(body.maxPerCustomer).toBe(0);
    expect(body.description).toBe('');
    expect(body.status).toBe('paused');
  });

  it('round-trips a ticket type through the form', () => {
    const t = ticketType({
      salesEnd: at(2026, 11, 14, 18, 0),
      maxPerCustomer: 4,
    });
    const form = formFromTicket(t);
    expect(form.salesEndTime).toBe('18:00');
    expect(form.maxPerCustomer).toBe('4');
    expect(buildTicketBody(form, 'edit').salesEnd).toBe(t.salesEnd);
  });
});

describe('mapTicket', () => {
  it('shows sales and allows removal only when nothing is sold', () => {
    const sold = mapTicket(ticketType(), NOW);
    expect(sold.soldLine).toBe('40 of 100 sold');
    expect(sold.percent).toBe(40);
    expect(sold.canArchive).toBe(false);
    expect(sold.state.label).toBe('On sale');

    const fresh = mapTicket(
      ticketType({ sold: 0, availableQuantity: 100, onSale: false }),
      NOW,
    );
    expect(fresh.canArchive).toBe(true);
    expect(fresh.state.label).toBe('Not on sale');
    expect(mapTicket(ticketType({ status: 'paused' }), NOW).state.label).toBe(
      'Paused',
    );
  });

  it('works out sold from the stock when the API did not say', () => {
    const t = mapTicket(
      ticketType({ sold: undefined, totalQuantity: 50, availableQuantity: 45 }),
      NOW,
    );
    expect(t.soldLine).toBe('5 of 50 sold');
  });
});

// ---- Attendees --------------------------------------------------------------------

describe('attendees', () => {
  const rows = [
    attendee(),
    attendee({
      ticketId: 't2',
      code: 'ZZ99',
      status: 'checked_in',
      customerName: 'Ravi Kumar',
      customerEmail: 'ravi@example.com',
      customerPhone: '9000000000',
      bookingReference: 'EV-2002',
    }),
    attendee({ ticketId: 't3', status: 'cancelled', customerName: 'Meera' }),
  ];

  it('filters by check-in state like the server', () => {
    expect(filterAttendees(rows, 'all', '').map(a => a.ticketId)).toEqual([
      't1',
      't2',
      't3',
    ]);
    expect(
      filterAttendees(rows, 'checked_in', '').map(a => a.ticketId),
    ).toEqual(['t2']);
    expect(filterAttendees(rows, 'pending', '').map(a => a.ticketId)).toEqual([
      't1',
    ]);
  });

  it('searches name, email, phone, code and reference', () => {
    expect(matchesAttendee(rows[1], 'all', 'ravi')).toBe(true);
    expect(matchesAttendee(rows[1], 'all', 'zz99')).toBe(true);
    expect(matchesAttendee(rows[1], 'all', 'EV-2002')).toBe(true);
    expect(matchesAttendee(rows[1], 'all', '90000')).toBe(true);
    expect(matchesAttendee(rows[0], 'all', 'ravi')).toBe(false);
    expect(filterAttendees(rows, 'pending', 'ravi')).toEqual([]);
  });

  it('builds the query the API accepts', () => {
    expect(attendeeQuery('all', '  ', 0, 50)).toEqual({ page: 0, limit: 50 });
    expect(attendeeQuery('pending', ' asha ', 2, 50)).toEqual({
      page: 2,
      limit: 50,
      checkIn: 'pending',
      q: 'asha',
    });
  });

  it('reflects a door check-in in the loaded rows', () => {
    const next = withCheckedIn(rows, 't1', at(2026, 11, 14, 19, 45));
    expect(next[0].status).toBe('checked_in');
    expect(next[0].checkedInAt).toBe(at(2026, 11, 14, 19, 45));
    // A cancelled ticket is never turned into an admitted one.
    expect(withCheckedIn(rows, 't3', 'x')[2].status).toBe('cancelled');
  });

  it('maps a row for the list', () => {
    const row = mapAttendee(rows[0], NOW);
    expect(row.initials).toBe('AR');
    expect(row.canCheckIn).toBe(true);
    expect(row.state.label).toBe('Not checked in');
    const nameless = mapAttendee(attendee({ customerName: '' }), NOW);
    expect(nameless.name).toBe('Guest');
    expect(mapAttendee(rows[1], NOW).canCheckIn).toBe(false);
  });
});

describe('paging', () => {
  it('knows when there is another page', () => {
    expect(hasMorePages(0, 20, 45)).toBe(true);
    expect(hasMorePages(1, 20, 45)).toBe(true);
    expect(hasMorePages(2, 20, 45)).toBe(false);
    expect(hasMorePages(0, 20, 20)).toBe(false);
  });

  it('appends without duplicates', () => {
    expect(
      mergeById([{ id: 'a' }, { id: 'b' }], [{ id: 'b' }, { id: 'c' }]),
    ).toEqual([{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
  });
});

// ---- Check-in --------------------------------------------------------------------

describe('check-in', () => {
  it('sends a short entry as an upper-case code', () => {
    expect(checkInBody(' ab12 cd ')).toEqual({
      body: { code: 'AB12CD' },
      error: null,
    });
  });

  it('sends a long scanner payload as the QR token', () => {
    const token = `${'a'.repeat(36)}.${'b'.repeat(43)}`;
    expect(checkInBody(token)).toEqual({
      body: { qrToken: token },
      error: null,
    });
  });

  it('refuses an empty box', () => {
    expect(checkInBody('   ').body).toBeNull();
  });

  it('maps each server answer', () => {
    const ticket = {
      ticketId: 't1',
      code: 'AB12',
      status: 'checked_in',
      checkedInAt: at(2026, 11, 14, 19, 45),
      customerName: 'Asha Rao',
      ticketTypeName: 'VIP',
    };
    const ok = mapCheckIn({ result: 'entry_allowed', ticket });
    expect(ok).toMatchObject({
      tone: 'ok',
      title: 'Entry allowed',
      name: 'Asha Rao',
      detail: 'VIP · AB12',
    });
    expect(
      mapCheckIn({
        result: 'already_checked_in',
        reason: 'This ticket has already been used',
        ticket,
      }).tone,
    ).toBe('warn');
    const bad = mapCheckIn({
      result: 'invalid_ticket',
      reason: 'No such ticket for this event',
    });
    expect(bad.tone).toBe('bad');
    expect(bad.detail).toBe('No such ticket for this event');

    expect(recentFrom({ result: 'entry_allowed', ticket }, NOW)).toMatchObject({
      id: 't1',
      name: 'Asha Rao',
      at: '7:45 pm',
    });
    expect(recentFrom({ result: 'already_checked_in', ticket })).toBeNull();
  });
});

// ---- Dashboard & cards --------------------------------------------------------------

describe('mapDashboard', () => {
  const dto: DashboardDTO = {
    eventId: 'e1',
    status: 'published',
    ticketsSold: 50,
    ticketsRemaining: 150,
    capacity: 200,
    bookings: 30,
    revenue: 125000,
    checkedIn: 20,
    pendingEntry: 30,
    liveState: 'upcoming',
    memoriesEnabled: false,
    liveStreamEnabled: false,
    byTicketType: [
      {
        id: 'a',
        name: 'General',
        price: 499,
        total: 150,
        remaining: 120,
        sold: 30,
      },
      {
        id: 'b',
        name: 'Free pass',
        price: 0,
        total: 50,
        remaining: 30,
        sold: 20,
      },
    ],
  };

  it('builds the four tiles', () => {
    const m = mapDashboard(dto);
    expect(m.tiles.map(t => [t.key, t.value, t.sub])).toEqual([
      ['sold', '50', '150 left'],
      ['revenue', '₹1.3L', '30 bookings'],
      ['checkedIn', '20', 'of 50 sold'],
      ['capacity', '200', '25%'],
    ]);
  });

  it('lists each ticket type with its share sold', () => {
    const m = mapDashboard(dto);
    expect(m.byType[0]).toMatchObject({
      name: 'General',
      price: '₹499',
      line: '30 / 150',
      percent: 20,
    });
    expect(m.byType[1]).toMatchObject({ price: 'Free', percent: 40 });
  });

  it('copes with an empty event', () => {
    const m = mapDashboard({
      ...dto,
      ticketsSold: 0,
      ticketsRemaining: 0,
      capacity: 0,
      revenue: 0,
      byTicketType: [],
    });
    expect(m.tiles[3].sub).toBe('0%');
    expect(m.byType).toEqual([]);
  });
});

describe('mapEventCard', () => {
  const summary = (over: Partial<PublicEventSummaryDTO> = {}) => ({
    ...event({ status: 'published' }),
    ticketTypeCount: 2,
    sold: 30,
    remaining: 70,
    startingPrice: 299,
    ...over,
  });

  it('shows date, place, sales and price', () => {
    const card = mapEventCard(summary(), NOW);
    expect(card.day).toBe('14');
    expect(card.month).toBe('NOV');
    expect(card.place).toBe('Shilpakala Vedika · Hyderabad');
    expect(card.soldLine).toBe('30 / 100 sold');
    expect(card.soldPercent).toBe(30);
    expect(card.priceLine).toBe('From ₹299');
    expect(card.status).toEqual({ label: 'Published', tone: 'green' });
    expect(card.coverUri).toMatch(
      /^https?:\/\/.+\/api\/upload\/file\/cover\/x\.png$/,
    );
    expect(card.past).toBe(false);
  });

  it('says so when there are no tickets yet', () => {
    const card = mapEventCard(
      summary({ ticketTypeCount: 0, sold: 0, remaining: 0, coverUrl: '' }),
      NOW,
    );
    expect(card.soldLine).toBe('No tickets yet');
    expect(card.soldPercent).toBeNull();
    expect(card.priceLine).toBe('');
    expect(card.coverUri).toBe('');
  });

  it('marks a finished event as past', () => {
    const card = mapEventCard(
      summary({
        startDateTime: at(2026, 9, 1, 19),
        endDateTime: at(2026, 9, 1, 22),
      }),
      NOW,
    );
    expect(card.past).toBe(true);
  });
});

// ---- Memories & live ---------------------------------------------------------------

describe('memories and live stream', () => {
  it('fills memories defaults like the server', () => {
    const form = memoriesFormFrom(undefined);
    expect(form).toEqual({
      enabled: false,
      uploaders: 'checked_in',
      attendeeView: true,
      attendeeDownload: false,
      moderation: false,
      uploadWindowDays: '7',
    });
    expect(validateMemories(form)).toBeNull();
    expect(validateMemories({ ...form, uploadWindowDays: '366' })).toBeTruthy();
    expect(validateMemories({ ...form, uploadWindowDays: '' })).toBeTruthy();
    expect(
      memoriesBody({ ...form, uploadWindowDays: '14' }).uploadWindowDays,
    ).toBe(14);
  });

  it('validates the stream link', () => {
    const form = liveFormFrom(undefined);
    expect(validateLiveForm(form)).toEqual({});
    expect(validateLiveForm({ ...form, enabled: true }).url).toBeTruthy();
    expect(
      validateLiveForm({ ...form, url: 'http://youtube.com/x' }).url,
    ).toBeTruthy();
    expect(
      validateLiveForm({ ...form, enabled: true, url: 'https://youtu.be/abc' }),
    ).toEqual({});
  });

  it('checks the stream window and builds the body', () => {
    const form = {
      ...liveFormFrom(undefined),
      enabled: true,
      url: 'https://youtu.be/abc',
      startDate: '2026-11-14',
      startTime: '19:00',
      endDate: '2026-11-14',
      endTime: '18:00',
    };
    expect(validateLiveForm(form).endTime).toBeTruthy();
    const ok = { ...form, endTime: '22:00' };
    expect(validateLiveForm(ok)).toEqual({});
    expect(liveBody(ok)).toEqual({
      enabled: true,
      access: 'ticketed',
      url: 'https://youtu.be/abc',
      startsAt: at(2026, 11, 14, 19, 0),
      endsAt: at(2026, 11, 14, 22, 0),
      replayEnabled: false,
    });
  });
});

// ---- Errors ------------------------------------------------------------------------

describe('errors', () => {
  it('uses the server’s words', () => {
    expect(
      errorMessage(
        { message: 'Add at least one ticket type before publishing' },
        'x',
      ),
    ).toBe('Add at least one ticket type before publishing');
    expect(errorMessage({ message: ['first', 'second'] }, 'x')).toBe('first');
    expect(errorMessage(null, 'fallback')).toBe('fallback');
  });

  it('explains a failed load by its status', () => {
    expect(loadErrorMessage({ status: 0, message: 'Network Error' })).toMatch(
      /connection/,
    );
    expect(loadErrorMessage({ status: 401, message: '' })).toMatch(/session/);
    expect(
      loadErrorMessage({
        status: 403,
        message: 'No organizer profile is linked to your account',
      }),
    ).toBe('No organizer profile is linked to your account');
  });
});
