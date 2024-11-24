import { useCallback } from "react";
import { useLoadScript } from "@react-google-maps/api";

interface UseGeolocationProps {
  onSuccess: (address: string) => void;
  onError: (error: string) => void;
  toast: any;
}

export const useGeolocation = ({ onSuccess, onError, toast }: UseGeolocationProps) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const reverseGeocode = async (lat: number, lng: number) => {
    if (!isLoaded) {
      onError("Google Maps API wird geladen...");
      return;
    }

    if (loadError) {
      onError("Fehler beim Laden der Google Maps API");
      return;
    }

    const geocoder = new google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({
        location: { lat, lng },
        language: 'de',
        region: 'DE'
      });

      if (!response.results.length) {
        throw new Error("Keine Adresse gefunden");
      }

      // Suche nach der genauesten Adresse
      const address = response.results.find(result => 
        result.types.includes('street_address') ||
        result.types.includes('premise')
      ) || response.results[0];

      onSuccess(address.formatted_address);
    } catch (error) {
      console.error('Geocoding error:', error);
      onError("Die Adresse konnte nicht ermittelt werden.");
    }
  };

  const handleGeolocation = useCallback(() => {
    if (!isLoaded) {
      onError("Google Maps API wird geladen...");
      return;
    }

    if (loadError) {
      onError("Fehler beim Laden der Google Maps API");
      return;
    }

    if (!navigator.geolocation) {
      onError("Ihr Browser unterstützt keine Standorterkennung.");
      return;
    }

    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'denied') {
        onError("Bitte erlauben Sie den Zugriff auf Ihren Standort in Ihren Browsereinstellungen.");
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
    });
  }, [isLoaded, loadError, onSuccess, onError, toast]);

  return { handleGeolocation, isLoaded, loadError };
};