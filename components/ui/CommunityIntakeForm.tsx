"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/lib/types";
import styles from "./CommunityIntakeForm.module.css";

type IntakeKind = "guest-author" | "alliance";

type IntakeState = {
  kind: IntakeKind;
  name: string;
  email: string;
  organization: string;
  axis: string;
  links: string;
  message: string;
  website: string;
  hp: string;
};

const AXES = ["", "habitat", "ethics", "ecology", "spirit", "cosmotechnics", "lab"];

function getCopy(locale: Locale) {
  if (locale === "es") {
    return {
      title: "Formulario de colaboracion",
      description: "Comparte una propuesta inicial. Respuesta editorial esperada: 5-10 dias habiles.",
      fields: {
        kind: "Tipo",
        name: "Nombre",
        email: "Email",
        organization: "Organizacion",
        axis: "Eje principal",
        links: "Links de referencia",
        message: "Propuesta",
        website: "Sitio web",
      },
      kinds: {
        "guest-author": "Autor invitado",
        alliance: "Alianza",
      },
      axisPlaceholder: "selecciona un eje",
      submit: "Enviar propuesta",
      submitting: "Enviando...",
      success: "Recibido. Ticket",
      error: "No se pudo enviar la propuesta. Intenta de nuevo.",
      minChars: "Minimo 40 caracteres en propuesta.",
    };
  }

  return {
    title: "Collaboration intake",
    description: "Share an initial proposal. Editorial response target: 5-10 business days.",
    fields: {
      kind: "Type",
      name: "Name",
      email: "Email",
      organization: "Organization",
      axis: "Primary axis",
      links: "Reference links",
      message: "Proposal",
      website: "Website",
    },
    kinds: {
      "guest-author": "Guest author",
      alliance: "Alliance",
    },
    axisPlaceholder: "select axis",
    submit: "Submit proposal",
    submitting: "Submitting...",
    success: "Received. Ticket",
    error: "Could not submit the proposal. Please try again.",
    minChars: "Minimum 40 characters in proposal.",
  };
}

const INITIAL_STATE: IntakeState = {
  kind: "guest-author",
  name: "",
  email: "",
  organization: "",
  axis: "",
  links: "",
  message: "",
  website: "",
  hp: "",
};

export function CommunityIntakeForm({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);
  const [form, setForm] = useState<IntakeState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("/api/community/intake", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        ticket?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || copy.error);
      }

      setResult({
        type: "success",
        message: `${copy.success}: ${payload.ticket || "n/a"}`,
      });

      setForm((prev) => ({
        ...INITIAL_STATE,
        kind: prev.kind,
      }));
    } catch (error) {
      setResult({
        type: "error",
        message: error instanceof Error ? error.message : copy.error,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.wrapper} onSubmit={onSubmit}>
      <p className={styles.label}>{copy.title}</p>
      <p className={styles.note}>{copy.description}</p>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>{copy.fields.kind}</span>
          <select
            className={styles.select}
            value={form.kind}
            onChange={(event) => setForm((prev) => ({ ...prev, kind: event.target.value as IntakeKind }))}
          >
            <option value="guest-author">{copy.kinds["guest-author"]}</option>
            <option value="alliance">{copy.kinds.alliance}</option>
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{copy.fields.axis}</span>
          <select
            className={styles.select}
            value={form.axis}
            onChange={(event) => setForm((prev) => ({ ...prev, axis: event.target.value }))}
          >
            {AXES.map((axis) => (
              <option key={axis || "empty"} value={axis}>
                {axis || copy.axisPlaceholder}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>{copy.fields.name}</span>
          <input
            className={styles.input}
            type="text"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{copy.fields.email}</span>
          <input
            className={styles.input}
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
        </label>
      </div>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>{copy.fields.organization}</span>
          <input
            className={styles.input}
            type="text"
            value={form.organization}
            onChange={(event) => setForm((prev) => ({ ...prev, organization: event.target.value }))}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{copy.fields.website}</span>
          <input
            className={styles.input}
            type="url"
            value={form.website}
            onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
          />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>{copy.fields.links}</span>
        <input
          className={styles.input}
          type="text"
          value={form.links}
          onChange={(event) => setForm((prev) => ({ ...prev, links: event.target.value }))}
          placeholder="https://..."
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>{copy.fields.message}</span>
        <textarea
          className={styles.textarea}
          value={form.message}
          onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
          required
          minLength={40}
        />
      </label>

      <label className={styles.hp} aria-hidden="true">
        <span>Website</span>
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.hp}
          onChange={(event) => setForm((prev) => ({ ...prev, hp: event.target.value }))}
        />
      </label>

      <div className={styles.actions}>
        <button type="submit" className={styles.button} disabled={submitting}>
          {submitting ? copy.submitting : copy.submit}
        </button>
        <span className={styles.note}>{copy.minChars}</span>
        {result ? (
          <span className={`${styles.note} ${result.type === "success" ? styles.success : styles.error}`}>
            {result.message}
          </span>
        ) : null}
      </div>
    </form>
  );
}
