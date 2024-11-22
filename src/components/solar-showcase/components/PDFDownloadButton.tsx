import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PDFDownloadLink, PDFDownloadLinkProps } from "@react-pdf/renderer";
import { SolarOfferPDF } from "@/components/pdf/SolarOfferPDF";
import { ReactElement } from "react";

interface PDFDownloadButtonProps {
  metrics: any;
  address: string;
}

export const PDFDownloadButton = ({ metrics, address }: PDFDownloadButtonProps) => {
  return (
    <PDFDownloadLink
      document={<SolarOfferPDF metrics={metrics} address={address} />}
      fileName="solar-angebot.pdf"
    >
      {({ loading }) => (
        <Button
          className="bg-solar-orange hover:bg-solar-orange-dark"
          disabled={loading}
        >
          {loading ? (
            "Wird geladen..."
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Angebot als PDF
            </>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  );
};