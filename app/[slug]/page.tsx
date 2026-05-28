import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LandingPageTemplate from "@/components/LandingPageTemplate";
import { getLandingPage, getLandingSlugs } from "@/lib/landing-pages";
import { loadLandingContent } from "@/lib/markdown";
import { landingMetadata } from "@/lib/metadata";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getLandingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) return {};
  return landingMetadata(page);
}

export default async function LandingRoute({ params }: RouteParams) {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) notFound();

  const content = await loadLandingContent(slug);
  if (!content) notFound();

  return <LandingPageTemplate slug={slug} content={content} />;
}
