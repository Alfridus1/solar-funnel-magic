import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { calculateRoofArea, calculateSolarMetrics } from "@/utils/roofCalculations";
import { RoofCheckContent } from "./RoofCheck/RoofCheckContent";
import { RoofCheckLoading } from "./RoofCheck/RoofCheckLoading";
import { saveConfigToCookie } from "@/utils/configCookieManager";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { ProcessSteps } from "./RoofCheck/ProcessSteps";

export const RoofCheck = () => {
  const [paths, setPaths] = useState<google.maps.LatLng[][]>([]);
  const [metrics, setMetrics] = useState({
    monthlyProduction: 0,
    annualSavings: 0,
    roofArea: 0,
    possiblePanels: 0,
    kWp: 0,
    roofDetails: []
  });
  const navigate = useNavigate();
  const location = useLocation();
  const address = location.state?.address;
  const { isLoaded, loadError } = useGoogleMaps();

  useEffect(() => {
    if (!address) {
      navigate('/');
    }
  }, [address, navigate]);

  const handleRoofOutlineComplete = useCallback(
    (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number; kWp: number }[]) => {
      setPaths(paths);
      const totalArea = calculateRoofArea(paths);
      const calculatedMetrics = calculateSolarMetrics(totalArea);
      const updatedMetrics = {
        ...calculatedMetrics,
        roofArea: Math.round(totalArea * 100) / 100,
        roofDetails
      };
      setMetrics(updatedMetrics);
    },
    []
  );

  const handleFinish = useCallback(() => {
    saveConfigToCookie({
      metrics,
      address,
    });

    navigate("/solar-showcase", {
      state: {
        metrics,
        address,
      },
    });
  }, [metrics, address, navigate]);

  if (loadError) {
    return (
      <Card className="max-w-5xl mx-auto p-6">
        <div className="text-center text-red-600">
          Fehler beim Laden der Google Maps API. Bitte versuchen Sie es später erneut.
        </div>
      </Card>
    );
  }

  if (!isLoaded) {
    return <RoofCheckLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        <ProcessSteps currentStep={2} />
        <RoofCheckContent
          address={address}
          onRoofOutlineComplete={handleRoofOutlineComplete}
          onFinish={handleFinish}
          paths={paths}
          metrics={metrics}
        />
      </div>
    </div>
  );
};