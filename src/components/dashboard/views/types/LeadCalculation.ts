export interface LeadCalculation {
  id: string;
  created_at: string;
  metrics: {
    kWp: number;
    annualSavings: number;
    estimatedPrice: number;
    roofArea?: number;
  } | null;
  address: string | null;
}