'use client';

import Modal from '@/app/components/Modal';
import ObraForm from '@/app/components/ObraForm';
import { KanbanBoard } from '@/app/components/KanbanBoard';
import { apiFetch } from '@/app/lib/api-client';
import { Obra } from '@/lib/supabase/types';
import { useEffect, useState } from 'react';
import { IconPlus, IconEdit, IconTrash, IconLayoutKanban, IconTable } from '@tabler/icons-react';

const statusConfig: Record<string, { color: string; label: string }> = {
  active: { color: '#2563eb', label: 'Activa' },
  paused: { color: '#d97706', label: 'Pausada' },
  completed: { color: '#16a34a', label: 'Completada' },
  cancelled: { color: '#dc2626', label: 'Cancelada' },
};

export default function ObrasPage() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  const editingObra = editingId ? obras.find((o) => o.id === editingId) : undefined;

  const filteredObras = obras.filter(obra =>
    obra.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obra.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: obras.length,
    active: obras.filter(o => o.status === 'active').length,
    completed: obras.filter(o => o.status === 'completed').length,
  };

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

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: '#f4f5f7' }}>
      {/* Header */}
      <div className="px-8 py-6 border-b" style={{ borderColor: '#e5e7eb', backgroundColor: 'white' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
              Obras
            </h1>
            <p className="text-sm mt-1" style={{ color: '#64748b' }}>
              Gestión de proyectos y obras de construcción
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors"
            style={{ backgroundColor: '#2563eb' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            <IconPlus size={18} />
            Nueva Obra
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <KPICard label="Total de obras" value={stats.total} color="#2563eb" />
          <KPICard label="Activas" value={stats.active} color="#16a34a" />
          <KPICard label="Completadas" value={stats.completed} color="#059669" />
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: '#fee2e2', borderColor: '#fecaca', color: '#dc2626' }}>
            {error}
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode('table')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: viewMode === 'table' ? '#2563eb' : '#e5e7eb',
              color: viewMode === 'table' ? 'white' : '#64748b',
            }}
          >
            <IconTable size={16} />
            Tabla
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: viewMode === 'kanban' ? '#2563eb' : '#e5e7eb',
              color: viewMode === 'kanban' ? 'white' : '#64748b',
            }}
          >
            <IconLayoutKanban size={16} />
            Kanban
          </button>
        </div>

        {/* Kanban View */}
        {viewMode === 'kanban' && !loading && (
          <div className="mb-8">
            <KanbanBoard obras={obras} onUpdate={loadObras} />
          </div>
        )}

        {/* Table Card */}
        {viewMode === 'table' && (
        <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'white', borderColor: '#dfe5ed', boxShadow: '0 5px 18px rgba(15,23,42,0.055)' }}>
          {/* Toolbar */}
          <div className="px-6 py-4 border-b" style={{ borderColor: '#e5e7eb', backgroundColor: '#f8fafc' }}>
            <input
              type="text"
              placeholder="Buscar obras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border"
              style={{ borderColor: '#d1d5db', backgroundColor: 'white' }}
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-12 text-center" style={{ color: '#64748b' }}>
              Cargando obras...
            </div>
          ) : filteredObras.length === 0 ? (
            <div className="p-12 text-center" style={{ color: '#64748b' }}>
              No hay obras para mostrar
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: '1080px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ color: '#6b7280' }}>
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>
                      Fecha Inicio
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>
                      Presupuesto
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredObras.map((obra) => {
                    const config = statusConfig[obra.status] || statusConfig.paused;
                    return (
                      <tr
                        key={obra.id}
                        style={{ borderBottom: '1px solid #f0f0f0' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8faff'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td className="px-6 py-4 text-sm font-medium" style={{ color: '#0f172a', whiteSpace: 'nowrap' }}>
                          {obra.name}
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
                        <td className="px-6 py-4 text-sm" style={{ color: '#475569', whiteSpace: 'nowrap' }}>
                          {obra.start_date ? new Date(obra.start_date).toLocaleDateString('es-ES') : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm font-mono" style={{ color: '#0f172a', whiteSpace: 'nowrap' }}>
                          {obra.budget ? `€${obra.budget.toLocaleString('es-ES', { minimumFractionDigits: 2 })}` : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => openEdit(obra.id)}
                              className="p-2 rounded-lg transition-colors"
                              style={{ backgroundColor: 'transparent', color: '#2563eb' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              title="Editar"
                            >
                              <IconEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(obra.id)}
                              disabled={deleting === obra.id}
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
        )}
      </div>

      {/* Modal */}
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
          <span style={{ fontSize: '14px' }}>📊</span>
        </div>
      </div>
      <div className="text-3xl font-bold" style={{ color: '#0f172a' }}>
        {value}
      </div>
    </div>
  );
}
