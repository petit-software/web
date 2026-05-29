"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { HeroFrontmatter } from "@/lib/markdown";

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
    <section className="mx-auto w-full max-w-4xl px-6 pt-16 pb-12 text-center md:pt-24 md:pb-16">
      {hero.eyebrow && (
        <motion.span
          className="text-muted-foreground mb-4 inline-block text-xs font-medium tracking-wider uppercase"
          {...fadeUp(0)}
        >
          {hero.eyebrow}
        </motion.span>
      )}

      <motion.h1
        className="text-4xl font-semibold tracking-tight text-balance md:text-6xl"
        {...fadeUp(0.05)}
      >
        {hero.title}
      </motion.h1>

      {hero.subtitle && (
        <motion.p
          className="text-muted-foreground mt-4 text-lg text-balance md:text-xl"
          {...fadeUp(0.12)}
        >
          {hero.subtitle}
        </motion.p>
      )}

      {imageSrc && (
        <motion.div className="mt-12 overflow-hidden rounded-xl border" {...fadeUp(0.2)}>
          <Image
            src={imageSrc}
            alt={hero.imageAlt ?? ""}
            width={1600}
            height={900}
            priority
            className="h-auto w-full"
          />
        </motion.div>
      )}
    </section>
  );
}

function resolveHeroImage(slug: string, src: string): string {
  if (src.startsWith("http") || src.startsWith("/")) return src;
  return `/blog/${slug}/${src.replace(/^\.\//, "")}`;
}
