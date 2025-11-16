import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function Highlights({ highlight }) {
  if (!highlight || highlight.length === 0) return null;

  return (
    <div className="mb-2">
      <Accordion type="single" collapsible>
        <AccordionItem value="expectations" className="border-none">
          <AccordionTrigger className="w-full text-left font-medium">
            <h2 className="text-xl font-bold">Điểm nổi bật</h2>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <ul>
              {highlight.map((item, index) => (
                <li key={index} className="mb-2 list-disc list-inside">
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
