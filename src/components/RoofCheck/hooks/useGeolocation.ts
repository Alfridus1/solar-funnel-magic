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
      // Erste Geocoding-Anfrage mit deutschen Parametern
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
      );

      if (address) {
        // Extrahiere die relevanten Adresskomponenten
        const streetNumber = address.address_components.find(c => 
          c.types.includes('street_number')
        )?.long_name || '';

        const street = address.address_components.find(c => 
          c.types.includes('route')
        )?.long_name || '';

        const city = address.address_components.find(c => 
          c.types.includes('locality')
        )?.long_name || '';

        const postalCode = address.address_components.find(c => 
          c.types.includes('postal_code')
        )?.long_name || '';

        // Formatiere die Adresse im deutschen Format
        const formattedAddress = `${street} ${streetNumber}, ${postalCode} ${city}`;
        onSuccess(formattedAddress);
      } else {
        onSuccess(response.results[0].formatted_address);
      }
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