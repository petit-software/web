import EmailSignup from "@/components/EmailSignup";
import type { CTAFrontmatter } from "@/lib/markdown";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface LandingCTAProps {
  cta: CTAFrontmatter;
  source?: string;
}

export default function LandingCTA({ cta, source }: LandingCTAProps) {
  return (
    <section id="signup" className="mx-auto w-full max-w-2xl px-6 py-16 md:py-24">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">{cta.title}</CardTitle>
          {cta.subtitle && <CardDescription>{cta.subtitle}</CardDescription>}
        </CardHeader>
        <CardContent>
          <EmailSignup
            buttonLabel={cta.buttonLabel}
            placeholder={cta.placeholder}
            source={source}
            segmentId={cta.segmentId}
          />
        </CardContent>
      </Card>
    </section>
  );
}
