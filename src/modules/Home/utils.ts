import { isNonEmptyArray } from '../../utils/guards';
import type {
  BannerViewModel,
  CategoriesViewModel,
  CurrentEventViewModel,
  FeaturedEventsViewModel,
  HomeFeedDTO,
  HomeViewModel,
  HowItWorksViewModel,
  RecommendedEventsViewModel,
  ToolsViewModel,
} from './types';

/** hero content -> the greeting banner. Hidden if hero copy is missing. */
export function mapBanner(feed: HomeFeedDTO): BannerViewModel | null {
  const hero = feed.content?.hero;
  if (!hero) return null;

  const firstName = feed.user?.name?.split(' ')[0] || feed.user?.name || 'there';

  return {
    greeting: hero.greetingTemplate.replace('{name}', firstName),
    headingLead: hero.headingLead,
    headingAccent: hero.headingAccent,
    headingTail: hero.headingTail,
    subtitle: hero.subtitle,
    draftLabel: hero.draftLabel,
    defaultDraft: hero.defaultDraft,
    options: hero.options,
  };
}

/** the customer's in-progress event, shown as its own section. Hidden if there is none. */
export function mapCurrentEvent(feed: HomeFeedDTO): CurrentEventViewModel | null {
  if (!feed.currentEvent) return null;

  return {
    title: feed.currentEvent.title,
    progress: feed.currentEvent.progress,
    daysToGo: feed.currentEvent.daysToGo,
    stage: feed.currentEvent.stage,
  };
}

/** planSection.occasions -> category tiles. Hidden if there are none. */
export function mapCategories(feed: HomeFeedDTO): CategoriesViewModel | null {
  const section = feed.content?.planSection;
  if (!section || !isNonEmptyArray(section.occasions)) return null;

  return {
    title: section.title,
    subtitle: section.subtitle,
    items: section.occasions.map((o) => ({ id: o.id, icon: o.icon, art: o.art, label: o.label, cta: o.cta })),
  };
}

/** active packages -> featured events. Hidden if there are none. */
export function mapFeaturedEvents(feed: HomeFeedDTO): FeaturedEventsViewModel | null {
  if (!isNonEmptyArray(feed.packages)) return null;

  return {
    title: feed.content?.packages?.title ?? 'Featured for you',
    subtitle: feed.content?.packages?.subtitle ?? '',
    buildLabel: feed.content?.packages?.buildLabel ?? null,
    items: feed.packages.map((p) => ({
      id: p.id,
      badge: p.badge,
      title: p.title,
      guests: p.guests,
      budget: p.budget,
      tags: p.tags,
    })),
  };
}

/** top organizers -> recommended events. Hidden if there are none. */
export function mapRecommendedEvents(feed: HomeFeedDTO): RecommendedEventsViewModel | null {
  if (!isNonEmptyArray(feed.topOrganizers)) return null;

  return {
    title: feed.content?.topOrganizers?.title ?? 'Recommended for you',
    seeAllLabel: feed.content?.topOrganizers?.seeAllLabel ?? 'See all',
    items: feed.topOrganizers.map((o) => ({
      id: o.id,
      name: o.name,
      initials: o.initials,
      avatarColor: o.avatarColor,
      tier: o.tier,
      rating: o.rating,
      reviews: o.reviews,
      tags: o.tags,
    })),
  };
}

/** static "How Evently works" step copy. Hidden if there are no steps. */
export function mapHowItWorks(feed: HomeFeedDTO): HowItWorksViewModel | null {
  const section = feed.content?.howItWorks;
  if (!section || !isNonEmptyArray(section.steps)) return null;

  return {
    title: section.title,
    subtitle: section.subtitle,
    steps: section.steps.map((s) => ({ num: s.num, icon: s.icon, title: s.title, description: s.description })),
  };
}

/** static "Plan smarter" tools copy. Hidden if there are no tools. */
export function mapTools(feed: HomeFeedDTO): ToolsViewModel | null {
  const section = feed.content?.tools;
  if (!section || !isNonEmptyArray(section.tools)) return null;

  return {
    title: section.title,
    subtitle: section.subtitle,
    tools: section.tools.map((t) => ({ id: t.id, icon: t.icon, title: t.title, description: t.description })),
  };
}

export function mapHomeFeed(feed: HomeFeedDTO): HomeViewModel {
  return {
    banner: mapBanner(feed),
    currentEvent: mapCurrentEvent(feed),
    categories: mapCategories(feed),
    featuredEvents: mapFeaturedEvents(feed),
    recommendedEvents: mapRecommendedEvents(feed),
    howItWorks: mapHowItWorks(feed),
    tools: mapTools(feed),
  };
}
