import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useTranslation } from "react-i18next";
import { parseHtmlToLines } from "@/lib/utils";

export default function Expectations({ expectations }) {
  const { t } = useTranslation();

  if (!expectations) return null;

  // Handle both array and string (HTML) formats
  let items: string[] = [];
  let isList = false; // Track if content should be rendered as list

  if (Array.isArray(expectations)) {
    items = expectations.filter(item => item && item.trim());
    isList = items.length > 0;
  } else if (typeof expectations === 'string') {
    // Check if it's HTML
    if (expectations.includes('<')) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = expectations;

      // Check if it contains list items
      const listItems = tempDiv.querySelectorAll('li, ol li, ul li');
      if (listItems.length > 0) {
        // It's a list, render as list
        isList = true;
        listItems.forEach((li) => {
          const text = (li as HTMLElement).textContent || (li as HTMLElement).innerText || '';
          if (text.trim()) {
            items.push(text.trim());
          }
        });
      } else {
        // It's paragraphs or plain text, render as text blocks
        isList = false;
        const paragraphs = tempDiv.querySelectorAll('p');
        if (paragraphs.length > 0) {
          paragraphs.forEach((p) => {
            const text = p.textContent || (p as HTMLElement).innerText || '';
            if (text.trim()) {
              items.push(text.trim());
            }
          });
        } else {
          // Fallback: get all text
          const text = tempDiv.textContent || (tempDiv as HTMLElement).innerText || '';
          if (text.trim()) {
            items.push(text.trim());
          }
        }
      }
    } else {
      // Plain text, split by newlines and render as list if multiple lines
      items = expectations.split('\n').map(line => line.trim()).filter(line => line);
      isList = items.length > 1; // Render as list only if multiple items
    }
  }

  if (items.length === 0) return null;

  return (
    <div className="mb-2">
      <Accordion type="single" collapsible>
        <AccordionItem value="expectations" className="border-none">
          <AccordionTrigger className="w-full text-left font-medium">
            <h2 className="text-xl font-bold">{t('tourDetail.expectations')}</h2>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            {isList ? (
              <ul>
                {items.map((item, index) => (
                  <li key={index} className="mb-2 list-disc list-inside text-justify">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-2">
                {items.map((item, index) => (
                  <p key={index} className="text-justify">
                    {item}
                  </p>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="w-full border-t border-primary my-2" />
    </div>
  );
}
