import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export interface HeroFrontmatter {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
}

export interface CTAFrontmatter {
  title: string;
  subtitle?: string;
  buttonLabel?: string;
  placeholder?: string;
  tags?: string[];
}

export interface LandingFrontmatter {
  hero: HeroFrontmatter;
  cta: CTAFrontmatter;
}

export interface LoadedLanding {
  frontmatter: LandingFrontmatter;
  body: string;
}

const CONTENT_ROOT = path.join(process.cwd(), "content", "landing");

export async function loadLandingContent(slug: string): Promise<LoadedLanding | null> {
  const filePath = path.join(CONTENT_ROOT, `${slug}.md`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf-8");
  } catch {
    return null;
  }

  const parsed = matter(raw);
  const data = parsed.data as Partial<LandingFrontmatter>;

  if (!data.hero?.title || !data.cta?.title) {
    throw new Error(
      `Landing page "${slug}" is missing required frontmatter (hero.title and cta.title).`,
    );
  }

  return {
    frontmatter: {
      hero: data.hero,
      cta: data.cta,
    },
    body: parsed.content,
  };
}

export function resolveImagePath(slug: string, src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }
  return `/blog/${slug}/${src.replace(/^\.\//, "")}`;
}
