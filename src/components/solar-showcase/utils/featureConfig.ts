import { Sun, Battery, Zap, Thermometer, Power } from "lucide-react";

const featureConfigs = {
  solar: {
    icon: Sun,
    position: "top-1/4 left-1/4",
    backgroundColor: "bg-amber-500",
    iconColor: "text-amber-500",
    label: "500W Full Black Module",
    title: "Full Black Module",
    description: "Hocheffiziente 500W Module für maximale Leistung",
    specs: [
      "500W Nennleistung",
      "21% Wirkungsgrad",
      "25 Jahre Garantie"
    ],
    image: "/module-image.png"
  },
  inverter: {
    icon: Zap,
    position: "bottom-1/3 right-1/3",
    backgroundColor: "bg-blue-500",
    iconColor: "text-blue-500",
    label: "Huawei SUN2000",
    title: "Huawei SUN2000 Wechselrichter",
    description: "Intelligenter Wechselrichter für optimale Energieumwandlung",
    specs: [
      "98.6% Wirkungsgrad",
      "Integriertes Monitoring",
      "10 Jahre Garantie"
    ],
    image: "/inverter-image.png"
  },
  battery: {
    icon: Battery,
    position: "bottom-1/4 left-1/3",
    backgroundColor: "bg-emerald-500",
    iconColor: "text-emerald-500",
    label: "LUNA 2000 Speicher",
    title: "LUNA 2000 Speicher",
    description: "Modularer Speicher für maximale Flexibilität",
    specs: [
      "15kWh Kapazität",
      "95% Entladetiefe",
      "10 Jahre Garantie"
    ],
    image: "/battery-image.png"
  },
  heatpump: {
    icon: Thermometer,
    position: "top-1/3 right-1/4",
    backgroundColor: "bg-red-500",
    iconColor: "text-red-500",
    label: "Wärmepumpe",
    title: "Wärmepumpe",
    description: "Effiziente Wärmepumpe für nachhaltige Heizung",
    specs: [
      "COP bis 5.0",
      "Smart Grid Ready",
      "7 Jahre Garantie"
    ],
    image: "/heatpump-image.png"
  },
  wallbox: {
    icon: Power,
    position: "bottom-1/4 right-1/4",
    backgroundColor: "bg-purple-500",
    iconColor: "text-purple-500",
    label: "Wallbox",
    title: "Smart Wallbox",
    description: "Intelligente Ladestation für Ihr Elektrofahrzeug",
    specs: [
      "11kW Ladeleistung",
      "Bidirektionales Laden",
      "Smart Home Integration"
    ],
    image: "/wallbox-image.png"
  }
} as const;

export const getFeatureConfig = (feature: string) => {
  return featureConfigs[feature as keyof typeof featureConfigs];
};