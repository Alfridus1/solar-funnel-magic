export interface PremiumProduct {
  id: string;
  name: string;
  description: string;
  image_url: string;
  features: string[];
  climate_impact: string;
  purchase_options: {
    price: number;
    financing: {
      available: boolean;
      min_rate: number;
      max_term: number;
    };
  };
}

export interface PremiumProductFormFields {
  name: string;
  description: string;
  image_url: string;
  climate_impact: string;
  features: string;
  price: number;
  financing_available: boolean;
  financing_min_rate: number;
  financing_max_term: number;
}