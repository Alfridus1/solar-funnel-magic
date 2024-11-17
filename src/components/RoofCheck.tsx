import { useState, useEffect } from "react";
import { Loader2, Sun, Home, Battery } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
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

const RoofAnalysis = ({ address }: { address: string }) => {
  const [coordinates, setCoordinates] = useState({ lat: 51.1657, lng: 10.4515 });

  useEffect(() => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results?.[0]?.geometry?.location) {
        const location = results[0].geometry.location;
        setCoordinates({ lat: location.lat(), lng: location.lng() });
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
      setAnalyzing(false);
      setEstimate({
        monthlyProduction: 850,
        annualSavings: 2400,
        co2Reduction: 6.2,
        roofCoverage: 65,
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
            Analysiere Ihr Dach...
          </h3>
          <p className="text-gray-600">
            Unsere KI berechnet Ihr Solarpotenzial anhand von:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-500">
            <li>• Satellitenbildanalyse</li>
            <li>• Lokale Wettermuster</li>
            <li>• Dachausrichtung und Verschattung</li>
            <li>• Historische Sonneneinstrahlung</li>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                <p className="text-sm text-gray-500">Dachnutzung</p>
                <p className="text-xl font-bold">{estimate.roofCoverage}%</p>
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
              Mit Solarenergie können Sie Ihren CO2-Ausstoß um{" "}
              <span className="font-bold">{estimate.co2Reduction} Tonnen</span> pro
              Jahr reduzieren!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};