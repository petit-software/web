"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { HeroFrontmatter } from "@/lib/markdown";
import styles from "./LandingHero.module.css";

interface LandingHeroProps {
  hero: HeroFrontmatter;
  slug: string;
}

export default function LandingHero({ hero, slug }: LandingHeroProps) {
  const reduce = useReducedMotion();
  const imageSrc = hero.image ? resolveHeroImage(slug, hero.image) : null;

  const fadeUp = (delay: number) =>
    reduce
      ? { initial: false, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className={styles.hero}>
      <div className={`container-md ${styles.inner}`}>
        {hero.eyebrow && (
          <motion.span className={`type-eyebrow ${styles.eyebrow}`} {...fadeUp(0)}>
            {hero.eyebrow}
          </motion.span>
        )}

        <motion.h1 className={`type-hero ${styles.title}`} {...fadeUp(0.05)}>
          {hero.title}
        </motion.h1>

        {hero.subtitle && (
          <motion.p
            className={`type-subtitle ${styles.subtitle} text-secondary`}
            {...fadeUp(0.12)}
          >
            {hero.subtitle}
          </motion.p>
        )}

        {imageSrc && (
          <motion.div className={styles.imageWrap} {...fadeUp(0.2)}>
            <Image
              src={imageSrc}
              alt={hero.imageAlt ?? ""}
              width={1600}
              height={900}
              priority
              className={styles.image}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}

function resolveHeroImage(slug: string, src: string): string {
  if (src.startsWith("http") || src.startsWith("/")) return src;
  return `/blog/${slug}/${src.replace(/^\.\//, "")}`;
}
