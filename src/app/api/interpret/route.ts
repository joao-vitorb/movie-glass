import { NextResponse } from "next/server";
import { interpretPromptToFilters } from "@/lib/interpret";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt =
      typeof body?.prompt === "string" ? body.prompt.trim() : "";

    if (prompt.length < 12) {
      return NextResponse.json(
        { error: "Escreva um pedido um pouco mais detalhado." },
        { status: 400 },
      );
    }

    const filters = await interpretPromptToFilters(prompt);

    return NextResponse.json({ filters });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Não foi possível interpretar o texto.",
      },
      { status: 500 },
    );
  }
}