// src/features/tasks/TaskFilters.tsx
import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Filter, X, Search } from "lucide-react";
import type { Task } from "./useTasks";

export interface FilterValues {
  sector: string;
  priority: string;
  user: string;    // aqui guardamos o "name" do responsável
  client: string;
  date: string;
}

interface TaskFiltersProps {
  tasks: Task[];                   // ← receber o array completo de tarefas
  onFilter: (filters: FilterValues) => void;
}

export function TaskFilters({ tasks, onFilter }: TaskFiltersProps) {
  const { control, handleSubmit, reset, watch } = useForm<FilterValues>({
    defaultValues: {
      sector: "",
      priority: "",
      user: "",
      client: "",
      date: "",
    },
  });

  // Deriva, via useMemo, a lista única de responsáveis e clientes
  const responsibles = useMemo(() => {
    const names = tasks
      .map((t) => t.name ?? "")
      .filter((n) => n.trim() !== "");
    return Array.from(new Set(names));
  }, [tasks]);

  const clients = useMemo(() => {
    const cs = tasks
      .map((t) => t.client ?? "")
      .filter((c) => c.trim() !== "");
    return Array.from(new Set(cs));
  }, [tasks]);

  const submit = (data: FilterValues) => onFilter(data);

  // Monitora mudanças e aplica filtros automaticamente
  const watchedValues = watch();
  useEffect(() => {
    onFilter(watchedValues);
  }, [watchedValues, onFilter]);

  // Verifica se há filtros ativos
  const hasActiveFilters = Object.values(watchedValues).some(value => value !== "");

  return (
    <div className="space-y-4">
      {/* Header dos filtros */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-gray-800">
          <Filter size={18} className="text-slate-500" />
          <h3 className="font-semibold">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <span className="text-xs bg-slate-100 text-gray-800 px-2 py-1 rounded-full font-medium">
            Filtros ativos
          </span>
        )}
      </div>

      {/* Formulário de filtros */}
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          
          {/* Setor */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Setor</label>
            <Controller
              name="sector"
              control={control}
              render={({ field }) => (
                <select 
                  {...field} 
                  className="w-full bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm 
                           focus:ring-2 focus:ring-slate-500/20 focus:border-slate-400 transition-all duration-200 
                           shadow-sm hover:bg-white hover:border-slate-300/60"
                >
                  <option value="">Todos os Setores</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Design">Design</option>
                  <option value="Web">Web</option>
                  <option value="Tráfego">Tráfego</option>
                  <option value="Copy">Copy</option>
                </select>
              )}
            />
          </div>

          {/* Prioridade */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Prioridade</label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <select 
                  {...field} 
                  className="w-full bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm 
                           focus:ring-2 focus:ring-slate-500/20 focus:border-slate-400 transition-all duration-200 
                           shadow-sm hover:bg-white hover:border-slate-300/60"
                >
                  <option value="">Todas as Prioridades</option>
                  <option value="Alta">🔴 Alta</option>
                  <option value="Média">🟠 Média</option>
                  <option value="Baixa">🟡 Baixa</option>
                </select>
              )}
            />
          </div>

          {/* Responsável */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Responsável</label>
            <Controller
              name="user"
              control={control}
              render={({ field }) => (
                <select 
                  {...field} 
                  className="w-full bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm 
                           focus:ring-2 focus:ring-slate-500/20 focus:border-slate-400 transition-all duration-200 
                           shadow-sm hover:bg-white hover:border-slate-300/60"
                >
                  <option value="">Todos os Responsáveis</option>
                  {responsibles.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          {/* Cliente */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Cliente</label>
            <Controller
              name="client"
              control={control}
              render={({ field }) => (
                <select 
                  {...field} 
                  className="w-full bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm 
                           focus:ring-2 focus:ring-slate-500/20 focus:border-slate-400 transition-all duration-200 
                           shadow-sm hover:bg-white hover:border-slate-300/60"
                >
                  <option value="">Todos os Clientes</option>
                  {clients.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          {/* Ações */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800 opacity-0">Ações</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  reset();
                  onFilter({
                    sector: "",
                    priority: "",
                    user: "",
                    client: "",
                    date: "",
                  });
                }}
                disabled={!hasActiveFilters}
                className="flex items-center gap-2 cursor-pointer bg-slate-100/80 hover:bg-slate-200/80 disabled:bg-slate-50 
                         disabled:text-slate-400 text-slate-600 px-4 py-2.5 rounded-xl font-medium 
                         transition-all duration-200 shadow-sm border border-slate-200/60 
                         hover:border-slate-300/60 disabled:border-slate-200/40 text-sm"
              >
                <X size={14} />
                Limpar
              </button>
            </div>
          </div>
        </div>

        {/* Resumo dos filtros ativos */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/50">
            <span className="text-xs text-slate-500 font-medium">Filtros ativos:</span>
            {watchedValues.sector && (
              <span className="inline-flex items-center gap-1 bg-teal-100/80 text-teal-700 px-2 py-1 rounded-lg text-xs font-medium border border-teal-200/50">
                Setor: {watchedValues.sector}
              </span>
            )}
            {watchedValues.priority && (
              <span className="inline-flex items-center gap-1 bg-purple-100/80 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium border border-purple-200/50">
                Prioridade: {watchedValues.priority}
              </span>
            )}
            {watchedValues.user && (
              <span className="inline-flex items-center gap-1 bg-green-100/80 text-green-700 px-2 py-1 rounded-lg text-xs font-medium border border-green-200/50">
                Responsável: {watchedValues.user}
              </span>
            )}
            {watchedValues.client && (
              <span className="inline-flex items-center gap-1 bg-amber-100/80 text-amber-700 px-2 py-1 rounded-lg text-xs font-medium border border-amber-200/50">
                Cliente: {watchedValues.client}
              </span>
            )}
          </div>
        )}
      </form>
    </div>
  );
}