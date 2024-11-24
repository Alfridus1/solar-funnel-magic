import { CheckCircle } from "lucide-react";

export const Benefits = () => {
  const benefits = [
    {
      title: "Komplette DC Installation",
      description: "Professionelle Installation der Solarmodule und Verkabelung auf Ihrem Dach",
    },
    {
      title: "AC Installation",
      description: "Fachgerechte Installation des Wechselrichters und neuen Zählerschranks nach aktuellen Standards",
    },
    {
      title: "Smart Home Integration",
      description: "Intelligente Vernetzung mit Ihrem Heimnetzwerk für optimale Energiesteuerung",
    },
    {
      title: "Wartung & Service",
      description: "Regelmäßige Wartung und schneller Support bei Fragen oder Problemen",
    },
    {
      title: "Behördengänge",
      description: "Wir kümmern uns um alle notwendigen Anmeldungen und Genehmigungen",
    },
    {
      title: "Garantierte Qualität",
      description: "Premium Komponenten mit langer Garantiezeit und TÜV-zertifizierte Installation",
    },
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-solar-orange/5 to-white">
      <h2 className="text-3xl font-bold text-center mb-4">Unser Komplettpaket</h2>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto px-4">
        Von der Planung bis zur Wartung - wir bieten Ihnen einen Rundum-Sorglos-Service für Ihre Solaranlage
      </p>
      <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto px-4">
        {benefits.map((benefit, index) => (
          <div 
            key={index} 
            className="flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-6 w-6 text-solar-orange flex-shrink-0" />
              <h3 className="text-xl font-semibold">{benefit.title}</h3>
            </div>
            <p className="text-gray-600 ml-9">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};