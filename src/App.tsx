import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import {
  ArrowUpRight,
  Calendar,
  Github,
  Instagram,
  Linkedin,
  MapPin,
  Mic,
  Sparkles,
  Users,
} from "lucide-react";
import {
  type Action,
  type AppContent,
  type FeatureFlags,
  type IconName,
  type JamEvent,
  loadContent,
} from "./content";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  calendar: Calendar,
  github: Github,
  instagram: Instagram,
  linkedin: Linkedin,
  mic: Mic,
  users: Users,
};

const toneClass: Record<string, string> = {
  amber: "bg-jam-amber text-ink",
  blue: "bg-jam-blue text-cream",
  coral: "bg-jam-coral text-ink",
  forest: "bg-jam-forest text-cream",
  plum: "bg-jam-plum text-cream",
  teal: "bg-jam-teal text-cream",
};

function isEnabled(flags: FeatureFlags, key: string) {
  return flags[key] !== false;
}

function pickIcon(name?: IconName) {
  return iconMap[name || ""] || ArrowUpRight;
}

function formatTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] || "");
}

function firstFutureEvent(events: JamEvent[], now = new Date()) {
  return events
    .filter((event) => new Date(event.startDate).getTime() >= now.getTime())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];
}

function setMeta(selector: string, attr: "content" | "href", value: string) {
  const node = document.head.querySelector(selector);
  if (node) node.setAttribute(attr, value);
}

function useDocumentMetadata(content: AppContent | null, nextEvent?: JamEvent) {
  useEffect(() => {
    if (!content) return;

    const { site } = content.site;
    document.documentElement.lang = site.language;
    document.title = site.seo.defaultTitle;
    setMeta("meta[name='description']", "content", site.seo.defaultDescription);
    setMeta("link[rel='canonical']", "href", site.url);
    setMeta("meta[property='og:title']", "content", site.seo.defaultTitle);
    setMeta("meta[property='og:description']", "content", site.seo.defaultDescription);
    setMeta("meta[property='og:url']", "content", site.url);
    setMeta("meta[property='og:site_name']", "content", site.name);
    setMeta("meta[property='og:image']", "content", new URL(site.seo.ogImage, site.url).toString());
    setMeta("meta[property='og:image:alt']", "content", site.seo.ogImageAlt);
    setMeta("meta[name='twitter:title']", "content", site.seo.defaultTitle);
    setMeta("meta[name='twitter:description']", "content", site.seo.defaultDescription);
    setMeta(
      "meta[name='twitter:image']",
      "content",
      new URL(site.seo.ogImage, site.url).toString(),
    );
    setMeta("meta[name='twitter:image:alt']", "content", site.seo.ogImageAlt);

    const graph: Array<Record<string, unknown>> = [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        description: site.description,
        sameAs: content.site.community.socials.map((social) => social.href),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        publisher: { "@id": `${site.url}/#organization` },
        inLanguage: site.language,
      },
    ];

    if (nextEvent) {
      graph.push({
        "@type": "Event",
        "@id": `${site.url}/#event-${nextEvent.id}`,
        name: nextEvent.name,
        url: nextEvent.url,
        eventStatus: nextEvent.schema?.eventStatus,
        eventAttendanceMode: nextEvent.schema?.attendanceMode,
        startDate: nextEvent.startDate,
        endDate: nextEvent.endDate,
        location: {
          "@type": "Place",
          name: nextEvent.location,
          address: nextEvent.location,
        },
        organizer: { "@id": `${site.url}/#organization` },
      });
    }

    const existing = document.getElementById("site-schema");
    existing?.remove();
    const schema = document.createElement("script");
    schema.id = "site-schema";
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
    document.head.appendChild(schema);
  }, [content, nextEvent]);
}

function Pill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-4 py-1.5 text-xs font-semibold uppercase ${className}`}
    >
      {children}
    </span>
  );
}

function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] font-semibold uppercase text-ink-soft mb-4 ${className}`}>
      {children}
    </p>
  );
}

function IconAction({ action, className = "" }: { action: Action; className?: string }) {
  const Icon = pickIcon(action.icon);
  return (
    <a href={action.href} target="_blank" rel="noreferrer" className={className}>
      <span>{action.label}</span>
      <Icon className="w-4 h-4" />
    </a>
  );
}

function Header({ content, flags }: { content: AppContent; flags: FeatureFlags }) {
  const { site, navigation, hero } = content.site;
  const primary = hero.primaryCta;

  if (!isEnabled(flags, "showNavigation")) return null;

  return (
    <header className="sticky top-4 z-50 px-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-pill border border-ink/10 bg-cream/85 px-5 py-3 shadow-[0_2px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur">
        <a href="#top" className="flex items-center gap-2" aria-label={site.name}>
          <img src={site.brand.logo} alt="" className="h-9 w-9 rounded-full" />
          <span className="font-display text-lg font-semibold">{site.name}</span>
        </a>
        <div className="hidden items-center gap-7 text-sm font-medium text-ink-soft md:flex">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </a>
          ))}
        </div>
        <IconAction
          action={primary}
          className="inline-flex items-center gap-1.5 rounded-pill bg-ink px-4 py-2 text-sm font-medium text-cream transition hover:bg-jam-plum"
        />
      </nav>
    </header>
  );
}

function Hero({
  content,
  nextEvent,
  flags,
}: {
  content: AppContent;
  nextEvent?: JamEvent;
  flags: FeatureFlags;
}) {
  const { hero } = content.site;
  const hasNext = Boolean(nextEvent) && isEnabled(flags, "heroUsesNextScheduledJam");
  const eyebrow = hasNext
    ? formatTemplate(hero.nextEventEyebrowTemplate, {
        city: nextEvent!.city,
        dateShort: nextEvent!.dateShort,
        status: nextEvent!.status,
      })
    : hero.noUpcomingEyebrow;
  const title = hasNext ? hero.headline : hero.noUpcomingTitle;
  const body = hasNext ? hero.body : hero.noUpcomingBody;
  const primary = hasNext
    ? { label: nextEvent!.status, href: nextEvent!.url, icon: "calendar" }
    : hero.noUpcomingPrimaryCta;
  const secondary = hasNext ? hero.secondaryCta : hero.noUpcomingSecondaryCta;

  return (
    <section id="top" className="relative grid-bg">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-20 text-center md:pb-36 md:pt-28">
        <Pill className="mb-8 border border-ink/10 bg-cream-deep text-ink">
          <span className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-jam-coral" />
          {eyebrow}
        </Pill>
        <h1 className="font-display text-[3rem] font-semibold leading-[0.98] md:text-[5.5rem]">
          {title}
          {hasNext && (
            <>
              <br />
              <span className="scribble italic font-[700]">{hero.subheadline}</span>
            </>
          )}
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft">{body}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <IconAction
            action={primary}
            className="inline-flex items-center gap-2 rounded-pill bg-jam-coral px-6 py-3.5 font-semibold text-ink shadow-[0_8px_30px_-10px_rgba(0,0,0,0.3)] transition hover:translate-y-[-1px]"
          />
          <IconAction
            action={secondary}
            className="inline-flex items-center gap-2 rounded-pill border border-ink/15 bg-cream px-6 py-3.5 font-medium transition hover:border-ink/40"
          />
        </div>
        {isEnabled(flags, "showHeroStats") && (
          <div className="mx-auto mt-20 grid max-w-3xl grid-cols-3 gap-4 md:gap-10">
            {hero.stats.map((stat) => (
              <div
                key={stat.label}
                className="border-t border-ink/15 pt-4 text-left md:text-center"
              >
                <div className="font-display text-3xl font-semibold md:text-5xl">{stat.value}</div>
                <div className="mt-1 text-xs text-ink-soft md:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {isEnabled(flags, "showCityMarquee") && (
        <div className="overflow-hidden border-y border-ink/10 bg-cream-deep/60 py-5">
          <div className="marquee-track flex w-max gap-3">
            {[
              ...content.site.cityMarquee,
              ...content.site.cityMarquee,
              ...content.site.cityMarquee,
            ].map((city, index) => (
              <Pill
                key={`${city.name}-${index}`}
                className={`${toneClass[city.tone] || toneClass.amber} shadow-sm`}
              >
                {city.name}
              </Pill>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function About({ content }: { content: AppContent }) {
  const { about } = content.site;
  const icons = [Mic, Users, Sparkles];
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="grid gap-10 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <SectionLabel>{about.title}</SectionLabel>
          <h2 className="font-display text-4xl leading-[1.05] md:text-5xl">
            {about.paragraphs[0]}
          </h2>
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-ink-soft md:col-span-7">
          {about.paragraphs.slice(1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="grid gap-4 pt-4 sm:grid-cols-3">
            {about.highlights.map((item, index) => {
              const Icon = icons[index % icons.length];
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-ink/10 bg-cream-deep/40 p-5"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-jam-amber">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-4 font-display text-xl text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Upcoming({
  content,
  nextEvent,
  flags,
}: {
  content: AppContent;
  nextEvent?: JamEvent;
  flags: FeatureFlags;
}) {
  const { events } = content;
  const empty = events.nextEventStrategy.emptyState;
  const hasNext = Boolean(nextEvent);
  const actions = hasNext ? nextEvent!.actions || [] : empty.actions;

  return (
    <section id="events" className="bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase text-jam-amber">
              {events.title}
            </p>
            <h2 className="font-display text-4xl leading-[1.02] md:text-6xl">
              {hasNext ? nextEvent!.name : empty.title}
            </h2>
          </div>
          <p className="max-w-sm text-cream/70">
            {hasNext ? events.description : empty.description}
          </p>
        </div>

        <article className="overflow-hidden rounded-3xl border border-cream/15 bg-gradient-to-br from-cream/[0.04] to-transparent">
          {hasNext && nextEvent!.image && (
            <img
              src={nextEvent!.image}
              alt={nextEvent!.imageAlt || ""}
              className="h-72 w-full object-cover"
            />
          )}
          <div className="grid gap-8 p-8 md:grid-cols-12 md:gap-12 md:p-12">
            <div className="md:col-span-7">
              {hasNext && <Pill className="mb-8 bg-jam-amber text-ink">{nextEvent!.status}</Pill>}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-cream/80">
                {hasNext && (
                  <>
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> {nextEvent!.date}
                    </span>
                    <span>{nextEvent!.time}</span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {nextEvent!.location}
                    </span>
                  </>
                )}
              </div>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/75">
                {hasNext ? nextEvent!.description : empty.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {actions.map((action) => (
                  <IconAction
                    key={action.href}
                    action={action}
                    className={
                      action.variant === "solid"
                        ? "inline-flex items-center gap-2 rounded-pill bg-jam-coral px-6 py-3 font-semibold text-ink transition hover:translate-y-[-1px]"
                        : "inline-flex items-center gap-2 rounded-pill border border-cream/25 px-6 py-3 font-medium transition hover:border-cream/60"
                    }
                  />
                ))}
              </div>
            </div>
            {hasNext && (
              <div className="md:col-span-5">
                <p className="mb-4 text-[11px] font-semibold uppercase text-cream/50">
                  {content.site.format.splitTitle}
                </p>
                <ul className="space-y-3">
                  {nextEvent!.agenda.map((item, index) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-4 border-b border-cream/10 pb-3"
                    >
                      <span className="font-display text-lg text-jam-amber">0{index + 1}</span>
                      <span className="text-cream/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function Format({ content }: { content: AppContent }) {
  const { format } = content.site;
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionLabel>{format.title}</SectionLabel>
      <h2 className="max-w-3xl font-display text-4xl leading-[1.02] md:text-6xl">
        {format.description}
      </h2>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {format.split.map((item, index) => (
          <div
            key={item.label}
            className={`rounded-3xl p-8 ${index === 0 ? "bg-jam-amber" : index === 1 ? "bg-jam-coral" : "bg-jam-teal text-cream"}`}
          >
            <div className="font-display text-6xl font-semibold">{item.value}</div>
            <h3 className="mt-4 font-display text-2xl">{item.label}</h3>
            <p className="mt-3 text-sm leading-relaxed opacity-80">{item.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {format.principles.map((item) => (
          <div key={item.title} className="rounded-3xl border border-ink/12 bg-cream-deep/40 p-7">
            <h4 className="font-display text-xl">{item.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PastJams({ content, flags }: { content: AppContent; flags: FeatureFlags }) {
  const past = content.events.past;
  return (
    <section id="past" className="border-y border-ink/10 bg-cream-deep/60">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel>{past.title}</SectionLabel>
            <h2 className="max-w-2xl font-display text-4xl leading-[1.02] md:text-6xl">
              {past.description}
            </h2>
          </div>
          {isEnabled(flags, "showJamRepos") && (
            <IconAction
              action={past.highlightCta}
              className="inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
            />
          )}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {past.items.map((event, index) => (
            <article
              key={event.name}
              className="group flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-cream"
            >
              <img
                src={event.image}
                alt={event.imageAlt}
                className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
              <div className="flex flex-1 flex-col p-7">
                <Pill
                  className={`${index % 2 ? "bg-jam-teal text-cream" : "bg-jam-amber text-ink"} mb-5 self-start`}
                >
                  {event.status}
                </Pill>
                <h3 className="font-display text-2xl md:text-3xl">{event.name}</h3>
                <p className="mt-2 text-sm text-ink-soft">{event.date}</p>
                <p className="mt-4 leading-relaxed text-ink-soft">{event.summary}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {event.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3">
                      <span className="text-jam-coral">▸</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap gap-3 border-t border-ink/10 pt-5">
                  {isEnabled(flags, "showLumaLinks") && (
                    <IconAction
                      action={{ ...past.actions.luma, href: event.url }}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition hover:text-jam-plum"
                    />
                  )}
                  {event.repo && isEnabled(flags, "showJamRepos") && (
                    <IconAction
                      action={{ ...past.actions.repo, href: event.repo }}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition hover:text-jam-plum"
                    />
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery({ content }: { content: AppContent }) {
  const { gallery } = content;
  return (
    <section id="gallery" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionLabel>{gallery.sourceLabel}</SectionLabel>
      <h2 className="max-w-3xl font-display text-4xl leading-[1.02] md:text-6xl">
        {gallery.title}
      </h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{gallery.description}</p>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.items.map((item) => (
          <figure
            key={`${item.event}-${item.image}`}
            className="overflow-hidden rounded-3xl border border-ink/10 bg-cream"
          >
            <img src={item.image} alt={item.caption} className="h-64 w-full object-cover" />
            <figcaption className="p-5">
              <p className="font-display text-xl">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function People({ content, flags }: { content: AppContent; flags: FeatureFlags }) {
  const { people } = content;
  return (
    <section id="people" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionLabel>{people.title}</SectionLabel>
      <h2 className="max-w-3xl font-display text-4xl leading-[1.02] md:text-6xl">
        {people.speakersTitle}
      </h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{people.description}</p>
      <div className="mt-14 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {people.speakers.map((speaker) => (
          <a
            key={speaker.name}
            href={speaker.profile}
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-ink/10 bg-cream p-5 transition hover:border-ink/30"
          >
            <div className="flex items-center gap-4">
              {isEnabled(flags, "showSpeakerGithubAvatars") ? (
                <img
                  src={speaker.image}
                  alt={`${speaker.name} headshot`}
                  loading="lazy"
                  className="h-14 w-14 rounded-full bg-cream-deep object-cover"
                />
              ) : (
                <div className="grid h-14 w-14 place-items-center rounded-full bg-jam-amber/30 font-display text-lg font-semibold">
                  {speaker.name
                    .split(" ")
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold leading-tight">{speaker.name}</p>
                <p className="truncate text-xs text-ink-soft">{speaker.designation}</p>
              </div>
            </div>
            <p className="mt-4 text-[11px] uppercase text-ink-soft">{speaker.event}</p>
          </a>
        ))}
      </div>
      <p className="mt-6 text-xs text-ink-soft">{people.imagePolicy}</p>
    </section>
  );
}

function Cities({ content }: { content: AppContent }) {
  const { cities } = content.site;
  return (
    <section id="cities" className="border-y border-ink/10 bg-cream-deep/60">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <SectionLabel>{cities.title}</SectionLabel>
        <h2 className="max-w-3xl font-display text-4xl leading-[1.02] md:text-6xl">
          {cities.description}
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {cities.items.map((city, index) => (
            <div key={city.name} className="rounded-3xl border border-ink/10 bg-cream p-8">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-3xl">{city.name}</h3>
                <Pill className={index % 2 ? "bg-jam-plum text-cream" : "bg-jam-teal text-cream"}>
                  {city.status}
                </Pill>
              </div>
              <p className="mt-4 font-medium">{city.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpeakerCta({ content }: { content: AppContent }) {
  const { speakerCta } = content.site;
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink p-10 text-cream md:p-16">
        <div className="relative grid items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionLabel className="text-jam-amber">{speakerCta.title}</SectionLabel>
            <h2 className="font-display text-4xl leading-[1.02] md:text-5xl">
              {speakerCta.description}
            </h2>
          </div>
          <div className="flex md:col-span-5 md:justify-end">
            <IconAction
              action={speakerCta.cta}
              className="inline-flex items-center gap-2 rounded-pill bg-jam-amber px-7 py-4 text-lg font-semibold text-ink transition hover:translate-y-[-1px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ content }: { content: AppContent }) {
  const { site, community, footer } = content.site;
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-12 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <img src={site.brand.logo} alt="" className="h-9 w-9 rounded-full" />
          <div>
            <div className="font-display font-semibold">{site.name}</div>
            <div className="text-xs text-ink-soft">{footer.note}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
          {community.socials.map((social) => (
            <IconAction
              key={social.href}
              action={social}
              className="inline-flex items-center gap-1.5 hover:text-ink"
            />
          ))}
        </div>
        <p className="text-xs text-ink-soft">
          {formatTemplate(footer.copyrightTemplate, {
            year: String(new Date().getFullYear()),
            copyright: footer.copyright,
          })}
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  const [content, setContent] = useState<AppContent | null>(null);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    loadContent()
      .then(setContent)
      .catch((error: Error) => setLoadError(error));
  }, []);

  const nextEvent = useMemo(
    () => (content ? firstFutureEvent(content.events.upcoming) : undefined),
    [content],
  );
  useDocumentMetadata(content, nextEvent);

  if (loadError) {
    return (
      <main className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-4xl">Content could not load</h1>
          <p className="mt-4 max-w-xl text-ink-soft">{loadError.message}</p>
        </div>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="grid min-h-screen place-items-center px-6 text-center">
        <p className="text-sm font-semibold uppercase text-ink-soft">Loading site data</p>
      </main>
    );
  }

  const { flags } = content;

  return (
    <div className="min-h-screen overflow-x-hidden text-ink">
      <Header content={content} flags={flags} />
      <main>
        <Hero content={content} nextEvent={nextEvent} flags={flags} />
        {isEnabled(flags, "showAbout") && <About content={content} />}
        {isEnabled(flags, "showUpcoming") && (
          <Upcoming content={content} nextEvent={nextEvent} flags={flags} />
        )}
        {isEnabled(flags, "showFormat") && <Format content={content} />}
        {isEnabled(flags, "showPastJams") && <PastJams content={content} flags={flags} />}
        {isEnabled(flags, "showGallery") && <Gallery content={content} />}
        {isEnabled(flags, "showPeople") && <People content={content} flags={flags} />}
        {isEnabled(flags, "showCities") && <Cities content={content} />}
        {isEnabled(flags, "showSpeakerCta") && <SpeakerCta content={content} />}
      </main>
      {isEnabled(flags, "showFooter") && <Footer content={content} />}
    </div>
  );
}
