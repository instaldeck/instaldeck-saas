import { Obra, Cliente, Trabajador } from '@/lib/supabase/types';

const mockObras: Obra[] = [
  {
    id: '1',
    name: 'Reforma Cocina ABC',
    description: 'Reforma integral cocina apartamento 3B',
    status: 'active',
    start_date: '2026-01-15',
    end_date: '2026-03-15',
    budget: 5000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockClientes: Cliente[] = [
  {
    id: '1',
    name: 'Juan García López',
    email: 'juan@example.com',
    phone: '+34 600 123 456',
    address: 'Calle Principal 123',
    city: 'Madrid',
    zip_code: '28001',
    tax_id: '12345678A',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockTrabajadores: Trabajador[] = [
  {
    id: '1',
    first_name: 'Carlos',
    last_name: 'Rodríguez',
    email: 'carlos@company.com',
    phone: '+34 666 999 111',
    role: 'Jefe de Obra',
    department: 'Construcción',
    hire_date: '2024-01-10',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export { mockObras, mockClientes, mockTrabajadores };
