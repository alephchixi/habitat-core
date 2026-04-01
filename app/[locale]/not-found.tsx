import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params?: Promise<{ locale?: string }>;
};

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NotFoundPage({ params }: Props) {
  const resolvedParams = params ? await params : undefined;
  const locale = resolvedParams?.locale === "es" ? "es" : "en";
  const t = await getTranslations("errors");
  const tc = await getTranslations("common");

  return (
    <div style={{ padding: "var(--space-2xl) 0" }}>
      <p className="page-label" style={{ marginBottom: "var(--space-sm)" }}>
        (404)
      </p>
      <h1 className="page-description" style={{ fontWeight: 400, marginBottom: "var(--space-md)" }}>
        {t("notFound")}
      </h1>
      <p style={{ opacity: "var(--op-secondary)", marginBottom: "var(--space-lg)", maxWidth: "60ch" }}>
        {t("notFoundDescription")}
      </p>
      <Link
        href={`/${locale}`}
        className="text-mono text-xs"
        style={{ border: "1px solid var(--border)", padding: "var(--space-xs) var(--space-sm)" }}
      >
        {tc("backToHome")}
      </Link>
    </div>
  );
}
