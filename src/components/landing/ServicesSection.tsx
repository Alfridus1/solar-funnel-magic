import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  SunMedium, 
  Battery, 
  Lightbulb, 
  HomeIcon, 
  Car, 
  Wrench,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const iconMap = {
  solar_modules: SunMedium,
  battery: Battery,
  smart_home: Lightbulb,
  heat_pump: HomeIcon,
  wallbox: Car,
  service: Wrench,
};

const colorMap = {
  solar_modules: "bg-amber-500",
  battery: "bg-green-500",
  smart_home: "bg-blue-500",
  heat_pump: "bg-red-500",
  wallbox: "bg-purple-500",
  service: "bg-gray-500",
};

interface ContentItem {
  section: string;
  title: string;
  description: string;
}

export const ServicesSection = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [headerContent, setHeaderContent] = useState<ContentItem | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      const { data, error } = await supabase
        .from('landing_page_content')
        .select('*');

      if (error) {
        console.error('Error loading content:', error);
        return;
      }

      const header = data.find(item => item.section === 'services_header');
      const services = data.filter(item => item.section !== 'services_header' && item.section !== 'cta');
      
      setHeaderContent(header || null);
      setContent(services || []);
    };

    loadContent();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-solar-blue-50 to-white">
      <div className="container mx-auto px-4">
        {headerContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {headerContent.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {headerContent.description}
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.map((item, index) => {
            const Icon = iconMap[item.section as keyof typeof iconMap];
            const color = colorMap[item.section as keyof typeof colorMap];
            
            return (
              <motion.div
                key={item.section}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8"
              >
                <div className={`${color} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                  <Icon className="h-9 w-9 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};