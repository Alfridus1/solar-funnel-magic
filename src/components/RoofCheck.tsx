import { useState, useEffect } from "react";
import { Loader2, Sun, Home, Battery, Ruler } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleMap, Marker, Polygon, useLoadScript } from "@react-google-maps/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SolarEstimate {
  monthlyProduction: number;
  annualSavings: number;
  co2Reduction: number;
  roofCoverage: number;
  roofArea: number;
  possiblePanels: number;
}

const mockMonthlyData = [
  { name: "Jan", production: 400 },
  { name: "Feb", production: 500 },
  { name: "Mar", production: 650 },
  { name: "Apr", production: 800 },
  { name: "May", production: 950 },
  { name: "Jun", production: 1000 },
  { name: "Jul", production: 1050 },
  { name: "Aug", production: 950 },
  { name: "Sep", production: 800 },
  { name: "Oct", production: 600 },
  { name: "Nov", production: 450 },
  { name: "Dec", production: 380 },
];

// Simulated AI roof measurement function
const measureRoof = (coordinates: { lat: number; lng: number }) => {
  // In a real implementation, this would use AI to analyze satellite imagery
  // Here we're simulating the measurement with random but realistic values
  const baseArea = 120 + Math.random() * 50; // Random roof area between 120-170m²
  const usableArea = baseArea * 0.7; // 70% of the roof area is usable
  const panelsCount = Math.floor(usableArea / 2); // Each panel is 2m²

  return {
    totalArea: Math.round(baseArea),
    usableArea: Math.round(usableArea),
    possiblePanels: panelsCount,
  };
};

// Simulated roof polygon points based on center coordinates
const getRoofPolygon = (center: { lat: number; lng: number }) => {
  const offset = 0.0003; // Approximately 30m at most latitudes
  return [
    { lat: center.lat - offset, lng: center.lng - offset },
    { lat: center.lat + offset, lng: center.lng - offset },
    { lat: center.lat + offset, lng: center.lng + offset },
    { lat: center.lat - offset, lng: center.lng + offset },
  ];
};

const RoofAnalysis = ({ address }: { address: string }) => {
  const [coordinates, setCoordinates] = useState({ lat: 51.1657, lng: 10.4515 });
  const [roofPolygon, setRoofPolygon] = useState<google.maps.LatLngLiteral[]>([]);

  useEffect(() => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results?.[0]?.geometry?.location) {
        const location = results[0].geometry.location;
        const newCoords = { lat: location.lat(), lng: location.lng() };
        setCoordinates(newCoords);
        setRoofPolygon(getRoofPolygon(newCoords));
      }
    });
  }, [address]);

  return (
    <div className="w-full h-[300px] mb-6 rounded-lg overflow-hidden">
      <GoogleMap
        zoom={19}
        center={coordinates}
        mapContainerClassName="w-full h-full"
        options={{
          mapTypeId: "satellite",
          tilt: 0,
        }}
      >
        <Marker position={coordinates} />
        <Polygon
          paths={roofPolygon}
          options={{
            fillColor: "#2563eb",
            fillOpacity: 0.3,
            strokeColor: "#2563eb",
            strokeWeight: 2,
          }}
        />
      </GoogleMap>
    </div>
  );
};

export const RoofCheck = ({ address }: { address: string }) => {
  const [analyzing, setAnalyzing] = useState(true);
  const [estimate, setEstimate] = useState<SolarEstimate | null>(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const coords = { lat: 51.1657, lng: 10.4515 }; // Default coordinates
      const roofMeasurements = measureRoof(coords);
      
      setAnalyzing(false);
      setEstimate({
        monthlyProduction: 850,
        annualSavings: 2400,
        co2Reduction: 6.2,
        roofCoverage: 70,
        roofArea: roofMeasurements.totalArea,
        possiblePanels: roofMeasurements.possiblePanels,
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) return <div>Laden...</div>;

  if (analyzing) {
    return (
      <Card className="w-full max-w-2xl mx-auto p-6 bg-white animate-fade-up">
        <CardContent className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Vermesse Ihr Dach mit KI...
          </h3>
          <p className="text-gray-600">
            Unsere KI analysiert Ihr Dach für optimale Solarmodulplatzierung
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-500">
            <li>• KI-gestützte Dachmessung</li>
            <li>• Berechnung der nutzbaren Fläche</li>
            <li>• Optimale Modulplatzierung</li>
            <li>• Leistungsberechnung</li>
          </ul>
        </CardContent>
      </Card>
    );
  }

  if (!estimate) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-up">
      <Card className="bg-white">
        <CardContent className="p-6">
          <RoofAnalysis address={address} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="flex items-center space-x-4">
              <Sun className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500">Monatliche Produktion</p>
                <p className="text-xl font-bold">
                  {estimate.monthlyProduction} kWh
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Battery className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Jährliche Einsparungen</p>
                <p className="text-xl font-bold">{estimate.annualSavings}€</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Home className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Nutzbare Dachfläche</p>
                <p className="text-xl font-bold">{estimate.roofArea}m²</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Ruler className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Mögliche Module</p>
                <p className="text-xl font-bold">{estimate.possiblePanels} Stück</p>
              </div>
            </div>
          </div>

          <div className="h-[300px] mt-6">
            <h4 className="text-sm font-medium mb-4">
              Geschätzte monatliche Produktion (kWh)
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="production"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800">
              Mit {estimate.possiblePanels} Solarmodulen ({estimate.roofCoverage}% Ihrer Dachfläche) 
              können Sie Ihren CO2-Ausstoß um{" "}
              <span className="font-bold">{estimate.co2Reduction} Tonnen</span> pro
              Jahr reduzieren!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};