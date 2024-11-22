import { Leaf } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    image_url: string;
    features: string[];
    climate_impact: string;
  };
  isActive: boolean;
}

export const ProductCard = ({ product, isActive }: ProductCardProps) => {
  return (
    <div className={cn(
      "transition-all duration-500 h-full",
      isActive ? "scale-[1.02] z-10" : "scale-95 opacity-70"
    )}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full bg-white/95 backdrop-blur">
        <div className="aspect-square bg-gradient-to-br from-solar-blue-50 to-white p-6 sm:p-8 relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-solar-orange/5 via-solar-blue-50/30 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 relative z-10"
          />
        </div>
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-solar-orange to-solar-orange-dark bg-clip-text text-transparent">
            {product.name}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{product.description}</p>
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-3 sm:p-4 rounded-xl">
            <p className="text-green-700 flex items-center gap-2 font-medium text-sm sm:text-base">
              <Leaf className="h-4 w-4 sm:h-5 sm:w-5" />
              {product.climate_impact}
            </p>
          </div>
          <ul className="space-y-2 sm:space-y-3">
            {product.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 sm:gap-3 group">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-solar-orange group-hover:scale-125 transition-transform" />
                <span className="text-sm sm:text-base text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
};