import { NextResponse } from "next/server";
import { normalizeStructuredFilters } from "@/lib/interpret";
import { discoverMediaByFilters } from "@/lib/tmdb";
import type { DiscoverRequestBody } from "@/types/media";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DiscoverRequestBody;

    const normalizedFilters = normalizeStructuredFilters(body.filters);

    if (!normalizedFilters) {
      return NextResponse.json(
        {
          error: "Os filtros enviados para a busca não são válidos.",
        },
        { status: 400 }
      );
    }

    const items = await discoverMediaByFilters(normalizedFilters);

    return NextResponse.json({ items });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível buscar dados na TMDb agora.";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}