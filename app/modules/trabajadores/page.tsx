'use client';

import Modal from '@/app/components/Modal';
import TrabajadorForm from '@/app/components/TrabajadorForm';
import { apiFetch } from '@/app/lib/api-client';
import { Trabajador } from '@/lib/supabase/types';
import { useEffect, useState } from 'react';

export default function TrabajadoresPage() {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const editingTrabajador = editingId
    ? trabajadores.find((t) => t.id === editingId)
    : undefined;

  useEffect(() => {
    loadTrabajadores();
  }, []);

  async function loadTrabajadores() {
    try {
      setLoading(true);
      const data = await apiFetch<Trabajador[]>('/api/trabajadores');
      setTrabajadores(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading trabajadores');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(formData: Partial<Trabajador>) {
    try {
      if (editingId) {
        await apiFetch(`/api/trabajadores/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(formData),
        });
      } else {
        await apiFetch('/api/trabajadores', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      await loadTrabajadores();
      setModalOpen(false);
      setEditingId(null);
    } catch (err) {
      throw err;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este trabajador?')) return;

    try {
      setDeleting(id);
      await apiFetch(`/api/trabajadores/${id}`, { method: 'DELETE' });
      await loadTrabajadores();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando trabajador');
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
      on_leave: { bg: '#fef3c7', text: '#d97706' },
      terminated: { bg: '#fee2e2', text: '#dc2626' },
    };
    const color = colors[status] || colors.active;
    return color;
  };

  return (
    <div style={{ backgroundColor: 'var(--gray-50)' }} className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-6 sm:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>
            Trabajadores
          </h1>
          <button
            onClick={openCreate}
            className="btn-primary"
          >
            + Nuevo Trabajador
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
        ) : trabajadores.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--gray-600)' }}>No hay trabajadores. Crea uno nuevo para comenzar.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead style={{ backgroundColor: 'var(--gray-50)', borderColor: 'var(--gray-200)' }}>
                <tr style={{ borderBottomWidth: '1px', borderBottomColor: 'var(--gray-200)' }}>
                  <th className="table-header">Nombre</th>
                  <th className="table-header">Puesto</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Estado</th>
                  <th className="table-header">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {trabajadores.map((trabajador) => {
                  const statusColor = getStatusBadge(trabajador.status);
                  return (
                    <tr
                      key={trabajador.id}
                      style={{ borderBottomColor: 'var(--gray-100)' }}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="table-cell font-medium" style={{ color: 'var(--navy)' }}>
                        {trabajador.first_name} {trabajador.last_name}
                      </td>
                      <td className="table-cell" style={{ color: 'var(--gray-700)' }}>
                        {trabajador.role || '-'}
                      </td>
                      <td className="table-cell" style={{ color: 'var(--gray-700)' }}>
                        {trabajador.email || '-'}
                      </td>
                      <td className="table-cell">
                        <span
                          className="badge"
                          style={{
                            backgroundColor: statusColor.bg,
                            color: statusColor.text,
                          }}
                        >
                          {trabajador.status}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(trabajador.id)}
                            className="btn-ghost text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(trabajador.id)}
                            disabled={deleting === trabajador.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 text-sm font-medium"
                          >
                            {deleting === trabajador.id ? 'Eliminando...' : 'Eliminar'}
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
        title={editingId ? 'Editar Trabajador' : 'Nuevo Trabajador'}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
        }}
      >
        <TrabajadorForm
          initial={editingTrabajador}
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
