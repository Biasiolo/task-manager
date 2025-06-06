// src/features/tasks/TaskFilters.tsx

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { supabase } from "../../integrations/supabase/supabaseClient";

export interface FilterValues {
  sector: string;
  priority: string;
  user: string;    // aqui guardamos o “name” do responsável
  client: string;
  date: string;    // ainda que não tenhamos campo de data no filtro por enquanto
}

interface TaskFiltersProps {
  onFilter: (filters: FilterValues) => void;
}

export function TaskFilters({ onFilter }: TaskFiltersProps) {
  const { control, handleSubmit, reset } = useForm<FilterValues>({
    defaultValues: {
      sector: "",
      priority: "",
      user: "",
      client: "",
      date: "",
    },
  });

  // substituímos “users” por “responsibles”: lista de nomes vindos de tasks.name
  const [responsibles, setResponsibles] = useState<string[]>([]);
  const [clients, setClients] = useState<string[]>([]);

  useEffect(() => {
    // busca apenas os nomes (campo `name`) de todas as tarefas, desconsiderando nulos/vazios
    const fetchResponsibles = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("name")
        .not("name", "is", null); // só traz nomes não-nulos

      if (!error && data) {
        // extrai strings únicas
        const names = data
          .map((row: { name: string | null }) => row.name ?? "")
          .filter((n) => n.trim() !== "");
        setResponsibles(Array.from(new Set(names)));
      }
    };

    // busca clientes únicos diretamente da tabela tasks.client
    const fetchClients = async () => {
      const { data, error } = await supabase.from("tasks").select("client");
      if (!error && data) {
        const unique = Array.from(
          new Set(
            data
              .map((task: { client: string | null }) => task.client ?? "")
              .filter((c) => c.trim() !== "")
          )
        );
        setClients(unique);
      }
    };

    fetchResponsibles();
    fetchClients();
  }, []);

  const submit = (data: FilterValues) => {
    onFilter(data);
  };

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

      {/* Responsável (filtra por `tasks.name`) */}
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
