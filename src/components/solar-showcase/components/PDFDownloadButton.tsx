import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import { SolarOfferPDF } from "@/components/pdf/SolarOfferPDF";
import { ReactElement } from "react";

interface PDFDownloadButtonProps {
  metrics: any;
  address: string;
}

export const PDFDownloadButton = ({ metrics, address }: PDFDownloadButtonProps) => {
  return (
    <BlobProvider document={<SolarOfferPDF metrics={metrics} address={address} />}>
      {({ loading }): ReactElement => (
        <Button
          className="bg-solar-orange hover:bg-solar-orange-dark"
          disabled={loading}
        >
          {loading ? (
            "Wird geladen..."
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Einschätzung als PDF herunterladen
            </>
          )}
        </Button>
      )}
    </BlobProvider>
  );
};