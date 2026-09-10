/** One event's money, as this screen reads it. */
export interface PaymentItem {
  bookingId: string;
  title: string;
  ref: string;
  organizerName: string | null;
  eventDateLabel: string;
  statusLabel: string;
  /** True once nothing is owed — the row then reads as settled, not as a task. */
  settled: boolean;
  agreedLabel: string;
  paidLabel: string;
  dueLabel: string;
  /** Share of the agreed amount already paid, for the bar. */
  paidPercent: number;
  dueAmount: number;
}

export interface PaymentsSummary {
  /** '' when nothing is outstanding anywhere. */
  outstandingLabel: string;
  eventsWithBalance: number;
}
