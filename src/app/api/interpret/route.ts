import { NextResponse } from "next/server";
import { interpretPromptToFilters } from "@/lib/interpret";

type InterpretRequestBody = {
  prompt?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InterpretRequestBody;
    const prompt = body.prompt?.trim() ?? "";

    if (prompt.length < 12) {
      return NextResponse.json(
        {
          error: "Escreva um pedido um pouco mais detalhado para a IA interpretar.",
        },
        { status: 400 }
      );
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        {
          error: "Seu texto ficou grande demais. Tente resumir em até 500 caracteres.",
        },
        { status: 400 }
      );
    }

    const filters = await interpretPromptToFilters(prompt);

    return NextResponse.json({ filters });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível interpretar o texto agora.";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}