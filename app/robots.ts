import type { MetadataRoute } from "next";
import { absoluteUrl, getBaseUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: getBaseUrl(),
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
