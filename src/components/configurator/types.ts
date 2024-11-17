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
  created_at?: string;
  updated_at?: string;
}

export interface SystemConfig {
  modules: Product[];
  inverter: Product | null;
  battery: Product | null;
}