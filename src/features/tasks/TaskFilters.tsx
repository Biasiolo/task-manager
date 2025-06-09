// src/features/tasks/TaskFilters.tsx
import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import type { Task } from "./useTasks";

export interface FilterValues {
  sector: string;
  priority: string;
  user: string;    // aqui guardamos o “name” do responsável
  client: string;
  date: string;
}

interface TaskFiltersProps {
  tasks: Task[];                   // ← receber o array completo de tarefas
  onFilter: (filters: FilterValues) => void;
}

export function TaskFilters({ tasks, onFilter }: TaskFiltersProps) {
  const { control, handleSubmit, reset } = useForm<FilterValues>({
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

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap gap-4">
      {/* Setor */}
      <Controller
        name="sector"
        control={control}
        render={({ field }) => (
          <select {...field} className="border rounded px-3 py-2">
            <option value="">Todos os Setores</option>
            <option value="Marketing">Marketing</option>
            <option value="Design">Design</option>
            <option value="Web">Web</option>
            <option value="Tráfego">Tráfego</option>
            <option value="Copy">Copy</option>
          </select>
        )}
      />

      {/* Prioridade */}
      <Controller
        name="priority"
        control={control}
        render={({ field }) => (
          <select {...field} className="border rounded px-3 py-2">
            <option value="">Todas as Prioridades</option>
            <option value="Alta">Alta</option>
            <option value="Média">Média</option>
            <option value="Baixa">Baixa</option>
          </select>
        )}
      />

      {/* Responsável (filtra por nome que está em t.name) */}
      <Controller
        name="user"
        control={control}
        render={({ field }) => (
          <select {...field} className="border rounded px-3 py-2">
            <option value="">Todos os Responsáveis</option>
            {responsibles.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        )}
      />

      {/* Cliente */}
      <Controller
        name="client"
        control={control}
        render={({ field }) => (
          <select {...field} className="border rounded px-3 py-2">
            <option value="">Todos os Clientes</option>
            {clients.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Filtrar
      </button>
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
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
      >
        Limpar
      </button>
    </form>
  );
}
