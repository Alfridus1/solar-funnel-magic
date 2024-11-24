import { useLoadScript } from "@react-google-maps/api";

// Define libraries once to ensure consistency across the application
export const libraries = ["places", "drawing", "geometry"] as const;

export const useGoogleMaps = () => {
  return useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });
};