'use client';

import { Trabajador } from '@/lib/supabase/types';
import { FormEvent, useState } from 'react';

export interface TrabajadorFormProps {
  initial?: Trabajador;
  onSubmit: (data: Partial<Trabajador>) => Promise<void>;
  onCancel: () => void;
}

export default function TrabajadorForm({
  initial,
  onSubmit,
  onCancel,
}: TrabajadorFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: initial?.first_name || '',
    last_name: initial?.last_name || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    role: initial?.role || '',
    department: initial?.department || '',
    hire_date: initial?.hire_date || new Date().toISOString().split('T')[0],
    status: initial?.status || 'active',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error guardando trabajador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold" style={{ color: 'var(--gray-900)' }}>
            Nombre *
          </label>
          <input
            type="text"
            required
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            className="input-field mt-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold" style={{ color: 'var(--gray-900)' }}>
            Apellido *
          </label>
          <input
            type="text"
            required
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
            className="input-field mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold" style={{ color: 'var(--gray-900)' }}>
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input-field mt-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold" style={{ color: 'var(--gray-900)' }}>
            Teléfono
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="input-field mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold" style={{ color: 'var(--gray-900)' }}>
            Puesto
          </label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="input-field mt-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold" style={{ color: 'var(--gray-900)' }}>
            Departamento
          </label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            className="input-field mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold" style={{ color: 'var(--gray-900)' }}>
            Fecha de contratación *
          </label>
          <input
            type="date"
            required
            value={formData.hire_date}
            onChange={(e) =>
              setFormData({ ...formData, hire_date: e.target.value })
            }
            className="input-field mt-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold" style={{ color: 'var(--gray-900)' }}>
            Estado
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as any })
            }
            className="input-field mt-2"
          >
            <option value="active">Activo</option>
            <option value="on_leave">Baja</option>
            <option value="terminated">Despedido</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? 'Guardando...' : initial ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}
