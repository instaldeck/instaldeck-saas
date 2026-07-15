'use client';

import { Cliente } from '@/lib/supabase/types';
import { FormEvent, useState } from 'react';

export interface ClienteFormProps {
  initial?: Cliente;
  onSubmit: (data: Partial<Cliente>) => Promise<void>;
  onCancel: () => void;
}

export default function ClienteForm({ initial, onSubmit, onCancel }: ClienteFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: initial?.name || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    address: initial?.address || '',
    city: initial?.city || '',
    zip_code: initial?.zip_code || '',
    tax_id: initial?.tax_id || '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error guardando cliente');
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

      <div>
        <label className="block text-sm font-semibold" style={{ color: 'var(--gray-900)' }}>
          Nombre *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input-field mt-2"
        />
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

      <div>
        <label className="block text-sm font-semibold" style={{ color: 'var(--gray-900)' }}>
          Dirección
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="input-field mt-2"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold" style={{ color: 'var(--gray-900)' }}>
            Ciudad
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="input-field mt-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold" style={{ color: 'var(--gray-900)' }}>
            Código postal
          </label>
          <input
            type="text"
            value={formData.zip_code}
            onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
            className="input-field mt-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold" style={{ color: 'var(--gray-900)' }}>
            NIF/CIF
          </label>
          <input
            type="text"
            value={formData.tax_id}
            onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
            className="input-field mt-2"
          />
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
