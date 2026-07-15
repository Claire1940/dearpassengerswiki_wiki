"use client";

import { useState, Suspense, lazy } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock,
  ExternalLink,
  Globe,
  Lightbulb,
  MapPin,
  MessageSquare,
  Package,
  Plane,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Tone / level badge color helpers (semantic Tailwind colors, no hardcoded hex)
function statusToneClasses(tone: string) {
  if (tone === "success")
    return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
  if (tone === "pending")
    return "bg-amber-500/10 border-amber-500/30 text-amber-400";
  return "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]";
}

function levelClasses(level: string) {
  switch (level) {
    case "Low":
      return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
    case "Medium":
      return "bg-amber-500/10 border-amber-500/30 text-amber-400";
    case "High":
      return "bg-orange-500/10 border-orange-500/30 text-orange-400";
    case "Extreme":
      return "bg-red-500/10 border-red-500/30 text-red-400";
    default:
      return "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]";
  }
}

// Shared module section header (eyebrow + title + intro)
function ModuleHeader({
  eyebrow,
  EyebrowIcon,
  title,
  intro,
}: {
  eyebrow: string;
  EyebrowIcon: React.ElementType;
  title: string;
  intro: string;
}) {
  return (
    <div className="text-center mb-10 md:mb-14 scroll-reveal">
      <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
        <EyebrowIcon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
        <span className="text-xs md:text-sm font-semibold tracking-wide uppercase text-[hsl(var(--nav-theme-light))]">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 leading-tight">
        {title}
      </h2>
      <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
        {intro}
      </p>
    </div>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.dearpassengerswiki.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Dear Passengers Wiki",
        description:
          "Dear Passengers Wiki with release date news, co-op roles, passenger and cargo guides, flight hazards, system requirements, demo updates, and Steam details.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Dear Passengers - Chaotic Physics-Based Airline Co-op",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Dear Passengers Wiki",
        alternateName: "Dear Passengers",
        url: siteUrl,
        description:
          "Complete Dear Passengers Wiki resource hub for co-op roles, passengers, cargo, flight hazards, release news, and system requirements",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Dear Passengers Wiki - Chaotic Physics-Based Airline Co-op",
        },
        sameAs: [
          "https://store.steampowered.com/app/4534960/Dear_Passengers/",
          "https://discord.com/invite/D6EKQPdFRT",
          "https://steamcommunity.com/app/4534960",
          "https://www.youtube.com/@FLEXUSGames",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Dear Passengers",
        gamePlatform: ["PC"],
        applicationCategory: "Game",
        genre: ["Co-op", "Action", "Adventure", "Indie"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 4,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/PreOrder",
          url: "https://store.steampowered.com/app/4534960/Dear_Passengers/",
        },
      },
      {
        "@type": "VideoObject",
        name: "Dear Passengers - Official Trailer",
        description:
          "Official Dear Passengers trailer from FLEXUS Games showcasing the chaotic physics-based airline co-op gameplay.",
        uploadDate: "2026-07-14",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/XRvd_HZesys",
        url: "https://www.youtube.com/watch?v=XRvd_HZesys",
      },
    ],
  };

  // Accordion states
  const [hazardExpanded, setHazardExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Tools Grid section mapping (8 navigation cards -> 8 module sections)
  const sectionIds = [
    "release-date-price-platforms",
    "beginner-guide",
    "co-op-roles",
    "passengers-cargo",
    "flight-hazards",
    "cabin-service",
    "system-requirements",
    "updates-community",
  ];

  // System requirements grouped sections (rendered in fixed order)
  const specSections = [
    "Minimum Requirements",
    "Recommended Requirements",
    "Supported Languages",
  ];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("release-date-price-platforms")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/4534960/Dear_Passengers/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 区域之后 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="XRvd_HZesys"
              title="Dear Passengers - Official Trailer"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards (模块导航区，位于视频区之后、Latest Updates 之前) */}
      <section id="tools-grid" className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = sectionIds[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section（模板固定模块，不修改） */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* Module 1: Release Date, Price and Platforms (table) */}
      <section
        id="release-date-price-platforms"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.dearPassengersReleaseDatePricePlatforms.eyebrow}
            EyebrowIcon={Plane}
            title={t.modules.dearPassengersReleaseDatePricePlatforms.title}
            intro={t.modules.dearPassengersReleaseDatePricePlatforms.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.dearPassengersReleaseDatePricePlatforms.items.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-base">{item.topic}</h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${statusToneClasses(
                        item.tone,
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.details}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Beginner Guide (step-by-step) */}
      <section
        id="beginner-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.dearPassengersBeginnerGuide.eyebrow}
            EyebrowIcon={BookOpen}
            title={t.modules.dearPassengersBeginnerGuide.title}
            intro={t.modules.dearPassengersBeginnerGuide.intro}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.dearPassengersBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-3">
                      {step.description}
                    </p>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)]">
                      <Lightbulb className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {step.tip}
                      </span>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 3: Co-op Roles and Team Strategy (card-list) */}
      <section
        id="co-op-roles"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.dearPassengersCoopRoles.eyebrow}
            EyebrowIcon={Users}
            title={t.modules.dearPassengersCoopRoles.title}
            intro={t.modules.dearPassengersCoopRoles.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.dearPassengersCoopRoles.roles.map(
              (role: any, index: number) => (
                <div
                  key={index}
                  className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center">
                      <Users className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">
                        {role.role}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {role.location}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {role.duties.map((duty: string, di: number) => (
                      <li
                        key={di}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span>{duty}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto space-y-2 text-sm">
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.03]">
                      <MessageSquare className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{role.comms}</span>
                    </div>
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)]">
                      <Target className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        {role.strategy}
                      </span>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 4: Passengers and Cargo Guide (risk-reward-table) */}
      <section
        id="passengers-cargo"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.dearPassengersPassengersCargo.eyebrow}
            EyebrowIcon={Package}
            title={t.modules.dearPassengersPassengersCargo.title}
            intro={t.modules.dearPassengersPassengersCargo.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.dearPassengersPassengersCargo.risks.map(
              (risk: any, index: number) => (
                <div
                  key={index}
                  className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-bold text-base leading-tight">
                      {risk.category}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${levelClasses(
                        risk.level,
                      )}`}
                    >
                      {risk.level} Risk
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {risk.behavior}
                  </p>
                  <div className="space-y-2 text-sm mt-auto">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        <span className="text-foreground font-medium">
                          Payout:
                        </span>{" "}
                        {risk.reward}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        {risk.mainRisk}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)]">
                      <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        {risk.response}
                      </span>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 5: 中段移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 5: Flight Hazards and Emergencies (accordion) */}
      <section
        id="flight-hazards"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.dearPassengersFlightHazards.eyebrow}
            EyebrowIcon={AlertTriangle}
            title={t.modules.dearPassengersFlightHazards.title}
            intro={t.modules.dearPassengersFlightHazards.intro}
          />
          <div className="scroll-reveal space-y-2">
            {t.modules.dearPassengersFlightHazards.hazards.map(
              (hazard: any, index: number) => {
                const open = hazardExpanded === index;
                return (
                  <div
                    key={index}
                    className="border border-border rounded-xl overflow-hidden bg-white/5"
                  >
                    <button
                      onClick={() =>
                        setHazardExpanded(open ? null : index)
                      }
                      className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="flex items-center gap-3 font-semibold">
                        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                        {hazard.hazard}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    {open && (
                      <div className="px-5 pb-5 space-y-3">
                        <p className="text-sm text-muted-foreground">
                          {hazard.what}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <Zap className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="text-foreground font-medium">
                              First response:
                            </span>{" "}
                            {hazard.firstResponse}
                          </span>
                        </div>
                        <ul className="space-y-1.5">
                          {hazard.actions.map((action: string, ai: number) => (
                            <li
                              key={ai}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-sm">
                          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="text-red-400 font-medium">
                              Escalation:
                            </span>{" "}
                            {hazard.escalation}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Module 6: Cabin Service and Passenger Management (task-priority-list) */}
      <section
        id="cabin-service"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.dearPassengersCabinService.eyebrow}
            EyebrowIcon={ClipboardCheck}
            title={t.modules.dearPassengersCabinService.title}
            intro={t.modules.dearPassengersCabinService.intro}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.dearPassengersCabinService.priorities.map(
              (p: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {p.priority}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg md:text-xl font-bold mb-2">
                      {p.task}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] font-medium">
                        <ClipboardCheck className="w-3 h-3" />
                        {p.role}
                      </span>
                      <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-white/[0.05] border border-border text-muted-foreground">
                        {p.trigger}
                      </span>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground mb-3">
                      {p.action}
                    </p>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)]">
                      <Lightbulb className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {p.value}
                      </span>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 7: System Requirements and Languages (table) */}
      <section
        id="system-requirements"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.dearPassengersSystemRequirements.eyebrow}
            EyebrowIcon={Settings}
            title={t.modules.dearPassengersSystemRequirements.title}
            intro={t.modules.dearPassengersSystemRequirements.intro}
          />
          <div className="scroll-reveal space-y-8">
            {specSections.map((sectionName) => {
              const rows =
                t.modules.dearPassengersSystemRequirements.specs.filter(
                  (s: any) => s.section === sectionName,
                );
              if (!rows.length) return null;
              const isLanguage = sectionName === "Supported Languages";
              return (
                <div key={sectionName}>
                  <div className="flex items-center gap-2 mb-4">
                    {isLanguage ? (
                      <Globe className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    ) : (
                      <Settings className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    )}
                    <h3 className="text-xl font-bold">{sectionName}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {rows.map((row: any, ri: number) => (
                      <div
                        key={ri}
                        className="p-4 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                      >
                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {row.label}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                            {row.value}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {row.details}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 8: Updates, Trailer and Community (timeline) */}
      <section
        id="updates-community"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.dearPassengersUpdatesTrailerCommunity.eyebrow}
            EyebrowIcon={TrendingUp}
            title={t.modules.dearPassengersUpdatesTrailerCommunity.title}
            intro={t.modules.dearPassengersUpdatesTrailerCommunity.intro}
          />
          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6">
            {t.modules.dearPassengersUpdatesTrailerCommunity.timeline.map(
              (entry: any, index: number) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[1.6rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                  <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                        <Clock className="w-3 h-3" />
                        {entry.date}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/[0.05] border border-border text-muted-foreground">
                        {entry.category}
                      </span>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                        {entry.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-1.5">{entry.headline}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {entry.details}
                    </p>
                    {entry.url && (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm font-medium hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
                      >
                        {entry.linkLabel}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner (footer 区) */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/D6EKQPdFRT"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@FLEXUSGames"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://steamcommunity.com/app/4534960"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/4534960/Dear_Passengers/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
