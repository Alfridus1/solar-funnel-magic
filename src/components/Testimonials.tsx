import { Heart } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Michael Schmidt",
      role: "Hausbesitzer",
      text: "Die Beratung war erstklassig und die Installation verlief reibungslos. Wir sparen jetzt deutlich bei den Stromkosten!",
    },
    {
      name: "Sandra Meyer",
      role: "Architektin",
      text: "Professionelle Planung und perfekte Umsetzung. Das Team hat uns während des gesamten Prozesses hervorragend betreut.",
    },
    {
      name: "Thomas Weber",
      role: "Unternehmer",
      text: "Die Investition in unsere Solaranlage hat sich bereits nach kurzer Zeit ausgezahlt. Absolut empfehlenswert!",
    },
  ];

  return (
    <div className="py-16 bg-white/80 backdrop-blur rounded-2xl my-12">
      <h2 className="text-3xl font-bold text-center mb-12">Das sagen unsere Kunden</h2>
      <Carousel className="max-w-4xl mx-auto">
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index}>
              <div className="p-6 text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-4" />
                <p className="text-lg text-gray-700 italic mb-4">{testimonial.text}</p>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-gray-500">{testimonial.role}</div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};