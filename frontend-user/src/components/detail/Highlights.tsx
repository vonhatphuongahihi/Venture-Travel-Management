import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useTranslation } from "react-i18next";
import { parseHtmlToLines } from "@/lib/utils";

export default function Highlights({ highlight }) {
  const { t } = useTranslation();
  
  if (!highlight) return null;

  // Handle both array and string (HTML) formats
  let items: string[] = [];
  if (Array.isArray(highlight)) {
    items = highlight.filter(item => item && item.trim());
  } else if (typeof highlight === 'string') {
    // Check if it's HTML
    if (highlight.includes('<')) {
      items = parseHtmlToLines(highlight);
    } else {
      // Plain text, split by newlines
      items = highlight.split('\n').map(line => line.trim()).filter(line => line);
    }
  }

  if (items.length === 0) return null;

  return (
    <div className="mb-2">
      <Accordion type="single" collapsible>
        <AccordionItem value="highlights" className="border-none">
          <AccordionTrigger className="w-full text-left font-medium">
            <h2 className="text-xl font-bold">{t('tourDetail.highlights')}</h2>
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
