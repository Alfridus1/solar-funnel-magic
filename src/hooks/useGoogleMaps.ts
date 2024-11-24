import { useLoadScript, Libraries } from "@react-google-maps/api";

// Define libraries once to ensure consistency across the application
const libraries: Libraries = ["places", "drawing", "geometry"];

export const useGoogleMaps = () => {
  return useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });
};