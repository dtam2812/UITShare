import React from 'react';
import { X } from 'lucide-react';
export default function ModalOverlay({
  children,
  isOpen,
  onClose
}) {
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
        {children}
      </div>
    </div>;
}