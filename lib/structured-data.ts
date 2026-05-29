import type { LandingFrontmatter } from "./markdown";
import { resolveImagePath } from "./markdown";
import { siteUrl } from "./metadata";

type JsonLdNode = Record<string, unknown>;

function absoluteAsset(slug: string, asset: string): string {
  return /^https?:\/\//.test(asset) ? asset : siteUrl(resolveImagePath(slug, asset));
}

export function landingJsonLd(args: {
  slug: string;
  frontmatter: LandingFrontmatter;
}): JsonLdNode {
  const { slug, frontmatter } = args;
  const { seo, aeo, hero } = frontmatter;
  const url = siteUrl(`/${slug}`);
  const title = seo.title ?? hero.title;
  const image = absoluteAsset(slug, seo.ogImage);
  const author = seo.author ?? "Petit";

  const graph: JsonLdNode[] = [
    {
      "@type": "WebPage",
      "@id": url,
      url,
      name: title,
      description: seo.description,
      primaryImageOfPage: { "@type": "ImageObject", url: image },
      ...(aeo.question
        ? {
            mainEntity: {
              "@type": "Question",
              name: aeo.question,
              acceptedAnswer: { "@type": "Answer", text: aeo.summary },
            },
          }
        : {}),
    },
    {
      "@type": "Article",
      headline: title,
      description: seo.description,
      image: [image],
      ...(seo.publishedAt ? { datePublished: seo.publishedAt } : {}),
      dateModified: new Date().toISOString(),
      author: { "@type": "Organization", name: author },
      publisher: { "@type": "Organization", name: "Petit" },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      abstract: aeo.summary,
    },
  ];

  if (aeo.faqs?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: aeo.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
