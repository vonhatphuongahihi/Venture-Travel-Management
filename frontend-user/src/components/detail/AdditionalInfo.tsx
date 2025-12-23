import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useTranslation } from "react-i18next";
import { parseHtmlToLines } from "@/lib/utils";

export default function AdditionalInfo({ additionalInfo }) {
  const { t } = useTranslation();

  if (!additionalInfo) return null;

  // Handle HTML content
  let items: string[] = [];
  if (typeof additionalInfo === 'string') {
    // Check if it's HTML
    if (additionalInfo.includes('<')) {
      items = parseHtmlToLines(additionalInfo);
    } else {
      // Plain text, split by newlines
      items = additionalInfo.split("\n").filter((line) => line.trim() !== "");
    }
  } else if (Array.isArray(additionalInfo)) {
    items = additionalInfo.filter(item => item && item.trim());
  }

  if (items.length === 0) return null;

  return (
    <div className="mb-2">
      <Accordion type="single" collapsible>
        <AccordionItem value="additionalInfo" className="border-none">
          <AccordionTrigger className="w-full text-left font-medium">
            <h2 className="text-xl font-bold">{t('tourDetail.additionalInfo')}</h2>
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
