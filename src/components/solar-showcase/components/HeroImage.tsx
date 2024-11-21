import { cn } from "@/lib/utils";

interface HeroImageProps {
  className?: string;
}

export const HeroImage = ({ className }: HeroImageProps) => {
  return (
    <div className={cn("relative w-full h-[500px] overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent z-10" />
      <img
        src="/lovable-uploads/03677377-bf21-4a7d-b8a4-c5f6e9b87885.png"
        alt="Modern solar house"
        className="w-full h-full object-cover"
      />
    </div>
  );
};