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
        "group relative h-72 rounded-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden",
        // Glassmorphism base
        "bg-white/20 backdrop-blur-xl border border-white/30",
        // Shadow sofisticada
        "shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10",
        // Estados específicos
        task.status === "Concluída" && 
          "bg-emerald-50/20 border-emerald-200/40 shadow-emerald-500/5",
        task.status !== "Concluída" && isOverdue && 
          "bg-red-50/20 border-red-200/40 shadow-red-500/10",
        task.status === "Pendente" && !isOverdue && 
          "hover:bg-white/25 hover:border-white/40"
      )}
    >
      {/* Faixa de prioridade - mais sutil */}
      <div
        className={clsx(
          "absolute top-0 left-0 right-0 h-1 transition-all duration-300",
          task.priority === "Alta" && "bg-gradient-to-r from-red-400/60 to-red-500/60",
          task.priority === "Média" && "bg-gradient-to-r from-amber-400/60 to-orange-400/60",
          task.priority === "Baixa" && "bg-gradient-to-r from-yellow-400/60 to-yellow-500/60"
        )}
      />

      {/* Background overlay sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 pointer-events-none" />

      {/* Conteúdo */}
      <div className="relative flex flex-col h-full p-6">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <CheckboxPrimitive.Root
              checked={task.status === "Concluída"}
              onCheckedChange={toggleComplete}
              className={clsx(
                "w-5 h-5 border-2 rounded-lg focus:ring-2 focus:ring-white/30 transition-all duration-300 mt-0.5 flex items-center justify-center cursor-pointer backdrop-blur-sm",
                task.status === "Concluída"
                  ? "bg-emerald-500/80 border-emerald-400/60 text-white hover:bg-emerald-500/90 shadow-lg shadow-emerald-500/20"
                  : "border-white/40 hover:border-white/60 hover:bg-white/20 bg-white/10 shadow-inner"
              )}
            >
              <CheckboxPrimitive.Indicator className="flex items-center justify-center">
                <Check size={12} className="text-white font-bold drop-shadow-sm" />
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>

            <div className="flex-1">
              <h3
                className={clsx(
                  "text-lg font-semibold transition-all duration-300 leading-tight drop-shadow-sm",
                  task.status === "Concluída"
                    ? "line-through text-slate-600/80"
                    : isOverdue
                    ? "text-red-700/90"
                    : "text-slate-800/90"
                )}
              >
                {task.title}
              </h3>
              {(task.client || task.sector) && (
                <div className="flex flex-col gap-1.5 mt-2">
                  {task.client && (
                    <p className="text-sm font-medium text-slate-700/80 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-500/60 rounded-full shadow-sm" />
                      {task.client}
                    </p>
                  )}
                  {task.sector && (
                    <p className="text-xs text-slate-600/70 uppercase tracking-wider font-semibold">
                      {task.sector}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <span
            className={clsx(
              "text-xs font-semibold rounded-full px-3 py-1.5 whitespace-nowrap ml-3 backdrop-blur-sm border transition-all duration-300",
              task.priority === "Alta" &&
                (task.status === "Concluída"
                  ? "bg-emerald-500/20 text-emerald-800/90 border-emerald-400/30 shadow-sm"
                  : "bg-red-500/20 text-red-800/90 border-red-400/30 shadow-sm"),
              task.priority === "Média" &&
                (task.status === "Concluída"
                  ? "bg-emerald-500/20 text-emerald-800/90 border-emerald-400/30 shadow-sm"
                  : "bg-amber-500/20 text-amber-800/90 border-amber-400/30 shadow-sm"),
              task.priority === "Baixa" &&
                (task.status === "Concluída"
                  ? "bg-emerald-500/20 text-emerald-800/90 border-emerald-400/30 shadow-sm"
                  : "bg-yellow-500/20 text-yellow-800/90 border-yellow-400/30 shadow-sm")
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
                  ? "text-slate-600/70"
                  : "text-slate-700/80"
              )}
            >
              {task.description}
            </p>
          </div>
        )}

        {/* RESPONSÁVEL */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-sm">
            <User size={14} className="text-slate-700/80" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-800/90">
              {task.name ?? "Não atribuído"}
            </span>
            <span className="text-xs text-slate-600/70">Responsável</span>
          </div>
        </div>

        {/* PREENCHE O ESPAÇO RESTANTE */}
        <div className="flex-1" />

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div className="flex items-center gap-2">
            {task.status === "Concluída" ? (
              <div className="flex items-center gap-2 text-emerald-700/90 bg-emerald-500/20 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-emerald-400/30 shadow-sm">
                <CheckCircle2 size={14} />
                <span className="text-sm font-medium">Concluída</span>
              </div>
            ) : isOverdue ? (
              <div className="flex items-center gap-2 text-red-700/90 bg-red-500/20 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-red-400/30 shadow-sm">
                <AlertCircle size={14} />
                <span className="text-sm font-medium">
                  Venceu {dueDate ? format(dueDate, "dd/MM") : ""}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-700/80 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/30 shadow-sm">
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
              className="p-2.5 cursor-pointer text-slate-600/70 hover:text-slate-800/90 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 border border-transparent hover:border-white/30 hover:shadow-sm"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              title="Excluir tarefa"
              className="p-2.5 cursor-pointer text-slate-600/70 hover:text-red-600/90 hover:bg-red-500/20 backdrop-blur-sm rounded-xl transition-all duration-300 border border-transparent hover:border-red-400/30 hover:shadow-sm"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay de hover glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none rounded-2xl" />
      
      {/* Brilho sutil na borda */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none bg-gradient-to-br from-white/20 via-transparent to-transparent" 
           style={{
             background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
             maskImage: 'linear-gradient(black, black), linear-gradient(black, black)',
             maskSize: '100% 100%, calc(100% - 2px) calc(100% - 2px)',
             maskPosition: '0 0, 1px 1px',
             maskComposite: 'subtract'
           }} />
    </div>
  );
}