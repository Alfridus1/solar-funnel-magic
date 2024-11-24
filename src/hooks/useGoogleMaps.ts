import { useLoadScript } from "@react-google-maps/api";

// Define libraries once to ensure consistency
export const libraries: ("places" | "drawing" | "geometry")[] = ["places", "drawing", "geometry"];

export const useGoogleMaps = () => {
  return useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });
};