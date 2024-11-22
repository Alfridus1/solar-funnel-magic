import { cn } from "@/lib/utils";

interface HeroImageProps {
  className?: string;
}

export const HeroImage = ({ className }: HeroImageProps) => {
  return (
    <div className={cn("relative w-full h-[500px] overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent z-10" />
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white text-center p-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-up">
          Ihre unverbindliche Potenzialanalyse
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto animate-fade-up">
          Hochwertige Komponenten für maximale Effizienz und Langlebigkeit
        </p>
      </div>
      <img
        src="/lovable-uploads/03677377-bf21-4a7d-b8a4-c5f6e9b87885.png"
        alt="Modern solar house"
        className="w-full h-full object-cover"
      />
    </div>
  );
};