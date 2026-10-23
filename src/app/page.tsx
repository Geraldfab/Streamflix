import React from "react";
import { tmdbService } from "@/lib/tmdb";
import { HeroBanner } from "@/components/home/hero-banner";
import { ContentRail } from "@/components/home/content-rail";
import { SHOWCASE_CATALOG } from "@/lib/constants";

export const revalidate = 3600; // 1 hour ISR

export default async function HomePage() {
  // Fetch real data with fallback
  const [trending, popularMovies, popularTv, topRated] = await Promise.all([
    tmdbService.getTrending("all", "week"),
    tmdbService.getPopular("movie", 1),
    tmdbService.getPopular("tv", 1),
    tmdbService.getTopRated("movie", 1),
  ]);

  // Curated genre categories
  const sciFiItems = SHOWCASE_CATALOG.filter((i) => i.genreIds?.includes(878) || i.genreIds?.includes(10765));
  const animationItems = SHOWCASE_CATALOG.filter((i) => i.genreIds?.includes(16));
  const dramaItems = SHOWCASE_CATALOG.filter((i) => i.genreIds?.includes(18));

  // Top featured spotlight titles for Hero
  const featured = trending.slice(0, 5);

  return (
    <div className="pb-16 overflow-hidden">
      {/* Featured Hero Banner Carousel */}
      <HeroBanner featuredItems={featured.length > 0 ? featured : SHOWCASE_CATALOG.slice(0, 5)} />

      <div className="space-y-6 sm:space-y-8 -mt-10 sm:-mt-16 relative z-20">
        {/* Trending Now */}
        <ContentRail
          title="Trending Now"
          items={trending}
          seeAllHref="/movies?sort=popularity.desc"
          badge="Hot"
        />

        {/* Popular Blockbuster Movies */}
        <ContentRail
          title="Popular Movies"
          items={popularMovies.results}
          seeAllHref="/movies"
        />

        {/* Binge-Worthy TV Series */}
        <ContentRail
          title="Critically Acclaimed TV Series"
          items={popularTv.results}
          seeAllHref="/series"
        />

        {/* Top Rated Masterpieces */}
        <ContentRail
          title="All-Time Masterpieces"
          items={topRated}
          seeAllHref="/movies?sort=vote_average.desc&minRating=8"
          badge="Must Watch"
        />

        {/* Sci-Fi & Speculative Worlds */}
        <ContentRail
          title="Sci-Fi & Futuristic Realities"
          items={sciFiItems}
          seeAllHref="/genre/sci-fi"
        />

        {/* Animation & Anime */}
        <ContentRail
          title="Visual Masterpieces & Animation"
          items={animationItems}
          seeAllHref="/genre/animation"
        />

        {/* Drama & Gripping Stories */}
        <ContentRail
          title="Deep Drama & Intrigue"
          items={dramaItems}
          seeAllHref="/genre/drama"
        />
      </div>
    </div>
  );
}
