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
    if (!confirm('¿Estás seguro de que quieres eliminar este trabajador?')) return;

    try {
      setDeleting(id);
      await apiFetch(`/api/trabajadores/${id}`, { method: 'DELETE' });
      await loadTrabajadores();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting trabajador');
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
          <h1 className="text-3xl font-bold text-gray-900">Trabajadores</h1>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Nuevo Trabajador
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
        ) : trabajadores.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No hay trabajadores. Crea uno nuevo para comenzar.
            </p>
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
                    Puesto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trabajadores.map((trabajador) => (
                  <tr key={trabajador.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {trabajador.first_name} {trabajador.last_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {trabajador.role || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {trabajador.email || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          trabajador.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : trabajador.status === 'on_leave'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {trabajador.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => openEdit(trabajador.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(trabajador.id)}
                        disabled={deleting === trabajador.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleting === trabajador.id
                          ? 'Eliminando...'
                          : 'Eliminar'}
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
