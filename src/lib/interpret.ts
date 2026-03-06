import { getOllamaBaseUrl, getOllamaModel } from "@/lib/ollama";
import type { MediaType, Mood, Pace, StructuredFilters } from "@/types/filters";

const allowedMediaTypes: MediaType[] = ["movie", "tv", "both"];
const allowedMoods: Mood[] = ["dark", "intelligent", "light", "tense"];
const allowedPaces: Pace[] = ["slow", "medium", "fast", "any"];

export const interpretFiltersSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "mediaType",
    "genres",
    "moods",
    "pace",
    "yearFrom",
    "yearTo",
    "includeAdult",
    "avoidGenres",
    "keywords",
    "language",
  ],
  properties: {
    mediaType: {
      type: "string",
      enum: allowedMediaTypes,
    },
    genres: {
      type: "array",
      items: {
        type: "string",
      },
      maxItems: 4,
    },
    moods: {
      type: "array",
      items: {
        type: "string",
        enum: allowedMoods,
      },
      maxItems: 3,
    },
    pace: {
      type: "string",
      enum: allowedPaces,
    },
    yearFrom: {
      type: "integer",
      minimum: 0,
      maximum: 2100,
    },
    yearTo: {
      type: "integer",
      minimum: 0,
      maximum: 2100,
    },
    includeAdult: {
      type: "boolean",
    },
    avoidGenres: {
      type: "array",
      items: {
        type: "string",
      },
      maxItems: 4,
    },
    keywords: {
      type: "array",
      items: {
        type: "string",
      },
      maxItems: 6,
    },
    language: {
      type: "string",
      enum: ["pt-BR"],
    },
  },
} as const;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeStringArray(value: unknown, limit: number) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, limit);
}

function sanitizeMoodArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is Mood =>
        typeof item === "string" && allowedMoods.includes(item as Mood),
    )
    .slice(0, 3);
}

function sanitizeYear(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  const normalizedValue = Math.round(value);

  if (normalizedValue < 0) {
    return 0;
  }

  if (normalizedValue > 2100) {
    return 2100;
  }

  return normalizedValue;
}

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasAnyExpression(text: string, expressions: string[]) {
  return expressions.some((expression) => text.includes(expression));
}

function applyPromptHeuristics(
  prompt: string,
  filters: StructuredFilters,
): StructuredFilters {
  const normalizedPrompt = normalizeText(prompt);

  const deniesSlowPace = hasAnyExpression(normalizedPrompt, [
    "nao muito lenta",
    "nao seja muito lenta",
    "nao seja lenta",
    "nao muito lento",
    "nao seja muito lento",
    "nao seja lento",
    "sem ser muito lenta",
    "sem ser lenta",
    "sem ser muito lento",
    "sem ser lento",
  ]);

  const clearlyFastPace = hasAnyExpression(normalizedPrompt, [
    "ritmo rapido",
    "ritmo acelerado",
    "dinamico",
    "agitado",
    "sem enrolacao",
    "sem enrolacao demais",
  ]);

  const clearlySlowPace =
    hasAnyExpression(normalizedPrompt, [
      "ritmo lento",
      "mais lento",
      "bem lento",
      "devagar",
      "slow burn",
    ]) && !deniesSlowPace;

  if (deniesSlowPace && filters.pace === "slow") {
    return {
      ...filters,
      pace: "medium",
    };
  }

  if (clearlyFastPace) {
    return {
      ...filters,
      pace: "fast",
    };
  }

  if (clearlySlowPace) {
    return {
      ...filters,
      pace: "slow",
    };
  }

  return filters;
}

export function normalizeStructuredFilters(
  value: unknown,
): StructuredFilters | null {
  if (!isPlainObject(value)) {
    return null;
  }

  const mediaType = allowedMediaTypes.includes(value.mediaType as MediaType)
    ? (value.mediaType as MediaType)
    : "both";

  const pace = allowedPaces.includes(value.pace as Pace)
    ? (value.pace as Pace)
    : "any";

  const genres = sanitizeStringArray(value.genres, 4);
  const moods = sanitizeMoodArray(value.moods);
  const rawAvoidGenres = sanitizeStringArray(value.avoidGenres, 4);
  const keywords = sanitizeStringArray(value.keywords, 6);
  const includeAdult =
    typeof value.includeAdult === "boolean" ? value.includeAdult : false;

  const yearFrom = sanitizeYear(value.yearFrom);
  const yearTo = sanitizeYear(value.yearTo);

  const normalizedYears =
    yearFrom === 0 || yearTo === 0
      ? { yearFrom: 0, yearTo: 0 }
      : {
          yearFrom: Math.min(yearFrom, yearTo),
          yearTo: Math.max(yearFrom, yearTo),
        };

  const avoidGenres = rawAvoidGenres.filter((genre) => !genres.includes(genre));

  return {
    mediaType,
    genres,
    moods,
    pace,
    yearFrom: normalizedYears.yearFrom,
    yearTo: normalizedYears.yearTo,
    includeAdult,
    avoidGenres,
    keywords,
    language: "pt-BR",
  };
}

export async function interpretPromptToFilters(prompt: string) {
  const baseUrl = getOllamaBaseUrl();
  const model = getOllamaModel();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        stream: false,
        format: interpretFiltersSchema,
        messages: [
          {
            role: "system",
            content:
              "Você converte pedidos em linguagem natural sobre filmes e séries em filtros estruturados. Não recomende títulos. Não escreva explicações. Responda apenas com o objeto JSON no schema solicitado. Use mediaType com movie, tv ou both. Use moods apenas com dark, intelligent, light ou tense. Use pace apenas com slow, medium, fast ou any. Se o usuário negar lentidão, como em 'não muito lenta', 'não seja lenta' ou 'sem ser lenta', não use pace slow; prefira medium. Use yearFrom e yearTo com 0 quando o usuário não especificar período. Use includeAdult como false por padrão. Use language sempre como pt-BR. Use nomes de gêneros em inglês quando possível, como Thriller, Drama, Crime, Mystery, Science Fiction, Fantasy, Action, Romance, Comedy, Documentary, Animation e Reality TV.",
          },
          {
            role: "user",
            content: `Pedido do usuário: ${prompt}`,
          },
        ],
        options: {
          temperature: 0.1,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof data?.error === "string"
          ? data.error
          : "Ollama não conseguiu interpretar o texto.";

      throw new Error(errorMessage);
    }

    const rawOutput = data?.message?.content;

    if (typeof rawOutput !== "string" || !rawOutput.trim()) {
      throw new Error("Ollama não retornou conteúdo interpretável");
    }

    const parsedOutput = JSON.parse(rawOutput);
    const normalizedFilters = normalizeStructuredFilters(parsedOutput);

    if (!normalizedFilters) {
      throw new Error("A resposta do Ollama não pôde ser validada");
    }

    return applyPromptHeuristics(prompt, normalizedFilters);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        "O Ollama demorou demais para responder. Verifique se ele está rodando e se o modelo está carregado.",
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}