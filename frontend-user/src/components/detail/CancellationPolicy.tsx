import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useTranslation } from "react-i18next";
import { parseHtmlToLines } from "@/lib/utils";

export default function CancellationPolicy({ cancelPolicy }) {
  const { t } = useTranslation();
  
  if (!cancelPolicy) return null;

  // Handle HTML content
  let items: string[] = [];
  if (typeof cancelPolicy === 'string') {
    // Check if it's HTML
    if (cancelPolicy.includes('<')) {
      items = parseHtmlToLines(cancelPolicy);
    } else {
      // Plain text, split by newlines
      items = cancelPolicy.split("\n").filter((line) => line.trim() !== "");
    }
  } else if (Array.isArray(cancelPolicy)) {
    items = cancelPolicy.filter(item => item && item.trim());
  }

  if (items.length === 0) return null;

  return (
    <div className="mb-2">
      <Accordion type="single" collapsible>
        <AccordionItem value="cancellationPolicy" className="border-none">
          <AccordionTrigger className="w-full text-left font-medium">
            <h2 className="text-xl font-bold">{t('tourDetail.cancellationPolicy')}</h2>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <ul>
              {items.map((item, index) => (
                <li key={index} className="mb-2 list-disc list-inside text-justify">
                  {item}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="w-full border-t border-primary my-2" />
    </div>
  );
}
