"use client";

import { useMemo, useState } from "react";
import useMercadoPago from "./hooks/useMercadoPago";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value.trim());
}

function formatPhoneBR(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";

  const ddd = digits.slice(0, 2);
  const part1 = digits.slice(2, 7);
  const part2 = digits.slice(7, 11);

  if (digits.length <= 2) return `(${ddd}`;
  if (digits.length <= 7) return `(${ddd}) ${digits.slice(2)}`;
  return `(${ddd}) ${part1}-${part2}`;
}

function ShieldIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={props.className}
    >
      <path
        d="M12 2l7 4v6c0 5-3 9-7 10C8 21 5 17 5 12V6l7-4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 12.1l1.8 1.9 3.8-4.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PixIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={props.className}
    >
      <path
        d="M9.2 4.2l2.8 2.8 2.8-2.8c1-1 2.7-1 3.7 0l1.3 1.3c1 1 1 2.7 0 3.7L19.9 12l2.8 2.8c1 1 1 2.7 0 3.7l-1.3 1.3c-1 1-2.7 1-3.7 0L12 17.1l-5.7 5.7c-1 1-2.7 1-3.7 0l-1.3-1.3c-1-1-1-2.7 0-3.7L4.1 12 1.3 9.2c-1-1-1-2.7 0-3.7l1.3-1.3c1-1 2.7-1 3.7 0z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M8.6 12l3.4-3.4 3.4 3.4-3.4 3.4L8.6 12z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CardIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={props.className}
    >
      <path
        d="M4 7.5A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5v9A2.5 2.5 0 0117.5 19h-11A2.5 2.5 0 014 16.5v-9z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4 9h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 15h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Home() {
  const { createMercadoPagoCheckout } = useMercadoPago();

  const [fullName, setFullName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const formattedPhone = useMemo(() => formatPhoneBR(phone), [phone]);

  const canSubmit = useMemo(() => {
    const emailOk = isValidEmail(userEmail);
    const nameOk = fullName.trim().length >= 2;
    const phoneOk = phone.replace(/\D/g, "").length >= 10;
    return emailOk && nameOk && phoneOk && !isLoading;
  }, [fullName, isLoading, phone, userEmail]);

  async function handleCheckout() {
    setError("");

    const emailOk = isValidEmail(userEmail);
    if (!emailOk) {
      setError("Digite um e-mail válido para receber a confirmação do pagamento.");
      return;
    }

    if (fullName.trim().length < 2) {
      setError("Informe seu nome para identificarmos o pagamento corretamente.");
      return;
    }

    if (phone.replace(/\D/g, "").length < 10) {
      setError("Informe um telefone/WhatsApp válido (com DDD).");
      return;
    }

    try {
      setIsLoading(true);

      const testeId = `checkout_${Date.now()}`;

      await createMercadoPagoCheckout({
        testeId,
        userEmail: userEmail.trim(),
        fullName: fullName.trim(),
        phone: phone.replace(/\D/g, ""),
        notes: notes.trim(),
      } as any);
    } catch (e) {
      setError("Não foi possível iniciar o checkout agora. Tente novamente em instantes.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white">
      <a
        href="#checkout"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900 focus:shadow-lg"
      >
        Pular para o checkout
      </a>

      <header className="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                <span className="text-xl font-semibold">MP</span>
              </div>
              <div className="leading-tight">
                <p className="text-sm text-white/70">Checkout</p>
                <h1 className="text-lg font-semibold tracking-tight">Mercado Pago • Pagamento Seguro</h1>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs text-white/80 ring-1 ring-white/10 sm:flex">
              <ShieldIcon className="h-4 w-4" />
              Ambiente de pagamento protegido
            </div>
          </div>

          <div className="rounded-3xl bg-white/[0.03] p-6 ring-1 ring-white/10 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Finalize sua compra com rapidez e confiança
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-base">
                  Preencha seus dados para gerar o checkout do Mercado Pago. Você poderá pagar via PIX ou cartão e
                  receberá a confirmação no e-mail informado.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs text-white/80 ring-1 ring-white/10">
                    <PixIcon className="h-4 w-4" />
                    PIX instantâneo
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs text-white/80 ring-1 ring-white/10">
                    <CardIcon className="h-4 w-4" />
                    Cartão em segundos
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs text-white/80 ring-1 ring-white/10">
                    <ShieldIcon className="h-4 w-4" />
                    Antifraude ativo
                  </span>
                </div>
              </div>

              <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-white/10 to-white/5 p-5 ring-1 ring-white/15 md:p-6">
                <p className="text-xs font-medium text-white/70">Resumo do pedido</p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Produto</span>
                    <span className="font-medium">Checkout Demo</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Entrega</span>
                    <span className="font-medium">—</span>
                  </div>
                  <div className="h-px w-full bg-white/10" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white/80">Total</span>
                    <span className="text-lg font-semibold tracking-tight">R$ 0,00</span>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-white/60">
                  * Este layout é uma base profissional de checkout. O valor pode ser calculado no seu backend antes
                  de gerar o link do pagamento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main id="checkout" className="mx-auto w-full max-w-6xl px-4 pb-14 pt-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-3xl bg-white/[0.03] p-6 ring-1 ring-white/10 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Dados de cobrança</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Use um e-mail válido para receber o status do pagamento e facilitar suporte, reenvio e
                  confirmações.
                </p>
              </div>
              <div className="hidden rounded-2xl bg-white/5 px-3 py-2 text-xs text-white/80 ring-1 ring-white/10 sm:block">
                Checkout Mercado Pago
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="group block">
                <span className="mb-2 block text-xs font-medium text-white/70">Nome completo</span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  autoComplete="name"
                  className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-white/40 transition focus:ring-2 focus:ring-blue-500/50"
                />
              </label>

              <label className="group block">
                <span className="mb-2 block text-xs font-medium text-white/70">E-mail</span>
                <input
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  inputMode="email"
                  autoComplete="email"
                  className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-white/40 transition focus:ring-2 focus:ring-blue-500/50"
                />
              </label>

              <label className="group block sm:col-span-2">
                <span className="mb-2 block text-xs font-medium text-white/70">Telefone / WhatsApp</span>
                <input
                  value={formattedPhone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(24) 99999-9999"
                  inputMode="tel"
                  autoComplete="tel"
                  className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-white/40 transition focus:ring-2 focus:ring-blue-500/50"
                />
                <p className="mt-2 text-xs text-white/55">
                  Usamos seu telefone apenas para contato sobre pagamento/pedido (sem spam).
                </p>
              </label>

              <label className="group block sm:col-span-2">
                <span className="mb-2 block text-xs font-medium text-white/70">Observações (opcional)</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Preciso da nota no CPF / Preferência de horário / Informações extras"
                  rows={4}
                  className="w-full resize-none rounded-2xl bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-white/40 transition focus:ring-2 focus:ring-blue-500/50"
                />
              </label>
            </div>

            {error ? (
              <div
                role="alert"
                aria-live="polite"
                className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100"
              >
                {error}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-white/60">
                <ShieldIcon className="h-4 w-4" />
                Seus dados são usados apenas para processar o pagamento.
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={!canSubmit}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-blue-500/20 ring-1 ring-white/10 transition hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                    Gerando checkout...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Ir para pagamento
                    <span aria-hidden="true">→</span>
                  </span>
                )}
              </button>
            </div>
          </section>

          <aside className="rounded-3xl bg-white/[0.03] p-6 ring-1 ring-white/10 sm:p-8">
            <h3 className="text-base font-semibold tracking-tight">O que acontece agora?</h3>

            <ol className="mt-4 space-y-3">
              <li className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white/5 text-sm font-semibold ring-1 ring-white/10">
                  1
                </span>
                <div className="pt-1">
                  <p className="text-sm font-medium">Você confirma os dados</p>
                  <p className="text-xs leading-relaxed text-white/60">
                    Validamos as informações para gerar o link de pagamento de forma segura.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white/5 text-sm font-semibold ring-1 ring-white/10">
                  2
                </span>
                <div className="pt-1">
                  <p className="text-sm font-medium">Mercado Pago abre o checkout</p>
                  <p className="text-xs leading-relaxed text-white/60">
                    Você escolhe PIX ou cartão e finaliza em poucos segundos.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white/5 text-sm font-semibold ring-1 ring-white/10">
                  3
                </span>
                <div className="pt-1">
                  <p className="text-sm font-medium">Confirmação e status</p>
                  <p className="text-xs leading-relaxed text-white/60">
                    Após o pagamento, você recebe o status e a confirmação no e-mail.
                  </p>
                </div>
              </li>
            </ol>

            <div className="mt-6 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 p-5 ring-1 ring-white/15">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <ShieldIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Pagamento confiável</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/60">
                    Você é direcionado(a) para o ambiente do Mercado Pago para concluir a transação com segurança.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/5 px-3 py-3 text-xs text-white/70 ring-1 ring-white/10">
                  <p className="font-medium text-white/85">PIX</p>
                  <p className="mt-1">Aprovação rápida</p>
                </div>
                <div className="rounded-2xl bg-white/5 px-3 py-3 text-xs text-white/70 ring-1 ring-white/10">
                  <p className="font-medium text-white/85">Cartão</p>
                  <p className="mt-1">Pague em segundos</p>
                </div>
              </div>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-white/50">
              Ao continuar, você concorda com o processamento dos dados informados para gerar o checkout e obter o
              status do pagamento.
            </p>
          </aside>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6">
        <div className="flex flex-col gap-3 rounded-3xl bg-white/[0.02] p-5 ring-1 ring-white/10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/55">© {new Date().getFullYear()} • Integração Mercado Pago</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/55">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 ring-1 ring-white/10">
              <ShieldIcon className="h-4 w-4" />
              Checkout seguro
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 ring-1 ring-white/10">
              <PixIcon className="h-4 w-4" />
              PIX / Cartão
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
