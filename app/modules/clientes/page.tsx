'use client';

import Modal from '@/app/components/Modal';
import ClienteForm from '@/app/components/ClienteForm';
import { apiFetch } from '@/app/lib/api-client';
import { Cliente } from '@/lib/supabase/types';
import { useEffect, useState } from 'react';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const editingCliente = editingId
    ? clientes.find((c) => c.id === editingId)
    : undefined;

  useEffect(() => {
    loadClientes();
  }, []);

  async function loadClientes() {
    try {
      setLoading(true);
      const data = await apiFetch<Cliente[]>('/api/clientes');
      setClientes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading clientes');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(formData: Partial<Cliente>) {
    try {
      if (editingId) {
        await apiFetch(`/api/clientes/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(formData),
        });
      } else {
        await apiFetch('/api/clientes', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      await loadClientes();
      setModalOpen(false);
      setEditingId(null);
    } catch (err) {
      throw err;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de que quieres eliminar este cliente?')) return;

    try {
      setDeleting(id);
      await apiFetch(`/api/clientes/${id}`, { method: 'DELETE' });
      await loadClientes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting cliente');
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
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Nuevo Cliente
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
        ) : clientes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No hay clientes. Crea uno nuevo para comenzar.
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
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Ciudad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {cliente.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {cliente.email || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {cliente.phone || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {cliente.city || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => openEdit(cliente.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(cliente.id)}
                        disabled={deleting === cliente.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleting === cliente.id ? 'Eliminando...' : 'Eliminar'}
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
        title={editingId ? 'Editar Cliente' : 'Nuevo Cliente'}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
        }}
      >
        <ClienteForm
          initial={editingCliente}
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
