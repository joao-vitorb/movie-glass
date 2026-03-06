import type { StructuredFilters } from "@/types/filters";
import type { MediaCardItem, RankedMediaItem } from "@/types/media";

function normalizeText(value: string) {
  return value.toLowerCase().trim();
}

function getOverlapCount(source: string[], target: string[]) {
  if (source.length === 0 || target.length === 0) {
    return 0;
  }

  const normalizedTarget = new Set(target.map(normalizeText));

  return source.reduce((count, item) => {
    return normalizedTarget.has(normalizeText(item)) ? count + 1 : count;
  }, 0);
}

function getKeywordScore(item: MediaCardItem, keywords: string[]) {
  if (keywords.length === 0) {
    return 0;
  }

  const searchableText = `${item.title} ${item.overview}`.toLowerCase();

  return keywords.reduce((score, keyword) => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) {
      return score;
    }

    return searchableText.includes(normalizedKeyword) ? score + 1.5 : score;
  }, 0);
}

function getYearScore(item: MediaCardItem, filters: StructuredFilters) {
  if (filters.yearFrom === 0 || filters.yearTo === 0 || !item.year) {
    return 0;
  }

  if (item.year >= filters.yearFrom && item.year <= filters.yearTo) {
    return 2;
  }

  const distance = Math.min(
    Math.abs(filters.yearFrom - item.year),
    Math.abs(filters.yearTo - item.year),
  );

  if (distance <= 2) {
    return 1;
  }

  return 0;
}

function getPresentationScore(item: MediaCardItem) {
  const voteScore = item.voteAverage * 1.2;
  const popularityScore = Math.min(item.popularity, 1000) / 120;
  const posterBonus = item.posterUrl ? 0.8 : 0;

  return voteScore + popularityScore + posterBonus;
}

function calculateMatchScore(
  item: MediaCardItem,
  filters: StructuredFilters,
) {
  const genreScore = getOverlapCount(item.genres, filters.genres) * 4;
  const avoidPenalty = getOverlapCount(item.genres, filters.avoidGenres) * 5;
  const keywordScore = getKeywordScore(item, filters.keywords);
  const yearScore = getYearScore(item, filters);
  const presentationScore = getPresentationScore(item);

  return Number(
    (
      genreScore +
      keywordScore +
      yearScore +
      presentationScore -
      avoidPenalty
    ).toFixed(1),
  );
}

export function rankMediaItems(
  items: MediaCardItem[],
  filters: StructuredFilters,
): RankedMediaItem[] {
  return items
    .map((item) => ({
      ...item,
      matchScore: calculateMatchScore(item, filters),
    }))
    .sort((firstItem, secondItem) => {
      if (secondItem.matchScore !== firstItem.matchScore) {
        return secondItem.matchScore - firstItem.matchScore;
      }

      if (secondItem.voteAverage !== firstItem.voteAverage) {
        return secondItem.voteAverage - firstItem.voteAverage;
      }

      return secondItem.popularity - firstItem.popularity;
    });
}

function mixRankedMediaItems(items: RankedMediaItem[]) {
  const movies = items.filter((item) => item.mediaType === "movie");
  const tvShows = items.filter((item) => item.mediaType === "tv");

  if (movies.length === 0 || tvShows.length === 0) {
    return items;
  }

  const mixedItems: RankedMediaItem[] = [];
  let movieIndex = 0;
  let tvIndex = 0;

  let pickMovieFirst =
    (movies[0]?.matchScore ?? 0) >= (tvShows[0]?.matchScore ?? 0);

  while (movieIndex < movies.length || tvIndex < tvShows.length) {
    if (pickMovieFirst && movieIndex < movies.length) {
      mixedItems.push(movies[movieIndex]);
      movieIndex += 1;
    } else if (!pickMovieFirst && tvIndex < tvShows.length) {
      mixedItems.push(tvShows[tvIndex]);
      tvIndex += 1;
    } else if (movieIndex < movies.length) {
      mixedItems.push(movies[movieIndex]);
      movieIndex += 1;
    } else if (tvIndex < tvShows.length) {
      mixedItems.push(tvShows[tvIndex]);
      tvIndex += 1;
    }

    pickMovieFirst = !pickMovieFirst;
  }

  return mixedItems;
}

export function buildRankedMediaFeed(
  items: MediaCardItem[],
  filters: StructuredFilters,
  limit = 12,
) {
  const rankedItems = rankMediaItems(items, filters);

  const orderedItems =
    filters.mediaType === "both"
      ? mixRankedMediaItems(rankedItems)
      : rankedItems;

  return orderedItems.slice(0, limit);
}
