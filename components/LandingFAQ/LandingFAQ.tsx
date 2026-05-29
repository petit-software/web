import type { AEOFaq } from "@/lib/markdown";
import styles from "./LandingFAQ.module.css";

interface LandingFAQProps {
  faqs: AEOFaq[];
  title?: string;
}

export default function LandingFAQ({ faqs, title = "Frequently asked" }: LandingFAQProps) {
  if (!faqs.length) return null;
  return (
    <section className={styles.section} aria-labelledby="page-faq-title">
      <div className={`container-md ${styles.inner}`}>
        <h2 id="page-faq-title" className={`type-display ${styles.title}`}>
          {title}
        </h2>
        <dl className={styles.list}>
          {faqs.map((faq) => (
            <div key={faq.q} className={styles.item}>
              <dt className={styles.question}>{faq.q}</dt>
              <dd className={styles.answer}>{faq.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
