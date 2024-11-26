import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { RoofCheck } from "../RoofCheck";

export const HeroSection = () => {
  const [address, setAddress] = useState("");
  const [showRoofCheck, setShowRoofCheck] = useState(false);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      setShowRoofCheck(true);
    }
  };

  return (
    <section className="relative w-full">
      {/* Hero Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/lovable-uploads/03677377-bf21-4a7d-b8a4-c5f6e9b87885.png"
          alt="Solar panels on modern house roof"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center justify-center min-h-[800px] sm:min-h-[900px] px-4 sm:px-6 pt-20"
      >
        {/* Logo */}
        <motion.img
          src="/lovable-uploads/337fef83-79fd-4479-9b06-c12a527eed84.png"
          alt="COPPEN Logo"
          className="w-48 sm:w-56 mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white text-center max-w-4xl leading-tight">
          Sparen Sie bis zu 80% Ihrer Stromkosten
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 sm:mb-12 max-w-3xl mx-auto text-center px-4 leading-relaxed">
          Berechnen Sie in nur 2 Minuten Ihr persönliches Solardach und erhalten Sie ein unverbindliches Angebot
        </p>

        <div className="w-full max-w-2xl mx-auto bg-white/95 backdrop-blur rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ihre Adresse eingeben"
                className="flex-1 h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-solar-orange focus:border-transparent"
              />
            </div>
            <Button 
              onClick={() => setShowRoofCheck(true)}
              className="h-12 bg-solar-orange hover:bg-solar-orange-dark text-white px-6 rounded-lg font-semibold whitespace-nowrap w-full sm:w-auto transition-colors duration-200"
            >
              Jetzt berechnen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>

      {showRoofCheck && (
        <RoofCheck
          address={address}
        />
      )}
    </section>
  );
};