import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import type { ReactNode } from "react";

import { Quote } from "../components/mdx/Quote";
import { ImageGrayscale } from "../components/mdx/ImageGrayscale";
import { Footnote } from "../components/mdx/Footnote";

const components = {
  Quote,
  ImageGrayscale,
  Footnote,
};

export async function parseMDX(source: string): Promise<ReactNode> {
  const { content } = await compileMDX({
    source,
    components,
    options: {
      parseFrontmatter: false, // We use gray-matter before this
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          rehypeHighlight,
          // Security baseline: sanitize MDX against XSS
          [
            rehypeSanitize,
            {
              ...defaultSchema,
              attributes: {
                ...defaultSchema.attributes,
                // Allow custom components through sanitizer
                Quote: ["author", "text", "source", "year"],
                ImageGrayscale: ["src", "alt", "caption"],
                Footnote: ["id"],
                "*": ["className", "id"],
              },
              tagNames: [
                ...(defaultSchema.tagNames || []),
                "Quote",
                "ImageGrayscale",
                "Footnote"
              ]
            },
          ],
        ],
      },
    },
  });

  return content;
}
