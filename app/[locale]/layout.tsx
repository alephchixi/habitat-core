import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WebVitalsReporter } from "@/components/analytics/WebVitalsReporter";
import "../globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-source-serif",
  display: "optional",
});

export const metadata: Metadata = {
  title: {
    default: "HABITAT.md",
    template: "%s — HABITAT.md",
  },
  description:
    "A critical editorial portal exploring the contemporary cybernetic habitat through ethical, ecological, spiritual, cosmotechnical, and decolonial perspectives.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://habitat.md"),
  openGraph: {
    type: "website",
    locale: "en",
    alternateLocale: "es",
    siteName: "HABITAT.md",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "";
  const plausibleSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js";
  const enableWebVitals = process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS !== "0";
  const themeCookie = cookieStore.get("habitat-theme")?.value;
  const initialTheme = themeCookie === "light" || themeCookie === "dark" ? themeCookie : "dark";

  if (!routing.locales.includes(locale as "en" | "es")) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html
      lang={locale}
      data-theme={initialTheme}
      className={`${ibmPlexMono.variable} ${ibmPlexSans.variable} ${sourceSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        {plausibleDomain ? <script defer data-domain={plausibleDomain} src={plausibleSrc} /> : null}
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {enableWebVitals ? <WebVitalsReporter /> : null}
          <a href="#main-content" className="skip-link text-mono text-xs">
            Skip to content
          </a>
          <Header />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
