import EmailSignup from "@/components/EmailSignup";
import type { CTAFrontmatter } from "@/lib/markdown";
import styles from "./LandingCTA.module.css";

interface LandingCTAProps {
  cta: CTAFrontmatter;
  source?: string;
}

export default function LandingCTA({ cta, source }: LandingCTAProps) {
  return (
    <section className={styles.cta}>
      <div className={`container-sm ${styles.inner}`}>
        <h2 className={`type-display ${styles.title}`}>{cta.title}</h2>
        {cta.subtitle && (
          <p className={`type-subtitle text-secondary ${styles.subtitle}`}>{cta.subtitle}</p>
        )}
        <EmailSignup
          buttonLabel={cta.buttonLabel}
          placeholder={cta.placeholder}
          tags={cta.tags}
          source={source}
        />
      </div>
    </section>
  );
}
