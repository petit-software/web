import LandingHeader from "@/components/LandingHeader";
import LandingHero from "@/components/LandingHero";
import LandingAnswer from "@/components/LandingAnswer";
import MarkdownContent from "@/components/MarkdownContent";
import LandingFAQ from "@/components/LandingFAQ";
import LandingCTA from "@/components/LandingCTA";
import type { LoadedLanding } from "@/lib/markdown";

interface LandingPageTemplateProps {
  slug: string;
  content: LoadedLanding;
}

export default function LandingPageTemplate({ slug, content }: LandingPageTemplateProps) {
  const { frontmatter, body } = content;
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero hero={frontmatter.hero} slug={slug} />
        <LandingAnswer aeo={frontmatter.aeo} />
        <MarkdownContent slug={slug} body={body} />
        {frontmatter.aeo.faqs?.length ? <LandingFAQ faqs={frontmatter.aeo.faqs} /> : null}
        <LandingCTA cta={frontmatter.cta} source={slug} />
      </main>
    </div>
  );
}
