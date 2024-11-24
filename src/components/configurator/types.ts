export interface Product {
  id: string;
  name: string;
  category: 'module' | 'inverter' | 'battery';
  price: number;
  specs: {
    watts?: number;
    capacity?: number;
    power?: number;
    efficiency?: number;
    warranty?: number;
  };
  image_url?: string;
  datasheet_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SystemConfig {
  modules: Product[];
  inverter: Product | null;
  battery: Product | null;
}