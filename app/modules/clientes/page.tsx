'use client';

import Modal from '@/app/components/Modal';
import ClienteForm from '@/app/components/ClienteForm';
import { apiFetch } from '@/app/lib/api-client';
import { Cliente } from '@/lib/supabase/types';
import { useEffect, useState } from 'react';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const editingCliente = editingId
    ? clientes.find((c) => c.id === editingId)
    : undefined;

  const filteredClientes = clientes.filter(cliente =>
    cliente.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: clientes.length,
    emails: clientes.filter(c => c.email).length,
  };

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
    <div className="flex-1 flex flex-col" style={{ backgroundColor: '#f4f5f7' }}>
      {/* Header */}
      <div className="px-8 py-6 border-b" style={{ borderColor: '#e5e7eb', backgroundColor: 'white' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
              Clientes
            </h1>
            <p className="text-sm mt-1" style={{ color: '#64748b' }}>
              Gestión de clientes y contactos
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors"
            style={{ backgroundColor: '#16a34a' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
          >
            <IconPlus size={18} />
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <KPICard label="Total de clientes" value={stats.total} color="#16a34a" />
          <KPICard label="Con email" value={stats.emails} color="#2563eb" />
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: '#fee2e2', borderColor: '#fecaca', color: '#dc2626' }}>
            {error}
          </div>
        )}

        {/* Table Card */}
        <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'white', borderColor: '#dfe5ed', boxShadow: '0 5px 18px rgba(15,23,42,0.055)' }}>
          {/* Toolbar */}
          <div className="px-6 py-4 border-b" style={{ borderColor: '#e5e7eb', backgroundColor: '#f8fafc' }}>
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border"
              style={{ borderColor: '#d1d5db', backgroundColor: 'white' }}
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-12 text-center" style={{ color: '#64748b' }}>
              Cargando clientes...
            </div>
          ) : filteredClientes.length === 0 ? (
            <div className="p-12 text-center" style={{ color: '#64748b' }}>
              No hay clientes para mostrar
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: '1080px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>
                      Teléfono
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>
                      Ciudad
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClientes.map((cliente) => (
                    <tr
                      key={cliente.id}
                      style={{ borderBottom: '1px solid #f0f0f0' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8faff'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: '#0f172a', whiteSpace: 'nowrap' }}>
                        {cliente.name}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#475569', whiteSpace: 'nowrap' }}>
                        {cliente.email || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#475569', whiteSpace: 'nowrap' }}>
                        {cliente.phone || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#475569', whiteSpace: 'nowrap' }}>
                        {cliente.city || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openEdit(cliente.id)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ backgroundColor: 'transparent', color: '#2563eb' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            title="Editar"
                          >
                            <IconEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(cliente.id)}
                            disabled={deleting === cliente.id}
                            className="p-2 rounded-lg transition-colors disabled:opacity-50"
                            style={{ backgroundColor: 'transparent', color: '#dc2626' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            title="Eliminar"
                          >
                            <IconTrash size={18} />
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
      </div>

      {/* Modal */}
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

function KPICard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="rounded-lg border p-4 overflow-hidden"
      style={{
        backgroundColor: 'white',
        borderColor: '#dfe5ed',
        boxShadow: '0 4px 14px rgba(15,23,42,0.045)',
        borderTop: `3px solid ${color}`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748b', letterSpacing: '0.35px' }}>
          {label}
        </div>
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: `color-mix(in srgb,${color} 11%,white)`,
            color: color,
          }}
        >
          <span style={{ fontSize: '14px' }}>👥</span>
        </div>
      </div>
      <div className="text-3xl font-bold" style={{ color: '#0f172a' }}>
        {value}
      </div>
    </div>
  );
}
