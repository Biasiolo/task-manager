import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../integrations/supabase/supabaseClient";
import type { Database } from "../../integrations/supabase/types";
import { format } from "date-fns";
import type { Task, TaskCreateForm, TaskUpdateForm } from "./types";

type SupabaseTaskRow = Database["public"]["Tables"]["tasks"]["Row"];
type SupabaseTaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
type SupabaseTaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];

/**
 * Converte uma linha retornada pelo Supabase num objeto Task
 */
function mapRowToTask(row: SupabaseTaskRow): Task {
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    title: row.title,
    description: row.description,
    client: row.client,
    sector: row.sector,
    start_date: row.start_date,
    due_date: row.due_date,
    priority: (row.priority as Task["priority"]) ?? null,
    status: (row.status as Task["status"]) ?? null,
    link: row.link,
    created_by: row.created_by,
    observation: row.observation,
    completed_at: row.completed_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * Busca lista de tarefas conforme filtros recebidos
 */
export async function fetchTasks(filters: {
  user: string;
  client: string;
  dateFrom: string;
  dateTo: string;
}): Promise<Task[]> {
  const { user, client, dateFrom, dateTo } = filters;

  let query = supabase
    .from("tasks")
    .select("*")
    .order("due_date", { ascending: true });

  if (!dateFrom || !dateTo) {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const formattedDate = format(last7Days, "yyyy-MM-dd");
    query = query.gte("due_date", formattedDate);
  } else {
    query = query.gte("due_date", dateFrom).lte("due_date", dateTo);
  }

  if (user) {
    query = query.eq("user_id", user);
  }
  if (client) {
    query = query.eq("client", client);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return (data || []).map(mapRowToTask);
}

export function useTasks() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["tasks", { user: "", client: "", dateFrom: "", dateTo: "" }] as const,
    queryFn: ({ queryKey }) => {
      return fetchTasks(queryKey[1]);
    },
    staleTime: 1000 * 60 * 5,
  });

  /**
   * Cria uma nova tarefa: preenche o user_id a partir do supabase.auth.getUser()
   */
  const createTask = useMutation({
    mutationFn: async (newTaskPayload: TaskCreateForm): Promise<Task> => {
      // Descobre quem é o usuário logado
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error(authError?.message ?? "Usuário não autenticado");
      }

      // Monta o payload com TODOS os campos, incluindo o name e o user_id do criador
      const payload: SupabaseTaskInsert = {
        title: newTaskPayload.title,
        description: newTaskPayload.description ?? null,
        client: newTaskPayload.client ?? null,
        sector: newTaskPayload.sector ?? null,
        start_date: newTaskPayload.start_date ?? null,
        due_date: newTaskPayload.due_date ?? null,
        priority: newTaskPayload.priority ?? null,
        status: newTaskPayload.status ?? "Pendente",
        link: newTaskPayload.link ?? null,
        name: newTaskPayload.name ?? null,     // O nome do "responsável" (qualquer pessoa)
        user_id: user.id,                       // <-- aqui é o ID do usuário logado (criador)
        observation: newTaskPayload.observation ?? null,
        created_by: user.id,                    // ou outro campo que queira gravar
      };

      console.log("Payload sendo enviado para o Supabase:", payload);

      const { data, error } = await supabase
        .from("tasks")
        .insert(payload)
        .select("*")
        .single();

      if (error) {
        console.error("Erro ao inserir tarefa:", error);
        throw new Error(error.message);
      }
      return mapRowToTask(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  /**
   * Atualiza uma tarefa existente: NÃO modifica o user_id original
   */
  const updateTask = useMutation({
    mutationFn: async (updatedPayload: TaskUpdateForm): Promise<Task> => {
      const { id, ...rest } = updatedPayload;

      // Só deixamos o usuário mudar os campos relevantes (title, name, etc).
      // NÃO estamos mudando user_id aqui, pois queremos manter quem criou
      const payload: SupabaseTaskUpdate = {
        title: rest.title,
        description: rest.description ?? null,
        client: rest.client ?? null,
        sector: rest.sector ?? null,
        start_date: rest.start_date ?? null,
        due_date: rest.due_date ?? null,
        priority: rest.priority ?? null,
        status: rest.status ?? null,
        link: rest.link ?? null,
        name: rest.name ?? null,        // Permite mudar só o “nome do responsável”
        // NÃO incluímos rest.user_id (nem precisamos)
        observation: rest.observation ?? null,
        updated_at: new Date().toISOString(),
      };

      console.log("Payload de atualização sendo enviado:", payload);

      const { data, error } = await supabase
        .from("tasks")
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        console.error("Erro ao atualizar tarefa:", error);
        throw new Error(error.message);
      }
      return mapRowToTask(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    ...query,
    createTask,
    updateTask,
    deleteTask,
  };
}

export type { Task };
