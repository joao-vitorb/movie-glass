import { NextResponse } from "next/server";
import { getMediaDetailsById } from "@/lib/tmdb";
import type { SearchableMediaType } from "@/types/media";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    mediaType: string;
    id: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  try {
    const params = await context.params;
    const mediaType = params.mediaType as SearchableMediaType;
    const id = Number(params.id);

    if (!["movie", "tv"].includes(mediaType)) {
      return NextResponse.json(
        {
          error: "Tipo de mídia inválido.",
        },
        {
          status: 400,
        },
      );
    }

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          error: "ID inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const item = await getMediaDetailsById(mediaType, id);

    return NextResponse.json({
      item,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Ocorreu um erro ao carregar os detalhes.";

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
