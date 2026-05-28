import LandingHeader from "@/components/LandingHeader";
import LandingHero from "@/components/LandingHero";
import MarkdownContent from "@/components/MarkdownContent";
import LandingCTA from "@/components/LandingCTA";
import type { LoadedLanding } from "@/lib/markdown";
import styles from "./LandingPageTemplate.module.css";

interface LandingPageTemplateProps {
  slug: string;
  content: LoadedLanding;
}

export default function LandingPageTemplate({ slug, content }: LandingPageTemplateProps) {
  const { frontmatter, body } = content;
  return (
    <div className={styles.main}>
      <LandingHeader />
      <main>
        <LandingHero hero={frontmatter.hero} slug={slug} />
        <MarkdownContent slug={slug} body={body} />
        <LandingCTA cta={frontmatter.cta} source={slug} />
      </main>
    </div>
  );
}
