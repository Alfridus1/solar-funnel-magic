import { CheckCircle, Award, Heart } from "lucide-react";

export const TrustIndicators = () => {
  return (
    <div className="py-8 text-center">
      <div className="flex flex-wrap justify-center gap-8 text-gray-600">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-solar-orange" />
          <span>TÜV-zertifiziert</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-solar-orange" />
          <span>10 Jahre Garantie</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-solar-orange" />
          <span>100% Kundenzufriedenheit</span>
        </div>
      </div>
    </div>
  );
};