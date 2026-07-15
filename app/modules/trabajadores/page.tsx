'use client';

import Modal from '@/app/components/Modal';
import TrabajadorForm from '@/app/components/TrabajadorForm';
import { apiFetch } from '@/app/lib/api-client';
import { Trabajador } from '@/lib/supabase/types';
import { useEffect, useState } from 'react';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';

const statusConfig: Record<string, { color: string; label: string }> = {
  active: { color: '#16a34a', label: 'Activo' },
  on_leave: { color: '#d97706', label: 'Baja' },
  terminated: { color: '#dc2626', label: 'Despedido' },
};

export default function TrabajadoresPage() {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const editingTrabajador = editingId
    ? trabajadores.find((t) => t.id === editingId)
    : undefined;

  const filteredTrabajadores = trabajadores.filter(t =>
    `${t.first_name} ${t.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: trabajadores.length,
    active: trabajadores.filter(t => t.status === 'active').length,
    onLeave: trabajadores.filter(t => t.status === 'on_leave').length,
  };

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

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: '#f4f5f7' }}>
      {/* Header */}
      <div className="px-8 py-6 border-b" style={{ borderColor: '#e5e7eb', backgroundColor: 'white' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
              Trabajadores
            </h1>
            <p className="text-sm mt-1" style={{ color: '#64748b' }}>
              Gestión del equipo de trabajo
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors"
            style={{ backgroundColor: '#d97706' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b45309'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
          >
            <IconPlus size={18} />
            Nuevo Trabajador
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <KPICard label="Total" value={stats.total} color="#2563eb" />
          <KPICard label="Activos" value={stats.active} color="#16a34a" />
          <KPICard label="En baja" value={stats.onLeave} color="#d97706" />
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
              placeholder="Buscar trabajadores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border"
              style={{ borderColor: '#d1d5db', backgroundColor: 'white' }}
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-12 text-center" style={{ color: '#64748b' }}>
              Cargando trabajadores...
            </div>
          ) : filteredTrabajadores.length === 0 ? (
            <div className="p-12 text-center" style={{ color: '#64748b' }}>
              No hay trabajadores para mostrar
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: '1200px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>
                      Puesto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>
                      Departamento
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>
                      Estado
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrabajadores.map((trabajador) => {
                    const config = statusConfig[trabajador.status] || statusConfig.active;
                    return (
                      <tr
                        key={trabajador.id}
                        style={{ borderBottom: '1px solid #f0f0f0' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8faff'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td className="px-6 py-4 text-sm font-medium" style={{ color: '#0f172a', whiteSpace: 'nowrap' }}>
                          {trabajador.first_name} {trabajador.last_name}
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: '#475569', whiteSpace: 'nowrap' }}>
                          {trabajador.role || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: '#475569', whiteSpace: 'nowrap' }}>
                          {trabajador.email || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: '#475569', whiteSpace: 'nowrap' }}>
                          {trabajador.department || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: `color-mix(in srgb,${config.color} 15%,white)`,
                              color: config.color,
                            }}
                          >
                            {config.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => openEdit(trabajador.id)}
                              className="p-2 rounded-lg transition-colors"
                              style={{ backgroundColor: 'transparent', color: '#2563eb' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              title="Editar"
                            >
                              <IconEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(trabajador.id)}
                              disabled={deleting === trabajador.id}
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
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
          <span style={{ fontSize: '14px' }}>👤</span>
        </div>
      </div>
      <div className="text-3xl font-bold" style={{ color: '#0f172a' }}>
        {value}
      </div>
    </div>
  );
}
