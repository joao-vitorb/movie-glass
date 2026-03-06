import { NextResponse } from "next/server";
import { getMediaDetailsById } from "@/lib/tmdb";
import type { SearchableMediaType } from "@/types/media";

type RouteContext = {
  params: Promise<{
    mediaType: string;
    id: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  try {
    const { mediaType, id } = await context.params;

    if (mediaType !== "movie" && mediaType !== "tv") {
      return NextResponse.json(
        {
          error: "Tipo de mídia inválido.",
        },
        { status: 400 }
      );
    }

    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
      return NextResponse.json(
        {
          error: "ID inválido para detalhes.",
        },
        { status: 400 }
      );
    }

    const item = await getMediaDetailsById(
      mediaType as SearchableMediaType,
      numericId
    );

    return NextResponse.json({ item });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível buscar os detalhes agora.";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}