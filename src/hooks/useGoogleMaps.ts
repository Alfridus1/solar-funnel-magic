import { useLoadScript, Libraries } from "@react-google-maps/api";

// Define libraries as a constant array to ensure it's only created once
const libraries: Libraries = ["places", "drawing", "geometry"];

// Create a memoized loader instance
export const useGoogleMaps = () => {
  return useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });
};