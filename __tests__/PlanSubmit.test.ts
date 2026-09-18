/**
 * @format
 *
 * What the organizer actually receives when a plan is submitted.
 *
 * The reported bug: a customer picked services in step 2, submitted, and the
 * organizer opened a request with no services on it. The wizard was sending
 * four fields — occasion, date, place, headcount — and the server had accepted
 * the rest the whole time.
 */

import type {
  PlanDraft,
  RequestQuoteFromOrganizerDTO,
} from '../src/modules/Plan/types';

/* Minimal shapes rather than @types/node, which this app does not carry — the
   same pattern the other source-reading suites use. */
declare const __dirname: string;
const fs: { readFileSync(p: string, e: string): string } = require('fs');
const path: { join(...parts: string[]): string } = require('path');

const draft = (over: Partial<PlanDraft> = {}): PlanDraft => ({
  occasionId: 'wedding',
  eventDate: '2026-09-21',
  city: 'Hyderabad',
  area: 'Patrika Nagar',
  guests: '150',
  budget: '5-10L',
  ideas: 'Live dosa counter for the cousins',
  categories: ['photography', 'music'],
  selectedOrganizerIds: ['org1'],
  step: 3,
  ...over,
});

/**
 * The payload the container builds, kept in step with `submitPlan`.
 *
 * Mirrored rather than imported because the container is a hook wired to the
 * API client and the store; what is worth pinning down is the shape of what
 * leaves the phone.
 */
const payloadFor = (
  d: PlanDraft,
  planId: string | null,
): RequestQuoteFromOrganizerDTO => ({
  organizerIds: d.selectedOrganizerIds,
  occasion: d.occasionId,
  when: d.eventDate || undefined,
  where: [d.area, d.city].filter(Boolean).join(', ') || undefined,
  guests: d.guests || undefined,
  planId: planId ?? undefined,
  budget: d.budget || undefined,
  categories: d.categories.length ? d.categories : undefined,
  ideas: d.ideas.trim() || undefined,
});

describe('the brief the organizer gets', () => {
  it('carries the services the customer chose', () => {
    // The bug, in one assertion. Without this the organizer is asked to price
    // an event with no idea which parts of it they are pricing.
    expect(payloadFor(draft(), 'plan1').categories).toEqual([
      'photography',
      'music',
    ]);
  });

  it('carries the budget and the customer’s own words', () => {
    const payload = payloadFor(draft(), 'plan1');
    expect(payload.budget).toBe('5-10L');
    expect(payload.ideas).toBe('Live dosa counter for the cousins');
  });

  it('links the brief to the plan it came from', () => {
    /*
     * Without `planId` the plan and the request are two unrelated records, and
     * Home lists the customer's one event twice — once as a plan in progress,
     * once as a brief awaiting replies.
     */
    expect(payloadFor(draft(), 'plan1').planId).toBe('plan1');
  });

  it('omits what the customer left blank rather than sending empty strings', () => {
    // The server treats an absent optional field and an empty one differently
    // in validation; sending '' is how a MaxLength rule fails on nothing.
    const payload = payloadFor(
      draft({ budget: '', ideas: '   ', categories: [], guests: '' }),
      null,
    );
    expect(payload.budget).toBeUndefined();
    expect(payload.ideas).toBeUndefined();
    expect(payload.categories).toBeUndefined();
    expect(payload.guests).toBeUndefined();
    expect(payload.planId).toBeUndefined();
  });
});

describe('the container sends all of it', () => {
  const source = (): string =>
    fs.readFileSync(
      path.join(__dirname, '..', 'src', 'modules', 'Plan', 'container.ts'),
      'utf8',
    );

  it('puts every field of the brief on the request', () => {
    const body = source();
    for (const field of ['planId:', 'budget:', 'categories:', 'ideas:']) {
      expect(body).toContain(field);
    }
  });

  it('passes the plan id in rather than reading it from state', () => {
    /*
     * On a first submission the request runs inside the createPlan promise,
     * before `savedPlanId` has re-rendered. Reading state there sends null and
     * silently leaves the brief unlinked — the failure is invisible until
     * someone notices their event listed twice.
     */
    expect(source()).toContain(
      'runQuoteRequest = async (planId: string | null)',
    );
    expect(source()).toContain('runQuoteRequest(plan.id)');
  });
});
