import type { Metadata } from "next";
import type { LandingFrontmatter } from "./markdown";
import { resolveImagePath } from "./markdown";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://petit.example.com";
const SITE_NAME = "Petit";

export function siteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}

function absoluteAsset(slug: string, asset: string): string {
  return /^https?:\/\//.test(asset) ? asset : siteUrl(resolveImagePath(slug, asset));
}

export function landingMetadata(args: {
  slug: string;
  frontmatter: LandingFrontmatter;
}): Metadata {
  const { slug, frontmatter } = args;
  const { seo, hero } = frontmatter;
  const url = siteUrl(`/${slug}`);
  const title = seo.title ?? hero.title;
  const description = seo.description;
  const ogImage = absoluteAsset(slug, seo.ogImage);
  const ogAlt = seo.ogImageAlt ?? title;

  return {
    metadataBase: new URL(SITE_URL),
    title: `${title} — ${SITE_NAME}`,
    description,
    keywords: seo.keywords,
    authors: seo.author ? [{ name: seo.author }] : undefined,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
      ...(seo.publishedAt ? { publishedTime: seo.publishedAt } : {}),
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
