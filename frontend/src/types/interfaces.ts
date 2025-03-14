export interface Bar {
  id: number;
  name: string;
  adresse: string;
  tel?: string;
  email: string;
  description?: string;
}

export interface Beer {
  id: number;
  name: string;
  degree: number;
  prix: number;
  description?: string;
  id_bar: number;
}

export interface Order {
  id: number;
  date: string;
  status: string;
  prix_total: number;
  id_bar: number;
  name?: string;
}

