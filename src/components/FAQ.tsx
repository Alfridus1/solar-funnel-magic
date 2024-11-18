import { MessageSquare } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ = () => {
  const faqs = [
    {
      question: "Wie lange dauert die Installation einer Solaranlage?",
      answer: "Die Installation einer typischen Solaranlage dauert in der Regel 2-3 Tage. Der gesamte Prozess von der Planung bis zur Inbetriebnahme kann etwa 4-6 Wochen in Anspruch nehmen.",
    },
    {
      question: "Welche Förderungen gibt es für Solaranlagen?",
      answer: "Es gibt verschiedene Fördermöglichkeiten, darunter zinsgünstige KfW-Kredite und regionale Förderprogramme. Wir beraten Sie gerne zu den aktuellen Fördermöglichkeiten in Ihrer Region.",
    },
    {
      question: "Wie hoch sind die Wartungskosten?",
      answer: "Die Wartungskosten für Solaranlagen sind in der Regel sehr gering. Eine jährliche Inspektion wird empfohlen und kostet etwa 150-200 Euro.",
    },
    {
      question: "Wie lange halten Solarmodule?",
      answer: "Hochwertige Solarmodule haben eine Lebensdauer von 25-30 Jahren. Die Hersteller geben meist eine Leistungsgarantie von 25 Jahren.",
    },
  ];

  return (
    <div className="py-16">
      <div className="flex items-center justify-center gap-4 mb-12">
        <MessageSquare className="h-8 w-8 text-blue-600" />
        <h2 className="text-3xl font-bold">Häufig gestellte Fragen</h2>
      </div>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-white/80 backdrop-blur rounded-xl">
              <AccordionTrigger className="px-6">{faq.question}</AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};