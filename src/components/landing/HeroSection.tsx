import { useState } from "react";
import { RoofCheck } from "@/components/RoofCheck";

export const HeroSection = () => {
  const [showRoofCheck, setShowRoofCheck] = useState(false);
  const address = "Some Address"; // Example address

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500 to-transparent" />
      <div className="relative z-10 text-white text-center">
        <h1 className="text-5xl font-bold">Willkommen bei Solartechnik</h1>
        <p className="mt-4 text-lg">Berechnen Sie Ihr ideales Solarsystem.</p>
        <button
          className="mt-8 px-6 py-3 bg-green-500 rounded-full hover:bg-green-600"
          onClick={() => setShowRoofCheck(true)}
        >
          Dach hinzufügen
        </button>
      </div>
      {showRoofCheck && (
        <RoofCheck />
      )}
    </section>
  );
};
