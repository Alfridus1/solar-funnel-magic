interface RoofGridProps {
  map: google.maps.Map | null;
  coordinates: { lat: number; lng: number };
}

export const RoofGrid = ({ map, coordinates }: RoofGridProps) => {
  if (!map) return null;

  // Erstelle ein Raster von 10x10 Punkten um die Koordinaten
  const gridSize = 10;
  const spacing = 0.0001; // Abstand zwischen den Punkten

  const markers: google.maps.Marker[] = [];

  for (let i = -gridSize/2; i < gridSize/2; i++) {
    for (let j = -gridSize/2; j < gridSize/2; j++) {
      const marker = new google.maps.Marker({
        position: {
          lat: coordinates.lat + (i * spacing),
          lng: coordinates.lng + (j * spacing)
        },
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 2,
          fillColor: "#2563eb",
          fillOpacity: 0.4,
          strokeColor: "#1e40af",
          strokeWeight: 1,
        }
      });
      markers.push(marker);
    }
  }

  return null;
};