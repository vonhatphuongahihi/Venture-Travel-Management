import Header from "@/components/Header";
import landscapeSeaImg from "@/assets/landscape-sea.jpg";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

function TermOfUse() {
  const { t } = useTranslation();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  const items = [
    {
      title: <h1 className="text-xl">{t("terms.items.acceptance.title")}</h1>,
      content: (
        <div className="text-base mx-2 text-black space-y-2">
          <p>{t("terms.items.acceptance.content.p1")}</p>
          <p>{t("terms.items.acceptance.content.p2")}</p>
        </div>
      ),
    },
    {
      title: <h1 className="text-xl">{t("terms.items.account.title")}</h1>,
      content: (
        <div className="text-base mx-2 text-black space-y-2">
          <p>{t("terms.items.account.content.p1")}</p>
          <p>{t("terms.items.account.content.p2")}</p>
        </div>
      ),
    },
    {
      title: (
        <h1 className="text-xl">{t("terms.items.booking.title")}</h1>
      ),
      content: (
        <div className="text-base mx-2 text-black space-y-2">
          <p>{t("terms.items.booking.content.p1")}</p>
          <p>{t("terms.items.booking.content.p2")}</p>
        </div>
      ),
    },
    {
      title: <h1 className="text-xl">{t("terms.items.ip.title")}</h1>,
      content: (
        <div className="text-base mx-2 text-black space-y-2">
          <p>{t("terms.items.ip.content.p1")}</p>
        </div>
      ),
    },
    {
      title: <h1 className="text-xl">{t("terms.items.liability.title")}</h1>,
      content: (
        <div className="text-base mx-2 text-black space-y-2">
          <p>{t("terms.items.liability.content.p1")}</p>
          <p>{t("terms.items.liability.content.p2")}</p>
          <ul className="list-disc pl-6">
            <li>{t("terms.items.liability.content.list.item1")}</li>
            <li>{t("terms.items.liability.content.list.item2")}</li>
            <li>{t("terms.items.liability.content.list.item3")}</li>
          </ul>
        </div>
      ),
    },
    {
      title: (
        <h1 className="text-xl">
          {t("terms.items.responsibility.title")}
        </h1>
      ),
      content: (
        <div className="text-base mx-2 text-black space-y-2">
          <p>{t("terms.items.responsibility.content.p1")}</p>
          <p>{t("terms.items.responsibility.content.p2")}</p>
        </div>
      ),
    },
  ];
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img
          src={landscapeSeaImg}
          alt="Landscape Sea Background"
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/"></div>

        <div
          className={`container text-right relative z-10 transition-all duration-1000 ${isPageLoaded
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
            }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            {t("terms.heroTitle")}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl ml-auto">
            {t("terms.heroSubtitle")}
          </p>
        </div>
      </section>
      <section className="mx-auto w-full py-5">
        <div
          className={`container flex flex-col justify-center transition-all duration-1000 delay-200 ${isPageLoaded
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
            }`}
        >
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            {t("terms.sectionTitle")}
          </h2>
          <p className="italic mb-4">{t("terms.lastUpdated", { date: "10/07/2025" })}</p>
          <p>
            {t("terms.intro")}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full py-5 mb-10">
        <div
          className={`container flex flex-col justify-center transition-all duration-1000 delay-200 ${isPageLoaded
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
            }`}
        >
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-2"
            defaultValue="item-1"
          >
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index + 1}`}
                className="bg-card rounded-md border-b-0 shadow-md data-[state=open]:shadow-lg"
              >
                <AccordionTrigger className="px-5 [&>svg]:rotate-90 [&[data-state=open]>svg]:rotate-0">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground px-5">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default TermOfUse;
