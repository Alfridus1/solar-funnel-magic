export interface LeadCalculation {
  id: string;
  created_at: string;
  address: string | null;
  metrics: {
    kWp: number;
    annualSavings: number;
    estimatedPrice: number;
    roofArea: number;
  } | null;
  deleted_at?: string | null;
}