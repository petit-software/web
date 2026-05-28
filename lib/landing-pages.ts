export interface LandingPage {
  slug: string;
  title: string;
  description: string;
  ogImage?: string;
}

export const landingPages: LandingPage[] = [
  {
    slug: "social-media-automation",
    title: "Social Media Automation",
    description:
      "Automate posts, replies, and reporting across every channel from one calm dashboard.",
    ogImage: "/blog/social-media-automation/og.png",
  },
];

export function getLandingPage(slug: string): LandingPage | undefined {
  return landingPages.find((page) => page.slug === slug);
}

export function getLandingSlugs(): string[] {
  return landingPages.map((page) => page.slug);
}
