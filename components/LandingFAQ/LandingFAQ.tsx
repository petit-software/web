import type { AEOFaq } from "@/lib/markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface LandingFAQProps {
  faqs: AEOFaq[];
  title?: string;
}

export default function LandingFAQ({ faqs, title = "Frequently asked" }: LandingFAQProps) {
  if (!faqs.length) return null;
  return (
    <section
      aria-labelledby="page-faq-title"
      className="mx-auto w-full max-w-3xl px-6 py-16 md:py-24"
    >
      <h2 id="page-faq-title" className="mb-8 text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      <Accordion type="single" collapsible>
        {faqs.map((faq, i) => (
          <AccordionItem key={faq.q} value={`item-${i}`}>
            <AccordionTrigger>{faq.q}</AccordionTrigger>
            <AccordionContent>{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
