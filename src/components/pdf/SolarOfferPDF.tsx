import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    marginBottom: 20,
  },
  logo: {
    width: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#666",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  mapImage: {
    width: "100%",
    height: 300,
    marginVertical: 15,
    objectFit: "contain",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    color: "#666",
    fontSize: 10,
  },
});

interface SolarOfferPDFProps {
  metrics: {
    roofArea: number;
    kWp: number;
    monthlyProduction: number;
    annualSavings: number;
    possiblePanels: number;
  };
  mapImageUrl?: string;
  address: string;
}

export const SolarOfferPDF = ({ metrics, mapImageUrl, address }: SolarOfferPDFProps) => {
  // Add default values to handle undefined metrics
  const safeMetrics = {
    roofArea: metrics?.roofArea || 0,
    kWp: metrics?.kWp || 0,
    monthlyProduction: metrics?.monthlyProduction || 0,
    annualSavings: metrics?.annualSavings || 0,
    possiblePanels: metrics?.possiblePanels || 0
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image 
            src="/lovable-uploads/230bf2e3-b64a-4f51-bb2f-f246df2597be.png"
            style={styles.logo}
          />
          <Text style={styles.title}>Ihr Solar-Angebot</Text>
          <Text style={styles.subtitle}>Standort: {address}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ihre Dachanalyse</Text>
          <Text style={styles.text}>Nutzbare Dachfläche: {safeMetrics.roofArea.toFixed(2)} m²</Text>
          <Text style={styles.text}>Mögliche Anlagengröße: {safeMetrics.kWp.toFixed(2)} kWp</Text>
          <Text style={styles.text}>Mögliche Module: {safeMetrics.possiblePanels} Stück</Text>
        </View>

        {mapImageUrl && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ihre Dachvermessung</Text>
            <Image src={mapImageUrl} style={styles.mapImage} />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Energieertrag und Einsparungen</Text>
          <Text style={styles.text}>
            Monatliche Produktion: {safeMetrics.monthlyProduction.toFixed(2)} kWh
          </Text>
          <Text style={styles.text}>
            Jährliche Einsparungen: {safeMetrics.annualSavings.toFixed(2)} €
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>
            Dies ist ein unverbindliches Angebot basierend auf der automatischen Dachanalyse.
            Für ein detailliertes Angebot kontaktieren Sie uns bitte.
          </Text>
        </View>
      </Page>
    </Document>
  );
};