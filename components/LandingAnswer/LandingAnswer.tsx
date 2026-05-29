import { LightbulbIcon } from "lucide-react";
import type { AEOFrontmatter } from "@/lib/markdown";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LandingAnswerProps {
  aeo: AEOFrontmatter;
}

export default function LandingAnswer({ aeo }: LandingAnswerProps) {
  return (
    <section
      aria-labelledby="page-answer"
      className="mx-auto w-full max-w-3xl px-6 pt-8 md:pt-12"
    >
      <Alert>
        <LightbulbIcon />
        <AlertTitle id="page-answer">The short answer</AlertTitle>
        <AlertDescription>{aeo.summary}</AlertDescription>
      </Alert>
    </section>
  );
}
