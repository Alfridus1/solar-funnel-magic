import { Card } from "@/components/ui/card";
import { Users, Link, Euro } from "lucide-react";

interface ReferralStatsProps {
  affiliateData: any;
}

export const ReferralStats = ({ affiliateData }: ReferralStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">Registrierungen</p>
            <p className="text-2xl font-bold">{affiliateData?.referral_count || 0}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Anzahl der Registrierungen über Ihren Link
        </p>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-green-50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <Link className="h-8 w-8 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">Leads</p>
            <p className="text-2xl font-bold">{affiliateData?.total_leads || 0}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Generierte Leads über Ihre Empfehlungen
        </p>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <Euro className="h-8 w-8 text-yellow-600" />
          <div>
            <p className="text-sm text-gray-600">Provision</p>
            <p className="text-2xl font-bold">{affiliateData?.totalCommission?.toLocaleString('de-DE')} €</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Ihre gesamte verdiente Provision
        </p>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-purple-50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <Euro className="h-8 w-8 text-purple-600" />
          <div>
            <p className="text-sm text-gray-600">Verkäufe</p>
            <p className="text-2xl font-bold">{affiliateData?.purchaseCount || 0}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Erfolgreiche Verkäufe: {affiliateData?.totalPurchaseAmount?.toLocaleString('de-DE')} €
        </p>
      </Card>
    </div>
  );
};