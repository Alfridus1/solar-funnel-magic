import { CheckCircle } from "lucide-react";

export const Benefits = () => {
  const benefits = [
    {
      title: "Maximale Ersparnis",
      description: "Optimieren Sie Ihre Energiekosten durch maßgeschneiderte Solaranlagen",
    },
    {
      title: "Schnelle Installation",
      description: "Professionelle Montage innerhalb weniger Tage",
    },
    {
      title: "Komplett-Service",
      description: "Von der Planung bis zur Wartung - alles aus einer Hand",
    },
    {
      title: "Garantierte Qualität",
      description: "Hochwertige Komponenten mit langer Garantiezeit",
    },
  ];

  return (
    <div className="py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Ihre Vorteile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex flex-col items-center text-center p-6 bg-white/80 backdrop-blur rounded-xl">
            <CheckCircle className="h-10 w-10 text-solar-orange mb-4" />
            <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};