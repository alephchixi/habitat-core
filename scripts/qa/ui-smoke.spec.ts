import fs from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";
import matter from "gray-matter";

const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1200, height: 900 },
  { width: 1440, height: 900 },
];

const ROUTES = ["/en", "/en/journal", "/en/journal/cybernetic-habitat-manifesto", "/en/nest", "/en/about"];

const SCREENSHOT_DIR = path.join(process.cwd(), "audit", "mobile-qa-screenshots");
const JOURNAL_DIRS_BY_LOCALE = {
  en: ["essays", "notes", "observatory"],
  es: ["ensayos", "notas", "observatorio"],
} as const;

function routeToFile(route: string) {
  if (route === "/") return "root";
  return route.replace(/^\//, "").replace(/\//g, "_");
}

function findFirstNonPublishedJournalSlug(locale: "en" | "es"): string | null {
  const dirs = JOURNAL_DIRS_BY_LOCALE[locale];

  for (const dir of dirs) {
    const absoluteDir = path.join(process.cwd(), "content", locale, dir);
    if (!fs.existsSync(absoluteDir)) continue;

    const files = fs.readdirSync(absoluteDir).filter((name) => name.endsWith(".mdx"));
    for (const file of files) {
      const source = fs.readFileSync(path.join(absoluteDir, file), "utf8");
      const parsed = matter(source).data as { status?: string };
      const status = typeof parsed.status === "string" ? parsed.status : "draft";
      if (status !== "published") {
        return file.replace(/\.mdx$/, "");
      }
    }
  }

  return null;
}

test.describe("@mobile responsive matrix", () => {
  test.beforeAll(() => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });

  for (const viewport of VIEWPORTS) {
    for (const route of ROUTES) {
      test(`route ${route} at ${viewport.width}px`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });

        const response = await page.goto(route, { waitUntil: "domcontentloaded" });
        expect(response, "Expected route response").toBeTruthy();
        expect(response?.status(), `Unexpected status for ${route}`).toBeLessThan(400);

        const hasHorizontalOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth + 1
        );
        expect(hasHorizontalOverflow, `Horizontal overflow detected for ${route}`).toBeFalsy();

        const screenshotPath = path.join(SCREENSHOT_DIR, `${routeToFile(route)}_${viewport.width}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
      });
    }
  }
});

test.describe("@a11y accessibility smoke", () => {
  for (const route of ROUTES) {
    test(`semantic checks for ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      await expect(page.locator("html[lang]")).toHaveCount(1);
      await expect(page.locator("main#main-content")).toHaveCount(1);
      await expect(page.locator("h1").first()).toBeVisible();

      if (route === "/en") {
        await expect(page.locator("a.skip-link")).toHaveCount(1);
      }

      const unlabeledControls = await page.evaluate(() => {
        const controls = Array.from(document.querySelectorAll("input, textarea, select, button"));

        return controls
          .filter((control) => {
            const tag = control.tagName.toLowerCase();
            const type = (control.getAttribute("type") || "").toLowerCase();
            const hidden = type === "hidden" || control.getAttribute("aria-hidden") === "true";
            if (hidden) return false;

            if (tag === "button") {
              return (control.textContent || "").trim().length === 0 && !control.getAttribute("aria-label");
            }

            const id = control.getAttribute("id");
            const hasAria = Boolean(control.getAttribute("aria-label") || control.getAttribute("aria-labelledby"));
            const hasLabel = id
              ? document.querySelector(`label[for=\"${id}\"]`) !== null
              : control.closest("label") !== null;
            return !hasAria && !hasLabel;
          })
          .map((control) => control.outerHTML.slice(0, 120));
      });

      expect(unlabeledControls, `Unlabeled controls found on ${route}`).toEqual([]);
    });
  }
});

test.describe("@security editorial visibility", () => {
  test("non-published journal entries return 404 publicly", async ({ request }) => {
    const draftSlug = findFirstNonPublishedJournalSlug("en");
    test.skip(!draftSlug, "No non-published journal entry found in EN content.");
    if (!draftSlug) return;

    const response = await request.get(`/en/journal/${draftSlug}`);
    const html = await response.text();
    const hasNoIndex = /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
    const hasNotFoundMarker = /\(404\)|Not Found|could not be found/i.test(html);
    const appearsLeaked = html.includes("Template Essay Title") || html.includes("Your content goes here.");
    const inaccessible = response.status() === 404 || (hasNoIndex && hasNotFoundMarker && !appearsLeaked);

    expect(inaccessible, `Expected non-published slug ${draftSlug} to stay private`).toBeTruthy();
  });
});
