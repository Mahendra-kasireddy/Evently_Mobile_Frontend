import { dateParts, formatInrCompact, relativeDay } from '../Shared';
import { AWAITING_STATUSES, HOME_COPY as COPY } from './constants';
import type {
  BadgeStatusDTO,
  DashboardDTO,
  GoLiveCardModel,
  HomeStats,
  HomeTask,
  OnboardingStatusDTO,
  OrganizerBookingDTO,
  TierModel,
  UpcomingEvent,
} from './types';

/**
 * The go-live card for where the organizer is: the checklist until submitted,
 * a waiting note while verified, a bank-details nudge once live without one,
 * and nothing at all when there is nothing left to do.
 */
export function mapGoLive(status: OnboardingStatusDTO | null): GoLiveCardModel {
  if (!status) return null;
  const s = status.onboardingStatus;
  if (s === 'approved') {
    return !status.payoutReady && status.canEditBank
      ? { kind: 'payout' }
      : null;
  }
  if (s === 'submitted') return { kind: 'submitted' };
  if (s === 'rejected')
    return { kind: 'rejected', note: status.reviewNote || COPY.rejectedBody };

  const steps = (status.steps ?? []).filter(step => step.requiredForGoLive);
  const done = steps.filter(step => step.complete).length;
  const next = steps.find(step => !step.complete) ?? null;
  const changes = s === 'changes_requested';
  return {
    kind: changes ? 'changes' : 'setup',
    done,
    total: steps.length,
    percent: steps.length ? Math.round((done / steps.length) * 100) : 0,
    nextStepId: next?.id ?? null,
    nextStepTitle: next?.title ?? null,
    readyToSubmit: status.canSubmit,
    note: changes ? status.reviewNote || COPY.changesBody : COPY.goLiveBody,
  };
}

export function mapStats(dashboard: DashboardDTO): HomeStats {
  const change = dashboard.monthEarningsChangePercent;
  return {
    newEnquiries: dashboard.newEnquiries ?? 0,
    activeBookings: dashboard.activeBookings ?? 0,
    monthEarnings: formatInrCompact(dashboard.monthEarnings),
    earningsChange:
      change === null || change === undefined || !Number.isFinite(change)
        ? ''
        : `${change >= 0 ? '+' : ''}${Math.round(change)}% vs last month`,
    rating: dashboard.avgRating > 0 ? dashboard.avgRating.toFixed(1) : '—',
  };
}

export function mapTasks(dashboard: DashboardDTO): HomeTask[] {
  return (dashboard.todaysTasks ?? []).map(task => ({
    id: task.id,
    bookingId: task.bookingId,
    title: task.title,
    done: task.status === 'done',
  }));
}

export function mapWeek(
  dashboard: DashboardDTO,
  now = new Date(),
): UpcomingEvent[] {
  return (dashboard.next7Days ?? []).flatMap(item => {
    const parts = dateParts(item.eventDate);
    if (!parts) return [];
    return [
      {
        id: item.id,
        title: item.title || 'Event',
        customerName: item.customerName,
        day: parts.day,
        month: parts.month,
        when: relativeDay(item.eventDate, now),
      },
    ];
  });
}

/** Enquiries with no quote from this organizer yet. */
export function countToQuote(dashboard: DashboardDTO): number {
  return (dashboard.pendingEnquiries ?? []).filter(e => !e.myQuotation).length;
}

export function countToConfirm(bookings: OrganizerBookingDTO[] | null): number {
  return (bookings ?? []).filter(b => AWAITING_STATUSES.includes(b.status))
    .length;
}

export function mapTier(badges: BadgeStatusDTO | null): TierModel | null {
  if (!badges?.currentTier) return null;
  if (!badges.nextTier || !badges.nextRequirements) {
    return {
      tier: badges.currentTier,
      line: COPY.tierTop(badges.currentTier),
      progress: 1,
    };
  }
  const need = badges.nextRequirements.events;
  const left = Math.max(0, need - (badges.events ?? 0));
  return {
    tier: badges.currentTier,
    line: COPY.tierNext(left, badges.nextTier),
    progress: need > 0 ? Math.min(1, (badges.events ?? 0) / need) : 1,
  };
}
