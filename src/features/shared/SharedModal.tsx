// src/features/shared/SharedModal.tsx

import React from "react";

interface SharedModalProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SharedModal({ taskId, isOpen, onClose }: SharedModalProps) {
  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/task-public/${taskId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copiado para a área de transferência!");
    } catch {
      alert("Não foi possível copiar o link.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Conteúdo do Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-lg shadow-lg p-6 z-10">
        <h2 className="text-lg font-semibold mb-4">Compartilhar Tarefa</h2>

        <p className="text-sm text-gray-700 mb-4">
          Copie o link abaixo para compartilhar:
        </p>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 border border-gray-300 rounded-l px-3 py-2 text-xs"
          />
          <button
            onClick={copyToClipboard}
            className="bg-blue-600 text-white px-3 py-2 rounded-r text-xs hover:bg-blue-700"
          >
            Copiar
          </button>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:underline"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
