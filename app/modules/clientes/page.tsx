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
    if (!confirm('¿Eliminar este cliente?')) return;

    try {
      setDeleting(id);
      await apiFetch(`/api/clientes/${id}`, { method: 'DELETE' });
      await loadClientes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando cliente');
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
    <div style={{ backgroundColor: 'var(--gray-50)' }} className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-6 sm:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>
            Clientes
          </h1>
          <button
            onClick={openCreate}
            className="btn-primary"
          >
            + Nuevo Cliente
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
        ) : clientes.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--gray-600)' }}>No hay clientes. Crea uno nuevo para comenzar.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead style={{ backgroundColor: 'var(--gray-50)', borderColor: 'var(--gray-200)' }}>
                <tr style={{ borderBottomWidth: '1px', borderBottomColor: 'var(--gray-200)' }}>
                  <th className="table-header">Nombre</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Teléfono</th>
                  <th className="table-header">Ciudad</th>
                  <th className="table-header">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr
                    key={cliente.id}
                    style={{ borderBottomColor: 'var(--gray-100)' }}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="table-cell font-medium" style={{ color: 'var(--navy)' }}>
                      {cliente.name}
                    </td>
                    <td className="table-cell" style={{ color: 'var(--gray-700)' }}>
                      {cliente.email || '-'}
                    </td>
                    <td className="table-cell" style={{ color: 'var(--gray-700)' }}>
                      {cliente.phone || '-'}
                    </td>
                    <td className="table-cell" style={{ color: 'var(--gray-700)' }}>
                      {cliente.city || '-'}
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(cliente.id)}
                          className="btn-ghost text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(cliente.id)}
                          disabled={deleting === cliente.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 text-sm font-medium"
                        >
                          {deleting === cliente.id ? 'Eliminando...' : 'Eliminar'}
                        </button>
                      </div>
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
