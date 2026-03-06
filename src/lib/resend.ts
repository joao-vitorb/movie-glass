import "server-only";

import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("RESEND_API_KEY não configurada");
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export function getFeedbackRecipient() {
  const recipient = process.env.FEEDBACK_TO_EMAIL?.trim();

  if (!recipient) {
    throw new Error("FEEDBACK_TO_EMAIL não configurado");
  }

  return recipient;
}

export function getFeedbackSender() {
  const sender = process.env.FEEDBACK_FROM_EMAIL?.trim();

  if (!sender) {
    throw new Error("FEEDBACK_FROM_EMAIL não configurado");
  }

  return sender;
}
