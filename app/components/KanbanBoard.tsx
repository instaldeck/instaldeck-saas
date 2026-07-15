'use client';

import { Obra } from '@/lib/supabase/types';
import { useMemo, useState } from 'react';
import { apiFetch } from '@/app/lib/api-client';

const STATUS_CONFIG = {
  active: { label: 'Activas', color: '#2563eb', bg: '#eff6ff' },
  paused: { label: 'Pausadas', color: '#d97706', bg: '#fffbeb' },
  completed: { label: 'Completadas', color: '#16a34a', bg: '#f0fdf4' },
  cancelled: { label: 'Canceladas', color: '#dc2626', bg: '#fef2f2' },
};

export function KanbanBoard({
  obras: initialObras,
  onUpdate,
}: {
  obras: Obra[];
  onUpdate: () => void;
}) {
  const [obras, setObras] = useState(initialObras);
  const [draggedObra, setDraggedObra] = useState<Obra | null>(null);

  const columns = useMemo(() => {
    return {
      active: obras.filter((o) => o.status === 'active'),
      paused: obras.filter((o) => o.status === 'paused'),
      completed: obras.filter((o) => o.status === 'completed'),
      cancelled: obras.filter((o) => o.status === 'cancelled'),
    };
  }, [obras]);

  const handleDragStart = (obra: Obra) => {
    setDraggedObra(obra);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (status: string) => {
    if (!draggedObra || draggedObra.status === status) {
      setDraggedObra(null);
      return;
    }

    try {
      await apiFetch(`/api/obras/${draggedObra.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });

      setObras(
        obras.map((o) =>
          o.id === draggedObra.id ? { ...o, status: status as any } : o
        )
      );
      onUpdate();
    } catch (err) {
      console.error('Error updating obra:', err);
    } finally {
      setDraggedObra(null);
    }
  };

  const renderColumn = (
    status: string,
    config: (typeof STATUS_CONFIG)[keyof typeof STATUS_CONFIG],
    obraList: Obra[]
  ) => (
    <div
      key={status}
      className="flex-1 min-w-72 rounded-lg border p-4 flex flex-col"
      style={{
        backgroundColor: config.bg,
        borderColor: config.color,
        borderWidth: '2px',
        minHeight: '600px',
      }}
      onDragOver={handleDragOver}
      onDrop={() => handleDrop(status)}
    >
      {/* Header */}
      <div className="mb-4 pb-3 border-b" style={{ borderColor: config.color }}>
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          <h3 className="font-bold text-sm" style={{ color: config.color }}>
            {config.label}
          </h3>
        </div>
        <p className="text-xs" style={{ color: config.color, opacity: 0.7 }}>
          {obraList.length} obra{obraList.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {obraList.map((obra) => (
          <div
            key={obra.id}
            draggable
            onDragStart={() => handleDragStart(obra)}
            className="rounded-lg border p-3 bg-white cursor-move transition-all hover:shadow-md active:opacity-50"
            style={{
              borderColor: config.color,
              borderLeftWidth: '4px',
            }}
          >
            <h4 className="font-semibold text-sm mb-2" style={{ color: '#0f172a' }}>
              {obra.name}
            </h4>
            {obra.budget && (
              <div className="text-xs mb-2" style={{ color: '#64748b' }}>
                <span className="font-mono" style={{ color: config.color }}>
                  €{obra.budget.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
            {obra.start_date && (
              <div className="text-xs" style={{ color: '#94a3b8' }}>
                {new Date(obra.start_date).toLocaleDateString('es-ES')}
              </div>
            )}
          </div>
        ))}
        {obraList.length === 0 && (
          <div
            className="text-center py-8 text-xs"
            style={{ color: config.color, opacity: 0.5 }}
          >
            Arrastra obras aquí
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
      {renderColumn('active', STATUS_CONFIG.active, columns.active)}
      {renderColumn('paused', STATUS_CONFIG.paused, columns.paused)}
      {renderColumn('completed', STATUS_CONFIG.completed, columns.completed)}
      {renderColumn('cancelled', STATUS_CONFIG.cancelled, columns.cancelled)}
    </div>
  );
}
