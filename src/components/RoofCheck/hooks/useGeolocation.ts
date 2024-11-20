import { useCallback } from "react";

interface UseGeolocationProps {
  onSuccess: (address: string) => void;
  onError: (error: string) => void;
  toast: any;
}

export const useGeolocation = ({ onSuccess, onError, toast }: UseGeolocationProps) => {
  const reverseGeocode = async (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({
        location: { lat, lng },
        region: 'DE'
      });

      if (!response.results.length) {
        throw new Error("Keine Adresse gefunden");
      }

      // Nehme das erste Ergebnis, das eine Straßenadresse ist
      const address = response.results[0];
      onSuccess(address.formatted_address);
    } catch (error) {
      console.error('Geocoding error:', error);
      onError("Die Adresse konnte nicht ermittelt werden.");
    }
  };

  const handleGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      onError("Ihr Browser unterstützt keine Standorterkennung.");
      return;
    }

    toast({
      title: "Standorterkennung",
      description: "Ihr Standort wird ermittelt...",
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await reverseGeocode(latitude, longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = "Ihr Standort konnte nicht ermittelt werden.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Bitte erlauben Sie den Zugriff auf Ihren Standort.";
        }
        onError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }, [onSuccess, onError, toast]);

  return { handleGeolocation };
};