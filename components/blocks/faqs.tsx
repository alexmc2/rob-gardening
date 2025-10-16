// components/blocks/faqs.tsx
import SectionContainer from "@/components/ui/section-container";
import { stegaClean } from "next-sanity";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { PAGE_QUERYResult } from "@/sanity.types";

type FAQProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "faqs" }
>;

export default function FAQs({
  padding,
  colorVariant,
  faqs,
  enableFadeIn,
}: FAQProps) {
  const color = stegaClean(colorVariant);
  return (
    <SectionContainer
      color={color}
      padding={padding}
      enableFadeIn={enableFadeIn}
    >
      {faqs && faqs?.length > 0 && (
        <Accordion className="space-y-4" type="multiple">
          {faqs.map((faq) => (
            <AccordionItem key={faq.title} value={`item-${faq._id}`}>
              <AccordionTrigger>{faq.title}</AccordionTrigger>
              <AccordionContent>
                <PortableTextRenderer value={faq.body || []} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </SectionContainer>
  );
}
