import { Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Faq } from "@/data/faq";

/** FAQ list in the site's editorial style. Radix gives the correct button/region semantics and keyboard support. */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div>
    <h2 className="sr-only">Frequently asked questions</h2>
    <Accordion type="single" collapsible className="border-t border-border">
      {items.map((f, i) => (
        <AccordionItem key={f.question} value={`q-${i}`} className="border-b border-border">
          <AccordionTrigger className="group gap-6 py-6 text-left font-display text-xl font-semibold hover:no-underline md:text-2xl [&>svg]:hidden" style={{ letterSpacing: "-0.025em" }}>
            <span>{f.question}</span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-foreground/70 transition-transform duration-300 group-data-[state=open]:rotate-45" aria-hidden="true">
              <Plus className="h-4 w-4" />
            </span>
          </AccordionTrigger>
          <AccordionContent className="max-w-2xl pb-7 text-base leading-relaxed text-muted-foreground">{f.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
    </div>
  );
}
