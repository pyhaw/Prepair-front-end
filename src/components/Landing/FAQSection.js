"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  return (
    <section className="py-16 px-4 bg-orange-50">
      <h2 className="text-3xl font-semibold text-center mb-10 text-orange-600">
        Frequently Asked Questions
      </h2>

      <div className="max-w-2xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I book a repair?</AccordionTrigger>
            <AccordionContent>
              Click "Make a Request", choose a category, and submit your details. A professional will contact you shortly!
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Are the experts verified?</AccordionTrigger>
            <AccordionContent>
              Yes, all our fixers are background-checked and reviewed by real users.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Is there a service fee?</AccordionTrigger>
            <AccordionContent>
              No hidden fees! You only pay for the job after confirming the quote.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
