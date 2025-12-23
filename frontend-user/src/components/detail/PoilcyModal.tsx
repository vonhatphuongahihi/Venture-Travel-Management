import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useTranslation } from "react-i18next";
import { parseHtmlToLines } from "@/lib/utils";

function PoilcyModal({ cancelPolicy }: { cancelPolicy: string }) {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-sm font-bold underline cursor-pointer">
          {t('tourDetail.cancellationPolicy')}
        </span>
      </DialogTrigger>
      <DialogContent aria-description={undefined}>
        <DialogTitle>{t('tourDetail.cancellationPolicy')}</DialogTitle>
        <div>
          <ul>
            {items.map((item, index) => (
              <li key={index} className="mb-2 list-disc list-inside text-justify">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PoilcyModal;
