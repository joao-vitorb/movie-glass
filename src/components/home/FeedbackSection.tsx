"use client";

import { FormEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function FeedbackSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const canSubmit =
    name.trim().length >= 2 &&
    email.trim().length >= 5 &&
    message.trim().length >= 10;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
          name,
          email,
          message,
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
      setName("");
      setEmail("");
      setMessage("");
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
    <GlassPanel className="px-6 py-8 sm:px-8 sm:py-10">
      <SectionTitle
        eyebrow="Feedback e bugs"
        title="Encontrou um bug ou tem alguma sugestão?"
        description="Use este espaço para me avisar de problemas, compartilhar ideias de melhoria ou mandar qualquer feedback sobre o projeto."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <div className="rounded-[26px] border border-white/18 bg-white/[0.08] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">
              por que esta seção existe
            </p>

            <p className="mt-4 text-sm leading-7 text-white/68">
              Apesar de ser um projeto pessoal, quero meus projetos sejam úteis
              e agradáveis de usar. E para isso, seu feedback é essencial! Fique
              a vontade para dar sua sugestão de melhoria, relatar um bug ou
              simplesmente mandar um alô. Vou ler tudo com muito carinho.
            </p>
          </div>

          <div className="rounded-[26px] border border-white/18 bg-white/[0.08] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">
              me acompanhe nas redes sociais
            </p>

            <ul className="mt-4 space-y-4 text-sm text-white/72">
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/16 bg-white/[0.06]">
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </span>
                <a
                  href="https://www.linkedin.com/in/joao-vitor-borges-de-oliveira"
                  target="_blank"
                  rel="noreferrer"
                  className="transition duration-300 hover:text-white"
                >
                  /joao-vitor-borges-de-oliveira
                </a>
              </li>

              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/16 bg-white/[0.06]">
                  <FontAwesomeIcon icon={faGithub} />
                </span>
                <a
                  href="https://github.com/joao-vitorb"
                  target="_blank"
                  rel="noreferrer"
                  className="transition duration-300 hover:text-white"
                >
                  /joao-vitorb
                </a>
              </li>

              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/16 bg-white/[0.06]">
                  <FontAwesomeIcon icon={faInstagram} />
                </span>
                <a
                  href="https://instagram.com/codebyjoao"
                  target="_blank"
                  rel="noreferrer"
                  className="transition duration-300 hover:text-white"
                >
                  @codebyjoao
                </a>
              </li>

              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/16 bg-white/[0.06]">
                  <FontAwesomeIcon icon={faLink} />
                </span>
                <a
                  href="https://portfoliojvb.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="transition duration-300 hover:text-white"
                >
                  Meu portfólio
                </a>
              </li>
            </ul>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[26px] border border-white/18 bg-white/[0.08] p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/72">
                Seu nome
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                className="glass-input w-full rounded-[20px] px-4 py-3 text-sm text-white placeholder:text-white/32 focus:outline-none"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/72">
                Seu e-mail
              </label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                className="glass-input w-full rounded-[20px] px-4 py-3 text-sm text-white placeholder:text-white/32 focus:outline-none"
                placeholder="voce@email.com"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-white/72">
              Sua mensagem
            </label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="glass-input min-h-40 w-full resize-none rounded-[24px] px-4 py-4 text-sm leading-7 text-white placeholder:text-white/32 focus:outline-none"
              placeholder="Descreva o bug, sugestão ou feedback com o máximo de contexto que puder."
            />
          </div>

          {errorMessage ? (
            <div className="mt-4 rounded-[20px] border border-rose-200/16 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mt-4 rounded-[20px] border border-emerald-200/16 bg-emerald-200/10 px-4 py-3 text-sm text-emerald-100">
              {successMessage}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-4">
            <PrimaryButton type="submit" disabled={!canSubmit || isLoading}>
              {isLoading ? "Enviando..." : "Enviar mensagem"}
            </PrimaryButton>

            <button
              type="button"
              onClick={() => {
                setName("");
                setEmail("");
                setMessage("");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className="rounded-full border border-white/16 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white/72 transition duration-300 hover:bg-white/[0.1]"
            >
              Limpar campos
            </button>
          </div>
        </form>
      </div>
    </GlassPanel>
  );
}