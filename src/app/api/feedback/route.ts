import { NextResponse } from "next/server";
import {
  getFeedbackRecipient,
  getFeedbackSender,
  getResendClient,
} from "@/lib/resend";

export const runtime = "nodejs";

function sanitizeText(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\s+/g, " ");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const name = sanitizeText(body?.name);
    const email = sanitizeText(body?.email);
    const message =
      typeof body?.message === "string" ? body.message.trim() : "";

    if (name.length < 2 || !isValidEmail(email) || message.length < 10) {
      return NextResponse.json(
        {
          error: "Preencha nome, e-mail e uma mensagem válida.",
        },
        {
          status: 400,
        },
      );
    }

    const resend = getResendClient();
    const to = getFeedbackRecipient();
    const from = getFeedbackSender();

    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Novo feedback do Movie Glass — ${name}`,
      text: [
        `Nome: ${name}`,
        `E-mail: ${email}`,
        "",
        "Mensagem:",
        message,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6;">
          <h2>Novo feedback do Movie Glass</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${message.replace(/\n/g, "<br />")}</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Ocorreu um erro ao enviar o feedback.";

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
