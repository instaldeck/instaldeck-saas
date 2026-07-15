'use client';

import Modal from '@/app/components/Modal';
import ObraForm from '@/app/components/ObraForm';
import { apiFetch } from '@/app/lib/api-client';
import { Obra } from '@/lib/supabase/types';
import { useEffect, useState } from 'react';

export default function ObrasPage() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const editingObra = editingId ? obras.find((o) => o.id === editingId) : undefined;

  useEffect(() => {
    loadObras();
  }, []);

  async function loadObras() {
    try {
      setLoading(true);
      const data = await apiFetch<Obra[]>('/api/obras');
      setObras(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading obras');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(formData: Partial<Obra>) {
    try {
      if (editingId) {
        await apiFetch(`/api/obras/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(formData),
        });
      } else {
        await apiFetch('/api/obras', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      await loadObras();
      setModalOpen(false);
      setEditingId(null);
    } catch (err) {
      throw err;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta obra?')) return;

    try {
      setDeleting(id);
      await apiFetch(`/api/obras/${id}`, { method: 'DELETE' });
      await loadObras();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando obra');
    } finally {
      setDeleting(null);
    }
  }

  function openCreate() {
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(id: string) {
    setEditingId(id);
    setModalOpen(true);
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      active: { bg: 'var(--sky-blue)', text: 'var(--royal-blue)' },
      paused: { bg: '#fef3c7', text: '#d97706' },
      completed: { bg: '#d1fae5', text: '#059669' },
      cancelled: { bg: '#fee2e2', text: '#dc2626' },
    };
    const color = colors[status] || colors.paused;
    return color;
  };

  return (
    <div style={{ backgroundColor: 'var(--gray-50)' }} className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-6 sm:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>
            Obras
          </h1>
          <button
            onClick={openCreate}
            className="btn-primary"
          >
            + Nueva Obra
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--gray-600)' }}>Cargando...</p>
          </div>
        ) : obras.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--gray-600)' }}>No hay obras. Crea una nueva para comenzar.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead style={{ backgroundColor: 'var(--gray-50)', borderColor: 'var(--gray-200)' }}>
                <tr style={{ borderBottomWidth: '1px', borderBottomColor: 'var(--gray-200)' }}>
                  <th className="table-header">Nombre</th>
                  <th className="table-header">Estado</th>
                  <th className="table-header">Inicio</th>
                  <th className="table-header">Presupuesto</th>
                  <th className="table-header">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {obras.map((obra) => {
                  const statusColor = getStatusBadge(obra.status);
                  return (
                    <tr
                      key={obra.id}
                      style={{ borderBottomColor: 'var(--gray-100)' }}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="table-cell font-medium" style={{ color: 'var(--navy)' }}>
                        {obra.name}
                      </td>
                      <td className="table-cell">
                        <span
                          className="badge"
                          style={{
                            backgroundColor: statusColor.bg,
                            color: statusColor.text,
                          }}
                        >
                          {obra.status}
                        </span>
                      </td>
                      <td className="table-cell" style={{ color: 'var(--gray-700)' }}>
                        {new Date(obra.start_date).toLocaleDateString('es-ES')}
                      </td>
                      <td className="table-cell" style={{ color: 'var(--gray-700)' }}>
                        {obra.budget ? `€${obra.budget.toFixed(2)}` : '-'}
                      </td>
                      <td className="table-cell">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(obra.id)}
                            className="btn-ghost text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(obra.id)}
                            disabled={deleting === obra.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 text-sm font-medium"
                          >
                            {deleting === obra.id ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        title={editingId ? 'Editar Obra' : 'Nueva Obra'}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
        }}
      >
        <ObraForm
          initial={editingObra}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditingId(null);
          }}
        />
      </Modal>
    </div>
  );
}
