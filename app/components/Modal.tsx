'use client';

import { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ isOpen, title, children, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4" style={{ maxHeight: '90vh', overflow: 'auto' }}>
        <div
          className="flex justify-between items-center px-8 py-6 border-b"
          style={{ borderColor: 'var(--gray-200)' }}
        >
          <h2 className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none font-light"
          >
            ×
          </button>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
