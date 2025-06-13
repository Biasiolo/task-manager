// src/features/tasks/TaskCard.tsx

import React from "react";
import { Task } from "./useTasks";
import {
  Edit2,
  User,
  Check,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Trash2,
} from "lucide-react";
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

export function TaskCard({
  task,
  onEdit,
  onShare,
  onDelete,
}: TaskCardProps) {
  const queryClient = useQueryClient();
  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const isOverdue =
    dueDate !== null && dueDate < new Date() && task.status === "Pendente";

  // Alterna entre Pendente e Concluída direto no Supabase
  const toggleComplete = async () => {
    const nextStatus =
      task.status === "Concluída" ? "Pendente" : "Concluída";
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
        "group relative bg-white/80 h-72 backdrop-blur-sm rounded-3xl shadow-md shadow-neutral-500 border-none transition-all duration-300 hover:shadow-lg hover:scale-[1.02] overflow-hidden",
        task.status === "Concluída" && "bg-slate-50/80 border-slate-200/50",
        task.status !== "Concluída" &&
          isOverdue &&
          "bg-red-50/80 border-red-200/60",
        task.status === "Pendente" &&
          !isOverdue &&
          "border-slate-200/50"
      )}
    >
      {/* Faixa de prioridade no topo */}
      <div
        className={clsx(
          "absolute top-0 left-0 right-0 h-2 rounded-t-lg transition-all duration-300",
          task.priority === "Alta" &&
            "bg-gradient-to-b from-rose-500 via-red-500 to-red-600",
          task.priority === "Média" &&
            "bg-gradient-to-b from-amber-400 via-orange-400 to-orange-500",
          task.priority === "Baixa" &&
            "bg-gradient-to-b from-amber-400 via-yellow-500 to-yellow-600"
        )}
      />

      {/* Conteúdo em coluna para empurrar o footer para o fim */}
      <div className="flex flex-col h-full p-6 pl-8">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <CheckboxPrimitive.Root
              checked={task.status === "Concluída"}
              onCheckedChange={toggleComplete}
              className={clsx(
                "w-5 h-5 border-2 rounded-lg focus:ring-2 focus:ring-slate-500/20 transition-all duration-200 mt-0.5 flex items-center justify-center cursor-pointer shadow-sm",
                task.status === "Concluída"
                  ? "bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600"
                  : "border-slate-300 hover:border-slate-400 hover:bg-slate-50 bg-white"
              )}
            >
              <CheckboxPrimitive.Indicator className="flex items-center justify-center">
                <Check size={12} className="text-white font-medium" />
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>

            <div className="flex-1">
              <h3
                className={clsx(
                  "text-lg font-medium transition-all duration-200 leading-tight",
                  task.status === "Concluída"
                    ? "line-through text-slate-500"
                    : isOverdue
                    ? "text-red-600"
                    : "text-slate-800"
                )}
              >
                {task.title}
              </h3>
              {(task.client || task.sector) && (
                <div className="flex flex-col gap-1 mt-2">
                  {task.client && (
                    <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      {task.client}
                    </p>
                  )}
                  {task.sector && (
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                      {task.sector}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <span
            className={clsx(
              "text-xs font-semibold rounded-full px-3 py-1.5 whitespace-nowrap ml-3 shadow-sm border backdrop-blur-sm",
              task.priority === "Alta" &&
                (task.status === "Concluída"
                  ? "bg-green-50/80 text-green-700 border-green-200/60"
                  : "bg-red-100/80 text-red-700 border-red-300/60"),
              task.priority === "Média" &&
                (task.status === "Concluída"
                  ? "bg-green-50/80 text-green-700 border-green-200/60"
                  : "bg-orange-100/80 text-orange-700 border-orange-300/60"),
              task.priority === "Baixa" &&
                (task.status === "Concluída"
                  ? "bg-green-50/80 text-green-700 border-green-200/60"
                  : "bg-yellow-100/80 text-yellow-700 border-yellow-300/60")
            )}
          >
            {task.priority}
          </span>
        </div>

        {/* DESCRIÇÃO */}
        {task.description && (
          <div className="mb-4">
            <p
              className={clsx(
                "text-xs leading-relaxed",
                task.status === "Concluída"
                  ? "text-slate-500"
                  : "text-slate-600"
              )}
            >
              {task.description}
            </p>
          </div>
        )}

        {/* RESPONSÁVEL */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full shadow-sm border border-slate-200/50">
            <User size={14} className="text-slate-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-800">
              {task.name ?? "Não atribuído"}
            </span>
            <span className="text-xs text-slate-500">Responsável</span>
          </div>
        </div>

        {/* PREENCHE O ESPAÇO RESTANTE */}
        <div className="flex-1" />

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
          <div className="flex items-center gap-2">
            {task.status === "Concluída" ? (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50/80 px-3 py-1.5 rounded-lg border border-emerald-200/50">
                <CheckCircle2 size={14} />
                <span className="text-sm font-medium">Concluída</span>
              </div>
            ) : isOverdue ? (
              <div className="flex items-center gap-2 text-red-600 bg-red-50/80 px-3 py-1.5 rounded-lg border border-red-200/50">
                <AlertCircle size={14} />
                <span className="text-sm font-medium">
                  Venceu {dueDate ? format(dueDate, "dd/MM") : ""}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-500 bg-slate-50/80 px-3 py-1.5 rounded-lg border border-slate-200/50">
                <Calendar size={14} />
                <span className="text-sm font-medium">
                  {dueDate ? format(dueDate, "dd/MM/yyyy") : "Sem prazo"}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(task)}
              title="Editar tarefa"
              className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-200/50"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              title="Excluir tarefa"
              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50/80 rounded-xl transition-all duration-200 border border-transparent hover:border-red-200/50"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay de hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
    </div>
  );
}
