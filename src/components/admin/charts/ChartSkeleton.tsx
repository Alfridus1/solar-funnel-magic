import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ChartSkeleton = () => {
  return (
    <Card className="p-6">
      <Skeleton className="h-[400px] w-full" />
    </Card>
  );
};