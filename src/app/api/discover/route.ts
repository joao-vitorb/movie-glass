import { NextResponse } from "next/server";
import { normalizeStructuredFilters } from "@/lib/interpret";
import { buildRankedMediaFeed } from "@/lib/ranking";
import { discoverMediaByFilters } from "@/lib/tmdb";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const filters = normalizeStructuredFilters(body?.filters);

    if (!filters) {
      return NextResponse.json(
        {
          error: "Filtros inválidos.",
        },
        {
          status: 400,
        },
      );
    }

    const mediaItems = await discoverMediaByFilters(filters);
    const rankedItems = buildRankedMediaFeed(mediaItems, filters, 12);

    return NextResponse.json({
      items: rankedItems,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Ocorreu um erro ao buscar recomendações.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}
