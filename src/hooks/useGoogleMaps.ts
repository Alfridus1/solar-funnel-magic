import { useLoadScript } from "@react-google-maps/api";

const libraries: ("places" | "drawing" | "geometry")[] = ["places", "drawing", "geometry"];

export const useGoogleMaps = () => {
  return useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });
};