import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { ArrowUpRight, Calendar, Github, MapPin, Mic, Sparkles, Users } from "lucide-react";
import {
  type Action,
  type AppContent,
  type FeatureFlags,
  type JamEvent,
  loadContent,
} from "./content";

const cityTone: Record<string, string> = {
  amber: "bg-jam-amber text-ink",
  blue: "bg-jam-blue text-cream",
  coral: "bg-jam-coral text-ink",
  forest: "bg-jam-forest text-cream",
  plum: "bg-jam-plum text-cream",
  teal: "bg-jam-teal text-cream",
};

const speakerTints = ["bg-jam-amber/30", "bg-jam-coral/25", "bg-jam-teal/20", "bg-jam-plum/15"];
const pastAccents = ["bg-jam-amber", "bg-jam-teal", "bg-jam-coral", "bg-jam-plum"];
const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  calendar: Calendar,
  github: Github,
  mic: Mic,
  users: Users,
};

function isEnabled(flags: FeatureFlags, key: string) {
  return flags[key] !== false;
}

function formatTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] || "");
}

function pickIcon(action?: Action) {
  return iconMap[action?.icon || ""] || ArrowUpRight;
}

function firstFutureEvent(events: JamEvent[], now = new Date()) {
  return events
    .filter((event) => new Date(event.startDate).getTime() >= now.getTime())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];
}

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("");
}

function highlightPhrase(text: string, phrase?: string, className = "scribble italic") {
  if (!phrase || !text.includes(phrase)) return text;

  const [before, after] = text.split(phrase);
  return (
    <>
      {before}
      <span className={className}>{phrase}</span>
      {after}
    </>
  );
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
      className={`inline-flex items-center rounded-pill px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] ${className}`}
    >
      {children}
    </span>
  );
}

function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-ink-soft ${className}`}
    >
      {children}
    </p>
  );
}

function DJMark() {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-full bg-ink font-display text-lg font-bold italic text-jam-amber">
      DJ
    </span>
  );
}

function SplitButton({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`group inline-flex items-stretch overflow-hidden rounded-pill bg-jam-coral font-semibold text-ink shadow-[0_8px_30px_-10px_rgba(0,0,0,0.3)] transition hover:translate-y-[-1px] ${className}`}
    >
      <span className="px-6 py-3.5">{label}</span>
      <span className="grid w-12 place-items-center bg-ink text-cream transition group-hover:bg-jam-plum">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </a>
  );
}

function Header({ content }: { content: AppContent }) {
  const { site, navigation, ui } = content.site;

  return (
    <header className="sticky top-4 z-50 px-4">
      <nav
        aria-label={ui.header.navLabel}
        className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-pill border border-ink/10 bg-cream/85 px-5 py-3 shadow-[0_2px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur"
      >
        <a href="#top" className="flex items-center gap-2" aria-label={ui.header.homeLabel}>
          <DJMark />
          <span className="font-display text-lg font-semibold tracking-tight">{site.name}</span>
        </a>
        <div className="hidden items-center gap-7 text-sm font-medium text-ink-soft md:flex">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </a>
          ))}
        </div>
        <a
          href={content.events.calendarUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-pill bg-ink px-3 py-2 text-sm font-medium text-cream transition hover:bg-jam-plum sm:px-4"
        >
          <span className="hidden sm:inline">{content.site.hero.primaryCta.label}</span>
          <span className="sm:hidden">Join</span>
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </nav>
    </header>
  );
}

function Hero({ content, nextEvent }: { content: AppContent; nextEvent?: JamEvent }) {
  const { flags } = content;
  const { hero } = content.site;
  const hasNext = Boolean(nextEvent) && isEnabled(flags, "heroUsesNextScheduledJam");
  const primaryAction =
    hasNext && nextEvent
      ? nextEvent.actions?.find((action) => action.variant === "solid") || {
          label: nextEvent.status,
          href: nextEvent.url,
        }
      : hero.noUpcomingPrimaryCta;
  const secondaryAction = hasNext ? hero.secondaryCta : hero.noUpcomingSecondaryCta;
  const SecondaryIcon = pickIcon(secondaryAction);
  const eyebrow =
    hasNext && nextEvent
      ? formatTemplate(hero.nextEventEyebrowTemplate, {
          city: nextEvent.city,
          dateShort: nextEvent.dateShort,
          status: nextEvent.status,
        })
      : hero.noUpcomingEyebrow;
  const title = hasNext ? hero.headline : hero.noUpcomingTitle;
  const body = hasNext ? hero.body : hero.noUpcomingBody;
  const rawSubheadline = hasNext ? hero.subheadline : "";
  const subheadlineMatch = rawSubheadline.match(/^in\s+(.+?)(\.)?$/i);
  const subheadlineCore = subheadlineMatch?.[1] || rawSubheadline;
  const subheadlinePunctuation = subheadlineMatch?.[2] || "";

  return (
    <section id="top" className="relative overflow-hidden grid-bg">
      <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-20 text-center md:pb-36 md:pt-28">
        <Pill className="mb-8 max-w-full border border-ink/10 bg-cream-deep text-ink">
          <span className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-jam-coral" />
          <span className="text-center leading-relaxed">{eyebrow}</span>
        </Pill>
        <h1 className="mx-auto max-w-5xl break-words font-display text-[1.84rem] font-semibold leading-[1.04] tracking-tight sm:text-[3rem] md:text-[5.5rem] md:leading-[0.98]">
          {hasNext ? (
            <>
              {title}
              <br />
              {subheadlineMatch ? (
                <>
                  <span className="inline sm:hidden">in</span>
                  <br className="sm:hidden" />
                  <span className="hidden sm:inline">in </span>
                  <span className="scribble italic font-[700]">{subheadlineCore}</span>
                  {subheadlinePunctuation}
                </>
              ) : (
                <span className="scribble italic font-[700]">{subheadlineCore}</span>
              )}
            </>
          ) : (
            title
          )}
        </h1>
        <p className="mx-auto mt-7 max-w-[calc(100vw-3rem)] text-lg leading-relaxed text-ink-soft sm:max-w-2xl">
          {body}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          <SplitButton href={primaryAction.href} label={primaryAction.label} />
          <a
            href={secondaryAction.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-pill border border-ink/15 bg-cream px-6 py-3.5 font-medium transition hover:border-ink/40"
          >
            <SecondaryIcon className="h-4 w-4" /> {secondaryAction.label}
          </a>
        </div>
        {isEnabled(flags, "showHeroStats") && (
          <div className="mx-auto mt-20 grid w-full max-w-[calc(100vw-3rem)] grid-cols-3 gap-3 sm:max-w-3xl md:gap-10">
            {hero.stats.map((stat) => (
              <div
                key={stat.label}
                className="border-t border-ink/15 pt-4 text-left md:text-center"
              >
                <div className="font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-5xl">
                  {stat.value}
                </div>
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
            ].map((cityItem, index) => (
              <Pill
                key={`${cityItem.name}-${index}`}
                className={`${cityTone[cityItem.tone] || cityTone.amber} shadow-sm`}
              >
                {cityItem.name}
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
  const heading = about.heading || about.paragraphs[0];
  const paragraphs = about.heading ? about.paragraphs : about.paragraphs.slice(1);

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="grid gap-10 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <SectionLabel>{about.title}</SectionLabel>
          <h2 className="font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
            {highlightPhrase(heading, about.headingEmphasis)}
          </h2>
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-ink-soft md:col-span-7">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="grid gap-4 pt-4 sm:grid-cols-3">
            {about.highlights.map((item, index) => {
              const Icon = [Mic, Users, Sparkles][index % 3];
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-2 text-sm font-semibold text-ink"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-jam-amber">
                    <Icon className="h-4 w-4" />
                  </span>
                  {item.title}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Upcoming({ content, nextEvent }: { content: AppContent; nextEvent?: JamEvent }) {
  const { events, flags } = content;
  const empty = content.events.nextEventStrategy.emptyState;
  const solidAction = nextEvent?.actions?.find((action) => action.variant === "solid");
  const ghostAction = nextEvent?.actions?.find((action) => action.variant === "ghost");

  return (
    <section id="upcoming" className="bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-jam-amber">
              {events.title}
            </p>
            <h2 className="font-display text-4xl leading-[1.02] tracking-tight md:text-6xl">
              {nextEvent
                ? highlightPhrase(
                    events.heading || events.description,
                    events.headingEmphasis,
                    "italic text-jam-amber",
                  )
                : empty.title}
            </h2>
          </div>
          <p className="max-w-sm text-cream/70">
            {nextEvent ? events.description : empty.description}
          </p>
        </div>

        <article className="rounded-3xl border border-cream/15 bg-gradient-to-br from-cream/[0.04] to-transparent p-8 md:p-12">
          {nextEvent ? (
            <div>
              <Pill className="mb-8 bg-jam-amber text-ink">{nextEvent.status}</Pill>
              <div className="grid gap-8 md:grid-cols-12 md:gap-12">
                <div className="md:col-span-7">
                  <h3 className="font-display text-3xl tracking-tight md:text-5xl">
                    {nextEvent.name.replace(" - ", " — ")}
                  </h3>
                  <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-cream/80">
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> {nextEvent.date}
                    </span>
                    <span>{nextEvent.time}</span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {nextEvent.city}
                    </span>
                  </div>
                  <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/75">
                    {nextEvent.description}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <SplitButton
                      href={solidAction?.href || nextEvent.url}
                      label={solidAction?.label || nextEvent.status}
                      className="shadow-none"
                    />
                    {ghostAction && (
                      <a
                        href={ghostAction.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-pill border border-cream/25 px-6 py-3 font-medium transition hover:border-cream/60"
                      >
                        {ghostAction.label}
                      </a>
                    )}
                  </div>
                </div>
                <div className="md:col-span-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-cream/50">
                    {events.agendaLabel || "Agenda"}
                  </p>
                  <ul className="space-y-3">
                    {nextEvent.agenda.map((item, index) => (
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
              </div>
            </div>
          ) : (
            <div className="max-w-2xl">
              <h3 className="font-display text-3xl tracking-tight md:text-5xl">{empty.title}</h3>
              <p className="mt-6 text-lg leading-relaxed text-cream/75">{empty.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {isEnabled(flags, "showNoUpcomingFallback") &&
                  empty.actions.map((action) => (
                    <a
                      key={action.href}
                      href={action.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-pill border border-cream/25 px-6 py-3 font-medium transition hover:border-cream/60"
                    >
                      {action.label}
                    </a>
                  ))}
              </div>
            </div>
          )}
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
      <h2 className="max-w-3xl font-display text-4xl leading-[1.02] tracking-tight md:text-6xl">
        {highlightPhrase(format.heading || format.description, format.headingEmphasis)}
      </h2>
      <p className="mt-6 max-w-2xl text-lg text-ink-soft">{format.description}</p>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {format.split.map((item, index) => (
          <div
            key={item.label}
            className={`rounded-3xl p-8 ${index === 0 ? "bg-jam-amber" : index === 1 ? "bg-jam-coral" : "bg-jam-teal text-cream"}`}
          >
            <div className="font-display text-6xl font-semibold tracking-tight">{item.value}</div>
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

function PastJams({ content }: { content: AppContent }) {
  const past = content.events.past;
  const { flags } = content;

  return (
    <section id="past" className="border-y border-ink/10 bg-cream-deep/60">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel>{past.title}</SectionLabel>
            <h2 className="max-w-2xl font-display text-4xl leading-[1.02] tracking-tight md:text-6xl">
              {highlightPhrase(past.description, past.descriptionEmphasis, "italic")}
            </h2>
          </div>
          {isEnabled(flags, "showJamRepos") && (
            <a
              href={past.highlightCta.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
            >
              {past.highlightCta.label} <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {past.items.map((event, index) => (
            <article
              key={event.name}
              className="group flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-cream"
            >
              <div className={`h-2 ${pastAccents[index % pastAccents.length]}`} />
              <div className="flex flex-1 flex-col p-7">
                <Pill className="mb-5 self-start bg-ink/8 text-ink-soft">{event.status}</Pill>
                <h3 className="font-display text-2xl tracking-tight md:text-3xl">{event.name}</h3>
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
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition hover:text-jam-plum"
                    >
                      {past.actions.luma.label} <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {event.repo && isEnabled(flags, "showJamRepos") && (
                    <>
                      {isEnabled(flags, "showLumaLinks") && <span className="text-ink/30">·</span>}
                      <a
                        href={event.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold transition hover:text-jam-plum"
                      >
                        <Github className="h-3.5 w-3.5" /> {past.actions.repo.label}
                      </a>
                    </>
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

function Speakers({ content }: { content: AppContent }) {
  const { people } = content;
  const { flags } = content;

  return (
    <section id="speakers" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionLabel>{people.title}</SectionLabel>
      <h2 className="max-w-3xl font-display text-4xl leading-[1.02] tracking-tight md:text-6xl">
        {highlightPhrase(people.speakersTitle, people.speakersTitleEmphasis)}
      </h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{people.description}</p>
      <div className="mt-14 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {people.speakers.map((speaker, index) => (
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
                  alt={`${speaker.name} ${content.site.ui.images.headshotSuffix}`}
                  loading="lazy"
                  className="h-12 w-12 rounded-full bg-cream-deep object-cover"
                />
              ) : (
                <div
                  className={`grid h-12 w-12 place-items-center rounded-full ${speakerTints[index % speakerTints.length]} font-display text-lg font-semibold`}
                >
                  {initials(speaker.name)}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold leading-tight">{speaker.name}</p>
                <p className="truncate text-xs text-ink-soft">{speaker.designation}</p>
              </div>
            </div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              {speaker.event}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}

function Cities({ content }: { content: AppContent }) {
  const { cities } = content.site;

  return (
    <section id="cities" className="border-y border-ink/10 bg-cream-deep/60">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <SectionLabel>{cities.title}</SectionLabel>
        <h2 className="max-w-3xl font-display text-4xl leading-[1.02] tracking-tight md:text-6xl">
          {highlightPhrase(cities.description, cities.descriptionEmphasis)}
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {cities.items.map((city, index) => (
            <div key={city.name} className="rounded-3xl border border-ink/10 bg-cream p-8">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-3xl">{city.name}</h3>
                <Pill className={index % 2 ? "bg-jam-plum text-cream" : "bg-jam-teal text-cream"}>
                  {city.label || city.status}
                </Pill>
              </div>
              <p className="mt-3 text-ink-soft">{city.status}</p>
              <p className="mt-4 font-medium">{city.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-2">
          {content.site.cityMarquee.map((city) => (
            <Pill key={city.name} className={`${cityTone[city.tone] || cityTone.amber} floaty`}>
              {city.name}
            </Pill>
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
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-jam-amber/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-jam-coral/20 blur-3xl" />
        <div className="relative grid items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionLabel className="text-jam-amber">{speakerCta.title}</SectionLabel>
            <h2 className="font-display text-4xl leading-[1.02] tracking-tight md:text-5xl">
              {highlightPhrase(speakerCta.description, speakerCta.descriptionEmphasis)}
            </h2>
          </div>
          <div className="flex md:col-span-5 md:justify-end">
            <a
              href={speakerCta.cta.href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-stretch overflow-hidden rounded-pill bg-jam-amber text-lg font-semibold text-ink transition hover:translate-y-[-1px]"
            >
              <span className="px-7 py-4">{speakerCta.cta.label}</span>
              <span className="grid w-14 place-items-center bg-ink text-jam-amber transition group-hover:bg-jam-plum group-hover:text-cream">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </a>
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
          <DJMark />
          <div>
            <div className="font-display font-semibold">{site.name}</div>
            <div className="text-xs text-ink-soft">{site.tagline}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
          {community.socials.map((social) => {
            const Icon = pickIcon(social);
            return (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-ink"
              >
                <Icon className="h-3.5 w-3.5" /> {social.label}
              </a>
            );
          })}
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
          <h1 className="font-display text-4xl">
            {content?.site.ui.loadErrorTitle || "DevRelJam data unavailable"}
          </h1>
          <p className="mt-4 max-w-xl text-ink-soft">
            {content?.site.ui.loadErrorBody || loadError.message}
          </p>
        </div>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="grid min-h-screen place-items-center px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-ink-soft">
          Loading DevRelJam site data...
        </p>
      </main>
    );
  }

  const { flags } = content;

  return (
    <div className="min-h-screen overflow-x-hidden text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-pill focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-cream"
      >
        {content.site.ui.skipLink}
      </a>
      {isEnabled(flags, "showNavigation") && <Header content={content} />}
      <main id="main">
        <Hero content={content} nextEvent={nextEvent} />
        {isEnabled(flags, "showAbout") && <About content={content} />}
        {isEnabled(flags, "showUpcoming") && <Upcoming content={content} nextEvent={nextEvent} />}
        {isEnabled(flags, "showFormat") && <Format content={content} />}
        {isEnabled(flags, "showPastJams") && <PastJams content={content} />}
        {isEnabled(flags, "showPeople") && <Speakers content={content} />}
        {isEnabled(flags, "showCities") && <Cities content={content} />}
        {isEnabled(flags, "showSpeakerCta") && <SpeakerCta content={content} />}
      </main>
      {isEnabled(flags, "showFooter") && <Footer content={content} />}
    </div>
  );
}
