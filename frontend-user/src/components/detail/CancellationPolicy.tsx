import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function CancellationPolicy({ cancelPolicy }) {
  if (!cancelPolicy) return null;
  const policy = cancelPolicy.split("\n").filter((line) => line.trim() !== "");

  return (
    <div className="mb-2">
      <Accordion type="single" collapsible>
        <AccordionItem value="expectations" className="border-none">
          <AccordionTrigger className="w-full text-left font-medium">
            <h2 className="text-xl font-bold">Chính sách hủy</h2>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <ul>
              {policy.map((item, index) => (
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
