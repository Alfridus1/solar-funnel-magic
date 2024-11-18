import { MessageSquare } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const FAQ = () => {
  const { data: faqs } = useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('order_number');
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="py-16">
      <div className="flex items-center justify-center gap-4 mb-12">
        <MessageSquare className="h-8 w-8 text-[#F75c03]" />
        <h2 className="text-3xl font-bold">Häufig gestellte Fragen</h2>
      </div>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs?.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-white/80 backdrop-blur rounded-xl border-[#F75c03]/20">
              <AccordionTrigger className="px-6 hover:text-[#F75c03]">{faq.question}</AccordionTrigger>
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