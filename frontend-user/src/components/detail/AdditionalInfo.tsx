import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function AdditionalInfo({ additionalInfo }) {
  if (!additionalInfo) return null;
  const addInfo = additionalInfo
    .split("\n")
    .filter((line) => line.trim() !== "");

  return (
    <div className="mb-2">
      <Accordion type="single" collapsible>
        <AccordionItem value="expectations" className="border-none">
          <AccordionTrigger className="w-full text-left font-medium">
            <h2 className="text-xl font-bold">Thông tin bổ sung</h2>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <ul>
              {addInfo.map((item, index) => (
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
