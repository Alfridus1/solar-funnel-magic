import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PremiumProductsListProps {
  products: Array<{
    title: string;
    description: string;
    image: string;
    features: string[];
  }>;
  onRequestConsultation: () => void;
}

export const PremiumProductsList = ({ products, onRequestConsultation }: PremiumProductsListProps) => (
  <div className="grid md:grid-cols-3 gap-8">
    {products.map((product, index) => (
      <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video bg-gradient-to-br from-solar-blue-50 to-white p-6">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">{product.title}</h3>
          <p className="text-gray-600">{product.description}</p>
          <ul className="space-y-2">
            {product.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-solar-orange" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button 
            className="w-full mt-4 bg-solar-orange hover:bg-solar-orange-dark"
            onClick={onRequestConsultation}
          >
            Beratung anfragen
          </Button>
        </div>
      </Card>
    ))}
  </div>
);