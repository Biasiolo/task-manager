// src/features/tasks/types.ts

import type { Database } from "../../integrations/supabase/types";

// Tipos base do Supabase
export type SupabaseTaskRow = Database["public"]["Tables"]["tasks"]["Row"];
export type SupabaseTaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type SupabaseTaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];

// Enums para os valores específicos
export type TaskPriority = "Baixa" | "Média" | "Alta";
export type TaskStatus = "Pendente" | "Concluída";

/**
 * Tipo principal Task usado pela aplicação
 * Combina os tipos do Supabase com tipagem mais específica
 */
export interface Task {
  id: string;
  user_id: string | null;        // Mantém snake_case para compatibilidade com Supabase
  name: string | null;           // Campo para nome do responsável
  title: string;
  description: string | null;
  client: string | null;
  sector: string | null;
  start_date: string | null;
  due_date: string | null;
  priority: TaskPriority | null;
  status: TaskStatus | null;
  link: string | null;
  created_by: string | null;
  observation: string | null;
  completed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Tipo para payload de criação de tarefa
 */
export type TaskCreateForm = {
  title: string;
  description?: string | null;
  client?: string | null;
  sector?: string | null;
  start_date?: string | null;
  due_date?: string | null;
  priority?: TaskPriority | null;
  status?: TaskStatus | null;
  link?: string | null;
  name: string;               // Agora obrigatório (nome do responsável)
  user_id?: string | null;    // ID do responsável (opcional)
  observation?: string | null;
};

/**
 * Tipo para payload de atualização de tarefa
 */
export type TaskUpdateForm = {
  id: string;
  title?: string;
  description?: string | null;
  client?: string | null;
  sector?: string | null;
  start_date?: string | null;
  due_date?: string | null;
  priority?: TaskPriority | null;
  status?: TaskStatus | null;
  link?: string | null;
  name: string;               // Obrigatório (nome do responsável)
  user_id?: string | null;    // ID do responsável (opcional)
  observation?: string | null;
  completed_at?: string | null;
};

/**
 * Tipo para filtros de tarefa
 */
export interface TaskFilters {
  status?: TaskStatus | null;
  priority?: TaskPriority | null;
  client?: string;
  sector?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Tipo para ordenação de tarefas
 */
export type TaskSortField = 'due_date' | 'created_at' | 'title' | 'priority' | 'status';
export type TaskSortOrder = 'asc' | 'desc';

export interface TaskSort {
  field: TaskSortField;
  order: TaskSortOrder;
}
