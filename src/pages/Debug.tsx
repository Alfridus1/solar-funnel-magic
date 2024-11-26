import { Card, CardContent } from "@/components/ui/card";
import { RoofCheck } from "@/components/RoofCheck";

export const Debug = () => {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Map View</h2>
          <RoofCheck />
        </CardContent>
      </Card>
    </div>
  );
};
