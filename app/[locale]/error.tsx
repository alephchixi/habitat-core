"use client";

import { useTranslations } from "next-intl";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  const t = useTranslations("errors");

  return (
    <div style={{ padding: "var(--space-2xl) 0" }}>
      <p className="page-label" style={{ marginBottom: "var(--space-sm)" }}>
        (500)
      </p>
      <h1 className="page-description" style={{ fontWeight: 400, marginBottom: "var(--space-md)" }}>
        {t("error")}
      </h1>
      <p style={{ opacity: "var(--op-secondary)", marginBottom: "var(--space-sm)", maxWidth: "60ch" }}>
        {t("errorDescription")}
      </p>
      {error.digest && (
        <p className="text-mono text-xs" style={{ opacity: "var(--op-tertiary)", marginBottom: "var(--space-lg)" }}>
          digest: {error.digest}
        </p>
      )}
      <button
        type="button"
        onClick={reset}
        className="text-mono text-xs"
        style={{ border: "1px solid var(--border)", padding: "var(--space-xs) var(--space-sm)" }}
      >
        Retry
      </button>
    </div>
  );
}
