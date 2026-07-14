export type User = {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'employee' | 'viewer';
  created_at: string;
  updated_at: string;
};

export type Obra = {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  start_date: string;
  end_date?: string;
  budget?: number;
  created_at: string;
  updated_at: string;
};

export type Cliente = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zip_code?: string;
  tax_id?: string;
  created_at: string;
  updated_at: string;
};

export type Trabajador = {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  role: string;
  department?: string;
  hire_date: string;
  status: 'active' | 'on_leave' | 'terminated';
  created_at: string;
  updated_at: string;
};

export type Factura = {
  id: string;
  number: string;
  type: 'venta' | 'compra';
  cliente_id?: string;
  total: number;
  tax: number;
  status: 'draft' | 'issued' | 'paid' | 'cancelled';
  issue_date: string;
  due_date: string;
  created_at: string;
  updated_at: string;
};
