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

function PrivacyPolicy() {
  const { t } = useTranslation();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  const items = [
    {
      title: <h1 className="text-xl">{t("privacy.items.collection.title")}</h1>,
      content: (
        <div className="text-base mx-2 text-black space-y-2">
          {t("privacy.items.collection.content.intro")}
          <ul className="list-disc pl-6">
            <li>{t("privacy.items.collection.content.list.item1")}</li>
            <li>{t("privacy.items.collection.content.list.item2")}</li>
            <li>{t("privacy.items.collection.content.list.item3")}</li>
            <li>{t("privacy.items.collection.content.list.item4")}</li>
            <li>{t("privacy.items.collection.content.list.item5")}</li>
            <li>{t("privacy.items.collection.content.list.item6")}</li>
            <li>{t("privacy.items.collection.content.list.item7")}</li>
            <li>{t("privacy.items.collection.content.list.item8")}</li>
            <li>{t("privacy.items.collection.content.list.item9")}</li>
            <li>{t("privacy.items.collection.content.list.item10")}</li>
            <li>{t("privacy.items.collection.content.list.item11")}</li>
            <li>{t("privacy.items.collection.content.list.item12")}</li>
            <li>{t("privacy.items.collection.content.list.item13")}</li>
            <li>{t("privacy.items.collection.content.list.item14")}</li>
          </ul>
        </div>
      ),
    },
    {
      title: <h1 className="text-xl">{t("privacy.items.usage.title")}</h1>,
      content: (
        <div className="text-base mx-2 text-black space-y-2">
          {t("privacy.items.usage.content.intro")}
          <ul className="list-disc pl-6">
            <li>{t("privacy.items.usage.content.list.item1")}</li>
            <li>{t("privacy.items.usage.content.list.item2")}</li>
            <li>{t("privacy.items.usage.content.list.item3")}</li>
            <li>{t("privacy.items.usage.content.list.item4")}</li>
            <li>{t("privacy.items.usage.content.list.item5")}</li>
          </ul>
          <p>{t("privacy.items.usage.content.closing")}</p>
        </div>
      ),
    },
    {
      title: <h1 className="text-xl">{t("privacy.items.sharing.title")}</h1>,
      content: (
        <div className="text-base mx-2 text-black space-y-2">
          <p>{t("privacy.items.sharing.content.p1")}</p>
          <p>{t("privacy.items.sharing.content.p2")}</p>
          <p dangerouslySetInnerHTML={{ __html: t("privacy.items.sharing.content.p3") }} />
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
            {t("privacy.heroTitle")}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl ml-auto">
            {t("privacy.heroSubtitle")}
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
            {t("privacy.sectionTitle")}
          </h2>
          <p className="italic mb-4">{t("privacy.lastUpdated", { date: "07/07/2025" })}</p>
          <p>
            {t("privacy.intro")}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full py-5 mb-10">
        <div className="container flex flex-col justify-center">
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

export default PrivacyPolicy;
