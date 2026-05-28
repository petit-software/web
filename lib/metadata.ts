import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://petit.example.com";
const SITE_NAME = "Petit";

export function siteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}

export function landingMetadata(args: {
  slug: string;
  title: string;
  description: string;
  ogImage?: string;
}): Metadata {
  const url = siteUrl(`/${args.slug}`);
  const image = args.ogImage ? siteUrl(args.ogImage) : undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title: `${args.title} — ${SITE_NAME}`,
    description: args.description,
    alternates: { canonical: url },
    openGraph: {
      title: args.title,
      description: args.description,
      url,
      siteName: SITE_NAME,
      images: image ? [{ url: image }] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: args.title,
      description: args.description,
      images: image ? [image] : undefined,
    },
  };
}
