"use client";

import { FormEvent, useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTitle } from "@/components/ui/SectionTitle";

type SocialLink = {
  label: string;
  href: string;
  text: string;
  icon: React.ReactNode;
};

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M6.94 8.5H3.56V20h3.38V8.5Zm.22-3.55a1.96 1.96 0 1 0-3.92 0 1.96 1.96 0 0 0 3.92 0ZM20 13.02c0-3.33-1.78-4.88-4.15-4.88-1.91 0-2.77 1.04-3.25 1.77V8.5H9.22V20h3.38v-6.2c0-1.63.31-3.21 2.33-3.21 1.99 0 2.02 1.86 2.02 3.31V20H20v-6.98Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.5 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.2-3.37-1.2-.45-1.18-1.12-1.49-1.12-1.49-.91-.64.07-.63.07-.63 1 .08 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.1-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.32.1-2.75 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.86c.85 0 1.7.12 2.5.36 1.9-1.33 2.74-1.05 2.74-1.05.55 1.43.2 2.49.1 2.75.64.72 1.03 1.64 1.03 2.76 0 3.95-2.35 4.82-4.58 5.08.36.31.68.92.68 1.86 0 1.34-.01 2.42-.01 2.75 0 .28.18.6.69.5A10.18 10.18 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2.2A2.8 2.8 0 0 0 4.2 7v10A2.8 2.8 0 0 0 7 19.8h10a2.8 2.8 0 0 0 2.8-2.8V7A2.8 2.8 0 0 0 17 4.2H7Zm10.55 1.65a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2A2.8 2.8 0 1 0 12 14.8a2.8 2.8 0 0 0 0-5.6Z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M10.59 13.41a1 1 0 0 1 0-1.41l3.18-3.18a3 3 0 1 1 4.24 4.24l-1.76 1.77a3 3 0 0 1-4.24 0 1 1 0 0 1 1.41-1.42 1 1 0 0 0 1.42 0l1.76-1.76a1 1 0 1 0-1.42-1.42l-3.18 3.18a1 1 0 0 1-1.41 0Zm2.82-2.82a1 1 0 0 1 0 1.41l-3.18 3.18a3 3 0 0 1-4.24-4.24l1.76-1.77a3 3 0 0 1 4.24 0 1 1 0 1 1-1.41 1.42 1 1 0 0 0-1.42 0L7.4 12.34a1 1 0 0 0 1.42 1.42L12 10.59a1 1 0 0 1 1.41 0Z" />
    </svg>
  );
}

const socialLinks: SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/joao-vitor-borges-de-oliveira",
    text: "/joao-vitor-borges-de-oliveira",
    icon: <LinkedInIcon />,
  },
  {
    label: "GitHub",
    href: "https://github.com/joao-vitorb",
    text: "/joao-vitorb",
    icon: <GitHubIcon />,
  },
  {
    label: "Instagram",
    href: "https://instagram.com/codebyjoao",
    text: "@codebyjoao",
    icon: <InstagramIcon />,
  },
  {
    label: "Portfólio",
    href: "https://portfoliojvb.vercel.app/",
    text: "Meu portfólio",
    icon: <LinkIcon />,
  },
];

export function FeedbackSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const canSubmit = useMemo(
    () =>
      name.trim().length >= 2 &&
      email.trim().length >= 5 &&
      message.trim().length >= 10,
    [email, message, name],
  );

  function clearForm() {
    setName("");
    setEmail("");
    setMessage("");
    setErrorMessage("");
    setSuccessMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    if (!canSubmit) {
      setErrorMessage("Preencha nome, e-mail e uma mensagem mais detalhada.");
      setSuccessMessage("");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      const isJsonResponse = contentType.includes("application/json");
      const data = isJsonResponse ? await response.json() : null;

      if (!response.ok) {
        throw new Error(
          data && typeof data.error === "string"
            ? data.error
            : "Não foi possível enviar sua mensagem.",
        );
      }

      setSuccessMessage(
        "Mensagem enviada com sucesso. Obrigado pelo feedback.",
      );
      clearForm();
      setSuccessMessage(
        "Mensagem enviada com sucesso. Obrigado pelo feedback.",
      );
    } catch (error) {
      const messageText =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao enviar a mensagem.";

      setErrorMessage(messageText);
      setSuccessMessage("");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <GlassPanel className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <SectionTitle
        eyebrow="Feedback e bugs"
        title="Encontrou um bug ou tem alguma sugestão?"
        description="Use este espaço para me avisar de problemas, compartilhar ideias de melhoria ou mandar qualquer feedback sobre o projeto."
      />

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <div className="rounded-3xl border border-white/18 bg-white/8 p-5 sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/45 sm:text-xs">
              por que esta seção existe
            </p>

            <p className="mt-4 text-sm leading-7 text-white/68">
              Apesar de ser um projeto pessoal, quero que ele seja útil e
              agradável de usar. E para isso, seu feedback é essencial. Fique à
              vontade para dar sua sugestão de melhoria, relatar um bug ou
              simplesmente mandar um alô.
            </p>
          </div>

          <div className="rounded-3xl border border-white/18 bg-white/8 p-5 sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/45 sm:text-xs">
              me acompanhe nas redes sociais
            </p>

            <ul className="mt-4 space-y-3 text-sm text-white/72">
              {socialLinks.map((link) => (
                <li key={link.label} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/16 bg-white/6">
                    {link.icon}
                  </span>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all transition duration-300 hover:text-white"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/18 bg-white/8 p-5 sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="feedback-name"
                className="mb-2 block text-sm font-medium text-white/72"
              >
                Seu nome
              </label>
              <input
                id="feedback-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                autoComplete="name"
                className="glass-input w-full rounded-[18px] px-4 py-3 text-sm text-white placeholder:text-white/32 focus:outline-none"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label
                htmlFor="feedback-email"
                className="mb-2 block text-sm font-medium text-white/72"
              >
                Seu e-mail
              </label>
              <input
                id="feedback-email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                autoComplete="email"
                className="glass-input w-full rounded-[18px] px-4 py-3 text-sm text-white placeholder:text-white/32 focus:outline-none"
                placeholder="voce@email.com"
              />
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="feedback-message"
              className="mb-2 block text-sm font-medium text-white/72"
            >
              Sua mensagem
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="glass-input min-h-40 w-full resize-y rounded-[22px] px-4 py-4 text-sm leading-7 text-white placeholder:text-white/32 focus:outline-none"
              placeholder="Descreva o bug, sugestão ou feedback com o máximo de contexto que puder."
            />
          </div>

          {errorMessage ? (
            <div className="mt-4 rounded-[18px] border border-rose-200/16 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mt-4 rounded-[18px] border border-emerald-200/16 bg-emerald-200/10 px-4 py-3 text-sm text-emerald-100">
              {successMessage}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <PrimaryButton type="submit" disabled={!canSubmit || isLoading}>
              {isLoading ? "Enviando..." : "Enviar mensagem"}
            </PrimaryButton>

            <button
              type="button"
              onClick={clearForm}
              className="rounded-full border border-white/16 bg-white/6 px-5 py-3 text-sm font-medium text-white/72 transition duration-300 hover:bg-white/10"
            >
              Limpar campos
            </button>
          </div>
        </form>
      </div>
    </GlassPanel>
  );
}
