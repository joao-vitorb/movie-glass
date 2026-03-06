import { NextResponse } from "next/server";
import { getResendClient } from "@/lib/resend";

type FeedbackRequestBody = {
  name?: string;
  email?: string;
  message?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FeedbackRequestBody;

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const message = body.message?.trim() ?? "";

    if (name.length < 2) {
      return NextResponse.json(
        {
          error: "Digite um nome com pelo menos 2 caracteres.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          error: "Digite um e-mail válido.",
        },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        {
          error: "Digite uma mensagem com pelo menos 10 caracteres.",
        },
        { status: 400 }
      );
    }

    if (message.length > 3000) {
      return NextResponse.json(
        {
          error: "Sua mensagem ficou muito grande. Tente resumir em até 3000 caracteres.",
        },
        { status: 400 }
      );
    }

    const resend = getResendClient();
    const to = process.env.FEEDBACK_TO_EMAIL;
    const from = process.env.FEEDBACK_FROM_EMAIL;

    if (!to) {
      throw new Error("FEEDBACK_TO_EMAIL não configurado");
    }

    if (!from) {
      throw new Error("FEEDBACK_FROM_EMAIL não configurado");
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

    const subject = `Novo feedback do Movie Glass — ${name}`;

    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; background: #0b1020; color: #f5f7ff; padding: 24px;">
        <div style="max-width: 640px; margin: 0 auto; background: #11182b; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 24px;">
          <p style="font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.55); margin: 0 0 16px;">
            novo feedback do site
          </p>
          <h1 style="font-size: 28px; margin: 0 0 16px; color: #ffffff;">
            Mensagem recebida pelo Movie Glass
          </h1>
          <div style="margin-top: 20px; padding: 16px; border-radius: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
            <p style="margin: 0 0 8px; color: rgba(255,255,255,0.7);">
              <strong style="color: #ffffff;">Nome:</strong> ${safeName}
            </p>
            <p style="margin: 0 0 8px; color: rgba(255,255,255,0.7);">
              <strong style="color: #ffffff;">E-mail:</strong> ${safeEmail}
            </p>
          </div>
          <div style="margin-top: 20px; padding: 16px; border-radius: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
            <p style="margin: 0 0 12px; color: rgba(255,255,255,0.6); text-transform: uppercase; font-size: 12px; letter-spacing: 0.14em;">
              Mensagem
            </p>
            <p style="margin: 0; line-height: 1.8; color: rgba(255,255,255,0.82);">
              ${safeMessage}
            </p>
          </div>
        </div>
      </div>
    `;

    const text = [
      "Novo feedback do Movie Glass",
      "",
      `Nome: ${name}`,
      `E-mail: ${email}`,
      "",
      "Mensagem:",
      message,
    ].join("\n");

    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
      text,
      replyTo: email,
    });

    if (error) {
      return NextResponse.json(
        {
          error: "Não foi possível enviar sua mensagem agora.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data?.id ?? null,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Ocorreu um erro ao enviar a mensagem.";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}