import type {
  GuidedFiltersState,
  ReleaseWindow,
  StructuredFilters,
} from "@/types/filters";

function getYearRange(releaseWindow: ReleaseWindow) {
  const currentYear = new Date().getFullYear();

  if (releaseWindow === "classic") {
    return {
      yearFrom: 1980,
      yearTo: 2009,
    };
  }

  if (releaseWindow === "modern") {
    return {
      yearFrom: 2010,
      yearTo: 2018,
    };
  }

  if (releaseWindow === "recent") {
    return {
      yearFrom: currentYear - 6,
      yearTo: currentYear,
    };
  }

  return {
    yearFrom: 0,
    yearTo: 0,
  };
}

export function buildGuidedFilters(
  state: GuidedFiltersState,
): StructuredFilters {
  const { yearFrom, yearTo } = getYearRange(state.releaseWindow);

  return {
    mediaType: state.mediaType,
    genres: state.genres,
    moods: [state.mood],
    pace: state.pace,
    yearFrom,
    yearTo,
    includeAdult: false,
    avoidGenres: state.avoidGenres,
    keywords: [],
    language: "pt-BR",
  };
}
