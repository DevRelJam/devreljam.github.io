export type IconName = "calendar" | "github" | "instagram" | "linkedin" | "mic" | "users" | string;

export type Action = {
  label: string;
  href: string;
  icon?: IconName;
  variant?: "solid" | "ghost" | "quiet" | string;
};

export type SiteContent = {
  site: {
    name: string;
    domain: string;
    url: string;
    language: string;
    tagline: string;
    description: string;
    brand: {
      logo: string;
      cover: string;
      favicon: string;
    };
    seo: {
      defaultTitle: string;
      defaultDescription: string;
      ogImage: string;
      ogImageAlt: string;
    };
  };
  navigation: Array<{ label: string; href: string }>;
  hero: {
    headline: string;
    subheadline: string;
    body: string;
    primaryCta: Action;
    secondaryCta: Action;
    nextEventEyebrowTemplate: string;
    noUpcomingEyebrow: string;
    noUpcomingTitle: string;
    noUpcomingBody: string;
    noUpcomingPrimaryCta: Action;
    noUpcomingSecondaryCta: Action;
    stats: Array<{ value: string; label: string }>;
    links: Action[];
  };
  about: {
    title: string;
    paragraphs: string[];
    highlights: Array<{ title: string; body: string }>;
  };
  format: {
    title: string;
    description: string;
    splitTitle: string;
    principlesTitle: string;
    split: Array<{ value: string; label: string; body: string }>;
    principles: Array<{ title: string; body: string }>;
  };
  cities: {
    title: string;
    description: string;
    items: Array<{ name: string; status: string; detail: string }>;
  };
  community: {
    socials: Action[];
  };
  speakerCta: {
    title: string;
    description: string;
    cta: Action;
  };
  footer: {
    note: string;
    copyright: string;
    copyrightTemplate: string;
  };
  ui: {
    loading: string;
    loadErrorTitle: string;
    loadErrorBody: string;
  };
  cityMarquee: Array<{ name: string; tone: string }>;
};

export type JamEvent = {
  id: string;
  name: string;
  shortName?: string;
  city: string;
  date: string;
  dateShort: string;
  startDate: string;
  endDate: string;
  time: string;
  timezone: string;
  location: string;
  status: string;
  description: string;
  agenda: string[];
  url: string;
  repo?: string;
  template?: string;
  image?: string;
  imageAlt?: string;
  actions?: Action[];
  schema?: Record<string, string>;
};

export type EventsContent = {
  calendarUrl: string;
  title: string;
  description: string;
  nextEventStrategy: {
    mode: string;
    emptyState: {
      title: string;
      description: string;
      actions: Action[];
    };
  };
  upcoming: JamEvent[];
  past: {
    title: string;
    description: string;
    highlightUrl: string;
    items: Array<{
      name: string;
      city: string;
      date: string;
      location: string;
      url: string;
      repo?: string;
      image: string;
      imageAlt: string;
      status: string;
      summary: string;
      highlights: string[];
    }>;
    actions: {
      luma: Action;
      repo: Action;
    };
    highlightCta: Action;
  };
};

export type PeopleContent = {
  title: string;
  description: string;
  speakersTitle: string;
  imagePolicy: string;
  speakers: Array<{
    name: string;
    designation: string;
    event: string;
    image: string;
    imageSource: string;
    github: string;
    profile: string;
  }>;
};

export type GalleryContent = {
  title: string;
  description: string;
  sourceLabel: string;
  items: Array<{
    title: string;
    caption: string;
    image: string;
    event: string;
  }>;
};

export type FeatureFlags = Record<string, boolean>;

export type AppContent = {
  site: SiteContent;
  events: EventsContent;
  people: PeopleContent;
  gallery: GalleryContent;
  flags: FeatureFlags;
};

async function loadJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`Could not load ${path}: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function loadContent(): Promise<AppContent> {
  const [site, events, people, gallery, flags] = await Promise.all([
    loadJson<SiteContent>("/data/site.json"),
    loadJson<EventsContent>("/data/events.json"),
    loadJson<PeopleContent>("/data/people.json"),
    loadJson<GalleryContent>("/data/gallery.json"),
    loadJson<FeatureFlags>("/data/feature-flags.json"),
  ]);

  return { site, events, people, gallery, flags };
}
