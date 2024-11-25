import { motion } from "framer-motion";
import { Shield, Sparkles, Euro } from "lucide-react";

export const Features = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center p-6"
      >
        <Shield className="h-12 w-12 text-solar-orange mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">15 Jahre Garantie</h3>
        <p className="text-gray-600">Umfassender Schutz für Ihre Investition</p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center p-6"
      >
        <Sparkles className="h-12 w-12 text-solar-orange mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Premium Qualität</h3>
        <p className="text-gray-600">Nur hochwertige deutsche Komponenten</p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center p-6"
      >
        <Euro className="h-12 w-12 text-solar-orange mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Förderung sichern</h3>
        <p className="text-gray-600">Wir beraten Sie zu allen Fördermöglichkeiten</p>
      </motion.div>
    </div>
  );
};