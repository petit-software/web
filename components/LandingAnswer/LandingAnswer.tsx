import type { AEOFrontmatter } from "@/lib/markdown";
import styles from "./LandingAnswer.module.css";

interface LandingAnswerProps {
  aeo: AEOFrontmatter;
}

export default function LandingAnswer({ aeo }: LandingAnswerProps) {
  return (
    <section className={styles.section} aria-labelledby="page-answer">
      <div className={`container-md ${styles.inner}`}>
        <p id="page-answer" className={`type-eyebrow ${styles.eyebrow}`}>
          The short answer
        </p>
        <p className={styles.summary}>{aeo.summary}</p>
      </div>
    </section>
  );
}
