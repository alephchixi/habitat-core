import { redirect } from "next/navigation";
import type { Locale } from "@/lib/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ObservatoryRedirectPage({ params }: Props) {
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  redirect(`/${safeLocale}/journal?type=observatory`);
}
