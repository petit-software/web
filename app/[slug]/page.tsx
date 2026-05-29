import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LandingPageTemplate from "@/components/LandingPageTemplate";
import { getLandingSlugs, isLandingSlug } from "@/lib/landing-pages";
import { loadLandingContent } from "@/lib/markdown";
import { landingMetadata } from "@/lib/metadata";
import { landingJsonLd } from "@/lib/structured-data";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getLandingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  if (!isLandingSlug(slug)) return {};
  const content = await loadLandingContent(slug);
  if (!content) return {};
  return landingMetadata({ slug, frontmatter: content.frontmatter });
}

export default async function LandingRoute({ params }: RouteParams) {
  const { slug } = await params;
  if (!isLandingSlug(slug)) notFound();

  const content = await loadLandingContent(slug);
  if (!content) notFound();

  const jsonLd = landingJsonLd({ slug, frontmatter: content.frontmatter });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPageTemplate slug={slug} content={content} />
    </>
  );
}
