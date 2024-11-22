import { Award, Users, CheckCircle } from "lucide-react";

export const Stats = () => {
  return (
    <div className="py-16 bg-white/80 backdrop-blur rounded-2xl my-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-2">
          <Award className="h-12 w-12 text-solar-orange mb-2" />
          <h3 className="text-4xl font-bold text-gray-900">1.000+</h3>
          <p className="text-gray-600">Zufriedene Kunden</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-2">
          <Users className="h-12 w-12 text-solar-orange mb-2" />
          <h3 className="text-4xl font-bold text-gray-900">130+</h3>
          <p className="text-gray-600">Experten im Team</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-2">
          <CheckCircle className="h-12 w-12 text-solar-orange mb-2" />
          <h3 className="text-4xl font-bold text-gray-900">98%</h3>
          <p className="text-gray-600">Weiterempfehlungsrate</p>
        </div>
      </div>
    </div>
  );
};