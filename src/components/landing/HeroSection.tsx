import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  address: string;
  setAddress: (address: string) => void;
  handleGeolocation: () => void;
  setShowRoofCheck: (show: boolean) => void;
  onShowLogin: () => void;
  onShowRegister: () => void;
  isLoggedIn: boolean;
}

export const HeroSection = ({
  address,
  setAddress,
  handleGeolocation,
  setShowRoofCheck,
}: HeroSectionProps) => {
  return (
    <div className="relative min-h-[600px] sm:min-h-[700px]">
      {/* Hero Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/lovable-uploads/03677377-bf21-4a7d-b8a4-c5f6e9b87885.png"
          alt="Solar panels on modern house roof"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center justify-center min-h-[600px] sm:min-h-[700px] px-4 pt-20"
      >
        {/* Logo */}
        <motion.img
          src="/lovable-uploads/f2d1edec-2b0f-4af0-9ec8-9e7caf7a8ea7.png"
          alt="COPPEN Logo"
          className="w-48 sm:w-56 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />

        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 text-white text-center max-w-4xl">
          Sparen Sie bis zu 80% Ihrer Stromkosten
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto text-center px-4">
          Berechnen Sie in nur 2 Minuten Ihr persönliches Solardach und erhalten Sie ein unverbindliches Angebot
        </p>

        <div className="w-full max-w-2xl mx-auto bg-white/95 backdrop-blur rounded-xl shadow-lg p-4 sm:p-6 mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ihre Adresse eingeben"
                className="flex-1 h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-solar-orange text-base"
              />
              <Button
                onClick={handleGeolocation}
                variant="outline"
                className="h-12 px-4 border-gray-200 hover:bg-gray-50 shrink-0"
                title="Standort erkennen"
              >
                <MapPin className="h-5 w-5 text-solar-orange" />
              </Button>
            </div>
            <Button 
              onClick={() => setShowRoofCheck(true)}
              className="h-12 bg-solar-orange hover:bg-solar-orange-dark text-white px-6 rounded-lg font-semibold whitespace-nowrap w-full sm:w-auto"
            >
              Jetzt berechnen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};