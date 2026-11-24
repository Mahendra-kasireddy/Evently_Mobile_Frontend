import {
  acceptBody,
  columnCounts,
  completeBody,
  completeWarning,
  countdown,
  createTaskBody,
  declineBody,
  emptyTaskForm,
  errorMessage,
  firstBusyColumn,
  formFromTask,
  groupTasks,
  ideasCountLabel,
  isNotFound,
  isTaskFormDirty,
  mapHeader,
  mapRespond,
  mapTask,
  mergeBooking,
  moneyLines,
  paymentNote,
  permissions,
  subVendorOptions,
  taskProgress,
  toLocalIso,
  updateTaskPlan,
  validateReason,
  validateTaskForm,
  withTaskStatus,
  withoutTask,
} from '../src/organizerModules/EventWorkspace/utils';
import type {
  BookingDTO,
  BookingTaskDTO,
  SubVendorLinkDTO,
  TaskForm,
} from '../src/organizerModules/EventWorkspace/types';

const NOW = new Date(2026, 9, 29, 12, 0);
const inDays = (d: number) => new Date(2026, 9, 29 + d, 12, 0).toISOString();
const inHours = (h: number) =>
  new Date(NOW.getTime() + h * 3_600_000).toISOString();

const task = (over: Partial<BookingTaskDTO> = {}): BookingTaskDTO => ({
  id: 't1',
  title: 'Confirm catering',
  status: 'todo',
  assigneeName: '',
  subVendorId: null,
  assignmentStatus: 'unassigned',
  amount: 0,
  dueDate: null,
  photoProof: null,
  ...over,
});

const booking = (over: Partial<BookingDTO> = {}): BookingDTO => ({
  id: 'b1',
  ref: 'EVT-1',
  title: 'Priya & Arjun Wedding',
  occasion: 'Wedding',
  location: 'Hyderabad',
  eventDate: inDays(12),
  daysToGo: 12,
  amount: 450000,
  advanceAmount: 135000,
  balanceAmount: 315000,
  paymentStatus: 'advance_paid',
  amountPaid: 135000,
  organizerRespondBy: null,
  declineReason: '',
  status: 'confirmed',
  tasks: [],
  customer: { id: 'c1', name: 'Priya Reddy' },
  ...over,
});

describe('permissions (mirrors the backend’s transitions)', () => {
  const at = NOW.getTime();

  it('lets the organizer answer only while awaiting and before the deadline', () => {
    const open = permissions(
      booking({ status: 'awaiting_organizer', organizerRespondBy: inHours(6) }),
      at,
    );
    expect(open.canRespond).toBe(true);
    expect(open.respondLapsed).toBe(false);
    expect(open.showBoard).toBe(false);
    expect(open.canComplete).toBe(false);

    expect(
      permissions(booking({ status: 'pending', organizerRespondBy: null }), at)
        .canRespond,
    ).toBe(true);

    const lapsed = permissions(
      booking({
        status: 'awaiting_organizer',
        organizerRespondBy: inHours(-1),
      }),
      at,
    );
    expect(lapsed.canRespond).toBe(false);
    expect(lapsed.respondLapsed).toBe(true);
  });

  it('opens the board and completion once confirmed or in progress', () => {
    for (const status of ['confirmed', 'in_progress'] as const) {
      const p = permissions(booking({ status }), at);
      expect(p.canRespond).toBe(false);
      expect(p.showBoard).toBe(true);
      expect(p.canEditTasks).toBe(true);
      expect(p.canComplete).toBe(true);
      expect(p.closed).toBe(false);
    }
  });

  it('makes closed bookings read-only, showing the board only if it has tasks', () => {
    for (const status of [
      'completed',
      'cancelled',
      'rejected',
      'expired',
    ] as const) {
      const empty = permissions(booking({ status }), at);
      expect(empty).toEqual({
        canRespond: false,
        respondLapsed: false,
        showBoard: false,
        canEditTasks: false,
        canComplete: false,
        closed: true,
      });
      expect(
        permissions(booking({ status, tasks: [task()] }), at).showBoard,
      ).toBe(true);
    }
  });
});

describe('header and money', () => {
  it('maps the event card', () => {
    const h = mapHeader(booking(), NOW);
    expect(h.title).toBe('Priya & Arjun Wedding');
    expect(h.customerName).toBe('Priya Reddy');
    expect(h.when).toBe('In 12 days');
    expect(h.day).toBe('10');
    expect(h.month).toBe('NOV');
    expect(h.status).toEqual({ label: 'Confirmed', tone: 'green' });
  });

  it('falls back when the title, customer or date are missing', () => {
    const h = mapHeader(
      booking({ title: '', eventDate: undefined, customer: null }),
      NOW,
    );
    expect(h.title).toBe('Wedding');
    expect(h.customerName).toBe('');
    expect(h.day).toBe('');
    expect(h.when).toBe('Date to be set');
  });

  it('shows advance paid and balance due', () => {
    expect(moneyLines(booking())).toEqual([
      { key: 'total', label: 'Total', value: '₹4,50,000', settled: false },
      {
        key: 'advance',
        label: 'Advance paid',
        value: '₹1,35,000',
        settled: true,
      },
      {
        key: 'balance',
        label: 'Balance due',
        value: '₹3,15,000',
        settled: false,
      },
    ]);
  });

  it('shows paid in full, and an unpaid advance as due', () => {
    const full = moneyLines(
      booking({ paymentStatus: 'paid_in_full', amountPaid: 450000 }),
    );
    expect(full.map(l => [l.label, l.value])).toEqual([
      ['Total', '₹4,50,000'],
      ['Paid in full', '₹4,50,000'],
    ]);
    const unpaid = moneyLines(
      booking({ paymentStatus: 'unpaid', amountPaid: 0 }),
    );
    expect(unpaid.map(l => [l.label, l.value, l.settled])).toEqual([
      ['Total', '₹4,50,000', false],
      ['Advance due', '₹1,35,000', false],
      ['Balance due', '₹3,15,000', false],
    ]);
  });

  it('says what the customer has paid', () => {
    expect(paymentNote(booking())).toBe('Customer has paid ₹1,35,000 advance.');
    expect(
      paymentNote(booking({ paymentStatus: 'paid_in_full', amountPaid: 0 })),
    ).toBe('Customer has paid ₹4,50,000 in full.');
    expect(
      paymentNote(booking({ paymentStatus: 'unpaid', advanceMethod: 'cash' })),
    ).toBe('₹1,35,000 advance is to be paid to you in cash.');
    expect(paymentNote(booking({ paymentStatus: 'unpaid' }))).toBe(
      'The customer hasn’t paid an advance yet.',
    );
  });
});

describe('respond-by countdown', () => {
  const at = NOW.getTime();

  it('counts down in minutes, hours, then days', () => {
    expect(countdown(inHours(0.5), at)).toEqual({ text: '30m', urgent: true });
    expect(countdown(inHours(6), at)).toEqual({ text: '6h', urgent: true });
    expect(countdown(inHours(20), at)).toEqual({ text: '20h', urgent: false });
    expect(countdown(inHours(72), at)).toEqual({
      text: '3 days',
      urgent: false,
    });
  });

  it('gives nothing once passed or without a deadline', () => {
    expect(countdown(inHours(-2), at)).toBeNull();
    expect(countdown(null, at)).toBeNull();
    expect(countdown('not a date', at)).toBeNull();
  });

  it('builds the respond card copy', () => {
    const r = mapRespond(
      booking({
        status: 'awaiting_organizer',
        organizerRespondBy: new Date(2026, 9, 30, 18, 5).toISOString(),
      }),
      at,
    );
    expect(r.countdown).toBe('31h left');
    expect(r.urgent).toBe(false);
    expect(r.deadline).toMatch(/^Respond by .*30 Oct, 6:05 pm$/);
    expect(r.paymentNote).toBe('Customer has paid ₹1,35,000 advance.');

    const none = mapRespond(booking({ organizerRespondBy: null }), at);
    expect(none.countdown).toBe('');
    expect(none.deadline).toBe('');
  });
});

describe('task board', () => {
  const tasks = [
    task({ id: 'a', status: 'done' }),
    task({ id: 'b', status: 'todo' }),
    task({ id: 'c', status: 'in_progress' }),
    task({ id: 'd', status: 'done' }),
    task({ id: 'e', status: 'todo' }),
  ];

  it('groups tasks into the three columns, in order', () => {
    const g = groupTasks(tasks);
    expect(g.todo.map(t => t.id)).toEqual(['b', 'e']);
    expect(g.in_progress.map(t => t.id)).toEqual(['c']);
    expect(g.done.map(t => t.id)).toEqual(['a', 'd']);
    expect(columnCounts(tasks)).toEqual({ todo: 2, in_progress: 1, done: 2 });
    expect(groupTasks(null)).toEqual({ todo: [], in_progress: [], done: [] });
  });

  it('measures progress', () => {
    expect(taskProgress(tasks)).toEqual({
      done: 2,
      total: 5,
      percent: 40,
      label: '2 of 5 done',
    });
    expect(taskProgress([])).toEqual({
      done: 0,
      total: 0,
      percent: 0,
      label: 'No tasks yet',
    });
  });

  it('opens on the first column with work in it', () => {
    expect(firstBusyColumn(tasks)).toBe('todo');
    expect(firstBusyColumn([task({ status: 'done' })])).toBe('done');
    expect(firstBusyColumn([])).toBe('todo');
  });

  it('maps a card with its next move', () => {
    const card = mapTask(
      task({
        assigneeName: 'Ravi Caterers',
        subVendorId: 'sv1',
        assignmentStatus: 'pending',
        amount: 4500,
        dueDate: inDays(1),
        photoProof: { url: '/api/upload/file/p.jpg', key: 'p.jpg' },
      }),
      NOW,
    );
    expect(card.assignee).toBe('Ravi Caterers');
    expect(card.assignment).toEqual({
      label: 'Waiting for reply',
      tone: 'amber',
    });
    expect(card.due).toBe('Due Tomorrow');
    expect(card.overdue).toBe(false);
    expect(card.amount).toBe('₹4,500');
    expect(card.proofUri).toMatch(/^https?:\/\/.+\/api\/upload\/file\/p\.jpg$/);
    expect(card.next).toEqual({
      status: 'in_progress',
      label: 'Start',
      icon: 'play',
    });

    expect(mapTask(task({ status: 'in_progress' }), NOW).next.label).toBe(
      'Mark done',
    );
    const done = mapTask(task({ status: 'done' }), NOW);
    expect(done.next).toMatchObject({ status: 'in_progress', label: 'Reopen' });
  });

  it('marks overdue open tasks and hides empty fields', () => {
    expect(mapTask(task({ dueDate: inDays(-2) }), NOW).overdue).toBe(true);
    expect(
      mapTask(task({ dueDate: inDays(-2), status: 'done' }), NOW).overdue,
    ).toBe(false);
    const bare = mapTask(task(), NOW);
    expect(bare.due).toBe('');
    expect(bare.amount).toBe('');
    expect(bare.proofUri).toBe('');
    expect(bare.assignment).toBeNull();
    // A free-text assignee has no one to accept or decline.
    expect(
      mapTask(task({ assigneeName: 'Ravi', assignmentStatus: 'unassigned' }))
        .assignment,
    ).toBeNull();
  });

  it('moves and removes tasks without touching the rest', () => {
    const b = booking({ tasks });
    const moved = withTaskStatus(b, 'b', 'in_progress');
    expect(moved.tasks.find(t => t.id === 'b')?.status).toBe('in_progress');
    expect(b.tasks.find(t => t.id === 'b')?.status).toBe('todo');
    expect(withoutTask(b, 'a').tasks.map(t => t.id)).toEqual([
      'b',
      'c',
      'd',
      'e',
    ]);
  });

  it('keeps the customer when a task response leaves it out', () => {
    const prev = booking();
    const next = mergeBooking(
      prev,
      booking({ customer: null, tasks: [task()] }),
    );
    expect(next.customer).toEqual({ id: 'c1', name: 'Priya Reddy' });
    expect(next.tasks).toHaveLength(1);
  });
});

describe('sub-vendor picker', () => {
  it('offers only active links with a profile', () => {
    const links: SubVendorLinkDTO[] = [
      {
        linkId: 'l1',
        status: 'active',
        subVendor: {
          id: 'sv1',
          fullName: 'Ravi Caterers',
          initials: 'RC',
          category: 'food',
        },
      },
      {
        linkId: 'l2',
        status: 'pending',
        subVendor: {
          id: 'sv2',
          fullName: 'Pending Person',
          initials: 'PP',
          category: 'decor',
        },
      },
      { linkId: 'l3', status: 'active', subVendor: null },
    ];
    expect(subVendorOptions(links)).toEqual([
      { id: 'sv1', name: 'Ravi Caterers', initials: 'RC', category: 'food' },
    ]);
    expect(subVendorOptions(null)).toEqual([]);
  });
});

describe('task form and bodies', () => {
  const form = (over: Partial<TaskForm> = {}): TaskForm => ({
    ...emptyTaskForm(),
    ...over,
  });

  it('validates the title, assignee and amount', () => {
    expect(validateTaskForm(form()).title).toBeTruthy();
    expect(validateTaskForm(form({ title: 'x'.repeat(161) })).title).toBe(
      'Keep the name under 160 characters.',
    );
    expect(
      validateTaskForm(form({ title: 'Decor', mode: 'subvendor' })).subVendorId,
    ).toBeTruthy();
    expect(
      validateTaskForm(form({ title: 'Decor', mode: 'person' })).assigneeName,
    ).toBeTruthy();
    expect(
      validateTaskForm(form({ title: 'Decor', amount: '12a' })).amount,
    ).toBeTruthy();
    expect(
      Object.values(
        validateTaskForm(
          form({ title: 'Decor', mode: 'person', assigneeName: 'Ravi' }),
        ),
      ).filter(Boolean),
    ).toEqual([]);
  });

  it('builds the create body with only what was filled', () => {
    expect(createTaskBody(form({ title: '  Decor  ' }))).toEqual({
      title: 'Decor',
    });
    const body = createTaskBody(
      form({
        title: 'Catering',
        mode: 'subvendor',
        subVendorId: 'sv1',
        assigneeName: 'ignored',
        amount: '4500',
        dueDate: '2026-11-10',
      }),
    );
    expect(body).toMatchObject({
      title: 'Catering',
      subVendorId: 'sv1',
      amount: 4500,
    });
    expect(body.assigneeName).toBeUndefined();
    expect(toLocalIso(body.dueDate)).toBe('2026-11-10');
    expect(
      createTaskBody(
        form({ title: 'Lights', mode: 'person', assigneeName: ' Ravi ' }),
      ),
    ).toEqual({ title: 'Lights', assigneeName: 'Ravi' });
  });

  it('round-trips a task through the form', () => {
    const t = task({
      subVendorId: 'sv1',
      assigneeName: 'Ravi Caterers',
      amount: 4500,
      dueDate: inDays(3),
    });
    const f = formFromTask(t);
    expect(f).toEqual({
      title: 'Confirm catering',
      dueDate: '2026-11-01',
      amount: '4500',
      mode: 'subvendor',
      subVendorId: 'sv1',
      assigneeName: '',
    });
    expect(isTaskFormDirty(f, t)).toBe(false);
    expect(isTaskFormDirty({ ...f, title: 'Other' }, t)).toBe(true);
    expect(isTaskFormDirty(emptyTaskForm(), null)).toBe(false);
    expect(formFromTask(task({ assigneeName: 'Ravi' })).mode).toBe('person');
  });

  it('patches only what changed', () => {
    const t = task({ amount: 100 });
    expect(updateTaskPlan(formFromTask(t), t)).toEqual({
      body: {},
      followUp: null,
    });
    const plan = updateTaskPlan(
      { ...formFromTask(t), title: 'New', amount: '' },
      t,
    );
    expect(plan).toEqual({ body: { title: 'New', amount: 0 }, followUp: null });
  });

  it('assigns, reassigns and unassigns a sub-vendor', () => {
    const free = task();
    expect(
      updateTaskPlan(
        { ...formFromTask(free), mode: 'subvendor', subVendorId: 'sv1' },
        free,
      ).body,
    ).toEqual({ subVendorId: 'sv1' });

    const linked = task({ subVendorId: 'sv1', assigneeName: 'Ravi' });
    expect(
      updateTaskPlan({ ...formFromTask(linked), subVendorId: 'sv2' }, linked)
        .body,
    ).toEqual({ subVendorId: 'sv2' });
    expect(
      updateTaskPlan({ ...formFromTask(linked), mode: 'none' }, linked),
    ).toEqual({ body: { subVendorId: null }, followUp: null });
  });

  it('switches a sub-vendor task to a typed name in two patches', () => {
    const linked = task({ subVendorId: 'sv1', assigneeName: 'Ravi' });
    expect(
      updateTaskPlan(
        { ...formFromTask(linked), mode: 'person', assigneeName: 'Sita' },
        linked,
      ),
    ).toEqual({
      body: { subVendorId: null },
      followUp: { assigneeName: 'Sita' },
    });
  });

  it('changes or clears a typed name', () => {
    const named = task({ assigneeName: 'Ravi' });
    expect(
      updateTaskPlan({ ...formFromTask(named), assigneeName: 'Sita' }, named)
        .body,
    ).toEqual({ assigneeName: 'Sita' });
    expect(
      updateTaskPlan({ ...formFromTask(named), mode: 'none' }, named).body,
    ).toEqual({ assigneeName: '' });
  });
});

describe('status bodies', () => {
  it('builds accept, decline and complete', () => {
    expect(acceptBody()).toEqual({ status: 'confirmed' });
    expect(completeBody()).toEqual({ status: 'completed' });
    expect(declineBody('  Already booked  ')).toEqual({
      status: 'rejected',
      note: 'Already booked',
    });
  });

  it('requires a decline reason within the DTO limit', () => {
    expect(validateReason('   ')).toBeTruthy();
    expect(validateReason('x'.repeat(501))).toBeTruthy();
    expect(validateReason('Already booked')).toBeNull();
  });

  it('warns before completing early or with open tasks', () => {
    expect(completeWarning(booking({ eventDate: inDays(-1) }), NOW)).toBe('');
    expect(
      completeWarning(
        booking({
          eventDate: inDays(-1),
          tasks: [task({ status: 'todo' }), task({ status: 'done' })],
        }),
        NOW,
      ),
    ).toBe('1 task is still open.');
    expect(completeWarning(booking({ eventDate: inDays(3) }), NOW)).toBe(
      'The event date hasn’t come yet.',
    );
  });
});

describe('small helpers', () => {
  it('labels the ideas count, and hides it when unknown', () => {
    expect(ideasCountLabel({ shared: 4 })).toBe('4 ideas');
    expect(ideasCountLabel({ shared: 1 })).toBe('1 idea');
    expect(ideasCountLabel({ shared: 0 })).toBe('0 ideas');
    expect(ideasCountLabel(null)).toBe('');
  });

  it('prefers the server’s words', () => {
    expect(errorMessage({ message: 'Booking not found' }, 'x')).toBe(
      'Booking not found',
    );
    expect(errorMessage({ message: ['title too long'] }, 'x')).toBe(
      'title too long',
    );
    expect(errorMessage(null, 'fallback')).toBe('fallback');
  });

  it('treats 400/403/404 as not found', () => {
    expect(isNotFound({ status: 404 })).toBe(true);
    expect(isNotFound({ status: 403 })).toBe(true);
    expect(isNotFound({ status: 500 })).toBe(false);
    expect(isNotFound(null)).toBe(false);
  });
});
