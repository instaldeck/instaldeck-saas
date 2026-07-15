'use client';

import { Obra } from '@/lib/supabase/types';
import { FormEvent, useState } from 'react';

export interface ObraFormProps {
  initial?: Obra;
  onSubmit: (data: Partial<Obra>) => Promise<void>;
  onCancel: () => void;
}

export default function ObraForm({ initial, onSubmit, onCancel }: ObraFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    status: initial?.status || 'active',
    start_date: initial?.start_date || new Date().toISOString().split('T')[0],
    end_date: initial?.end_date || '',
    budget: initial?.budget || '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget as any) : null,
      };
      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error guardando obra');
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

      <div>
        <label className="block text-sm font-semibold" style={{ color: 'var(--gray-900)' }}>
          Descripción
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="input-field mt-2"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold" style={{ color: 'var(--gray-900)' }}>
            Fecha de inicio *
          </label>
          <input
            type="date"
            required
            value={formData.start_date}
            onChange={(e) =>
              setFormData({ ...formData, start_date: e.target.value })
            }
            className="input-field mt-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold" style={{ color: 'var(--gray-900)' }}>
            Fecha de fin
          </label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) =>
              setFormData({ ...formData, end_date: e.target.value })
            }
            className="input-field mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
            <option value="paused">Pausado</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold" style={{ color: 'var(--gray-900)' }}>
            Presupuesto
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.budget}
            onChange={(e) =>
              setFormData({ ...formData, budget: e.target.value })
            }
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
