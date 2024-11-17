export interface Product {
  id: string;
  name: string;
  category: 'module' | 'inverter' | 'battery';
  price: number;
  specs: {
    watts?: number;
    capacity?: number;
    power?: number;
    efficiency: number;
    warranty: number;
  };
}

export interface SystemConfig {
  modules: Product[];
  inverter: Product | null;
  battery: Product | null;
}