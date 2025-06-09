// src/features/tasks/TaskCard.tsx

import React from "react";
import { Task } from "./useTasks";
import { Edit2, Share2, User, Check, Calendar, AlertCircle } from "lucide-react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { supabase } from "../../integrations/supabase/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onShare: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onShare, onDelete }: TaskCardProps) {
  const queryClient = useQueryClient();
  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const isOverdue =
    dueDate !== null && dueDate < new Date() && task.status === "Pendente";

  // Alterna entre Pendente e Concluída direto no Supabase
  const toggleComplete = async () => {
    const nextStatus = task.status === "Concluída" ? "Pendente" : "Concluída";
    const completed_at =
      nextStatus === "Concluída" ? new Date().toISOString() : null;

    const { error } = await supabase
      .from("tasks")
      .update({ status: nextStatus, completed_at })
      .eq("id", task.id);

    if (error) {
      console.error("Erro ao atualizar status:", error);
    } else {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  };

  return (
    <div
      className={clsx(
        "bg-blue-100 rounded-xl shadow-sm border-none transition-all duration-300 hover:shadow-lg hover:scale-[1.02] relative overflow-hidden",
        task.status === "Concluída" && "bg-gray-200",
        isOverdue && "border-red-200 bg-red-50/30"
      )}
    >
      {/* Barra lateral colorida baseada na prioridade */}
      <div
        className={clsx(
          "absolute left-0 top-0 bottom-0 w-1",
          task.priority === "Alta" && "bg-gradient-to-b from-red-500 to-red-600",
          task.priority === "Média" && "bg-gradient-to-b from-yellow-500 to-orange-500",
          task.priority === "Baixa" && "bg-gradient-to-b from-green-500 to-emerald-600"
        )}
      />

      <div className="p-6 pl-8">
        {/* Header com título e checkbox */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <CheckboxPrimitive.Root
              checked={task.status === "Concluída"}
              onCheckedChange={toggleComplete}
              className={clsx(
                "w-5 h-5 border-2 rounded-md focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 mt-0.5",
                "flex items-center justify-center cursor-pointer",
                task.status === "Concluída" 
                  ? "bg-green-500 border-green-500 text-white" 
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              )}
            >
              <CheckboxPrimitive.Indicator className="flex items-center justify-center">
                <Check size={14} className="text-white" />
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>

            <div className="flex-1">
              <h3
                className={clsx(
                  "text-lg font-semibold transition-all duration-200",
                  task.status === "Concluída" 
                    ? "line-through text-gray-500" 
                    : "text-gray-900"
                )}
              >
                {task.title}
              </h3>
              
              {/* Cliente e Setor em uma linha mais compacta */}
              <div className="flex flex-col gap-1 mt-2">
                {task.client && (
                  <p className="text-sm font-medium text-gray-700">{task.client}</p>
                )}
                {task.sector && (
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    {task.sector}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Badge de prioridade redesenhado */}
          <span
            className={clsx(
              "text-xs font-semibold rounded-full px-3 py-1.5 whitespace-nowrap ml-3",
              task.priority === "Alta" && "bg-red-100 text-red-700 border border-red-200",
              task.priority === "Média" && "bg-yellow-100 text-yellow-700 border border-yellow-200",
              task.priority === "Baixa" && "bg-green-100 text-green-700 border border-green-200"
            )}
          >
            {task.priority}
          </span>
        </div>

        {/* Descrição com melhor espaçamento */}
        {task.description && (
          <div className="mb-4">
            <p className={clsx(
              "text-sm leading-relaxed",
              task.status === "Concluída" ? "text-gray-500" : "text-gray-700"
            )}>
              {task.description}
            </p>
          </div>
        )}

        {/* Responsável com ícone melhorado */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
            <User size={12} className="text-blue-600" />
          </div>
          <span className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">
              {task.name ?? "Não atribuído"}
            </span>
          </span>
        </div>

        {/* Footer com data e ações */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {isOverdue ? (
              <div className="flex items-center gap-1.5 text-red-600">
                <AlertCircle size={14} />
                <span className="text-sm font-medium">
                  Venceu em {dueDate ? format(dueDate, "dd/MM/yyyy") : "—"}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-gray-500">
                <Calendar size={14} />
                <span className="text-sm">
                  {dueDate ? format(dueDate, "dd/MM/yyyy") : "Sem prazo"}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => onEdit(task)} 
              title="Editar"
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              <Edit2 size={16} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              title="Excluir"
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <span className="text-sm font-medium">Excluir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}