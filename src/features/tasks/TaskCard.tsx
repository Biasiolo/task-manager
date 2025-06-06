// src/features/tasks/TaskCard.tsx

import React from "react";
import { Task } from "./useTasks";
import { Edit2, Share2, User } from "lucide-react";
import clsx from "clsx";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onShare: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onShare, onDelete }: TaskCardProps) {
  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const isOverdue =
    dueDate !== null && dueDate < new Date() && task.status === "Pendente";

  // simplesmente exibe o valor de `task.name`
  const responsibleName = task.name ?? "Não atribuído";

  return (
    <div
      className={clsx(
        "bg-white p-4 rounded-lg shadow-md flex flex-col justify-between",
        isOverdue && "border border-red-500"
      )}
    >
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <span
            className={clsx(
              "text-xs rounded-full px-2 py-1",
              task.priority === "Alta" && "bg-red-100 text-red-700",
              task.priority === "Média" && "bg-yellow-100 text-yellow-700",
              task.priority === "Baixa" && "bg-green-100 text-green-700"
            )}
          >
            {task.priority}
          </span>
        </div>

        {task.client && (
          <p className="text-sm text-gray-600 mt-1">{task.client}</p>
        )}

        {task.sector && (
          <p className="text-sm text-gray-600 mt-1">Setor: {task.sector}</p>
        )}

        {/* Responsável */}
        <div className="flex items-center gap-1 mt-2">
          <User size={14} className="text-gray-500" />
          <p className="text-sm text-gray-600">
            Responsável:{" "}
            <span className="font-medium">{responsibleName}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>
          Prazo: {dueDate ? format(dueDate, "dd/MM/yyyy") : "—"}
        </span>
        <div className="flex space-x-2">
          <button onClick={() => onEdit(task)} title="Editar">
            <Edit2 size={16} />
          </button>
          <button onClick={() => onShare(task)} title="Compartilhar">
            <Share2 size={16} />
          </button>
          <button
            className="text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
