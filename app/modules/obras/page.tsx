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
    if (!confirm('¿Estás seguro de que quieres eliminar esta obra?')) return;

    try {
      setDeleting(id);
      await apiFetch(`/api/obras/${id}`, { method: 'DELETE' });
      await loadObras();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting obra');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Obras</h1>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Nueva Obra
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando...</p>
          </div>
        ) : obras.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay obras. Crea una nueva para comenzar.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Inicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Presupuesto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {obras.map((obra) => (
                  <tr key={obra.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {obra.name}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          obra.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : obra.status === 'paused'
                            ? 'bg-yellow-100 text-yellow-800'
                            : obra.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {obra.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(obra.start_date).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {obra.budget ? `€${obra.budget.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => openEdit(obra.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(obra.id)}
                        disabled={deleting === obra.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleting === obra.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
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
