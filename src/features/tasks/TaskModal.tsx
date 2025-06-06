import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskCreateSchema, TaskUpdateSchema } from "../../utils/zodSchemas";
import { Task, useTasks } from "./useTasks";
import { TaskCreateForm, TaskUpdateForm } from "./types";
import { format } from "date-fns";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Task; // Para popular em edição
}

export function TaskModal({ isOpen, onClose, initialData }: TaskModalProps) {
  const isEditMode = Boolean(initialData);
  const { createTask, updateTask } = useTasks();

  // Definimos defaultValues incluindo somente “name” (nome do responsável).
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskCreateForm | TaskUpdateForm>({
    resolver: zodResolver(isEditMode ? TaskUpdateSchema : TaskCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      client: "",
      sector: "",
      start_date: format(new Date(), "yyyy-MM-dd"),
      due_date: format(new Date(), "yyyy-MM-dd"),
      priority: "Média",
      status: "Pendente",
      link: "",
      name: "",       // Aqui só “name”
      // note que NÃO temos user_id no defaultValues
    },
  });

  // Se estivermos em modo edição, carregamos os valores em reset()
  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        title: initialData.title,
        description: initialData.description ?? "",
        client: initialData.client ?? "",
        sector: initialData.sector ?? "",
        start_date: initialData.start_date ?? format(new Date(), "yyyy-MM-dd"),
        due_date: initialData.due_date ?? format(new Date(), "yyyy-MM-dd"),
        priority: initialData.priority ?? "Média",
        status: initialData.status ?? "Pendente",
        link: initialData.link ?? "",
        name: initialData.name ?? "", // Carrega o “name” existente
        // Não mexemos no user_id aqui: ele já veio do BD e fica imutável
      });
    } else {
      reset({
        title: "",
        description: "",
        client: "",
        sector: "",
        start_date: format(new Date(), "yyyy-MM-dd"),
        due_date: format(new Date(), "yyyy-MM-dd"),
        priority: "Média",
        status: "Pendente",
        link: "",
        name: "",
        id: undefined,
      });
    }
  }, [initialData, reset]);

  // Ao submeter, recebemos { name, title, … } sem user_id
  const onSubmit = async (data: TaskCreateForm | TaskUpdateForm) => {
    try {
      if (isEditMode && initialData?.id) {
        const updateData: TaskUpdateForm = {
          ...data,
          id: initialData.id,
          // NÃO incluímos user_id aqui, pois ele não muda
        };
        await updateTask.mutateAsync(updateData);
      } else {
        // Chamamos createTask; o próprio createTask vai injetar user_id internamente
        await createTask.mutateAsync(data as TaskCreateForm);
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-lg p-6 shadow-lg z-10">
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? "Editar Tarefa" : "Nova Tarefa"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium">Título</label>
            <input
              type="text"
              {...register("title")}
              className="mt-1 w-full border rounded px-3 py-2"
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium">Descrição</label>
            <textarea
              {...register("description")}
              className="mt-1 w-full border rounded px-3 py-2"
              rows={3}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium">Cliente</label>
            <input
              type="text"
              {...register("client")}
              className="mt-1 w-full border rounded px-3 py-2"
            />
            {errors.client && (
              <p className="text-xs text-red-500 mt-1">{errors.client.message}</p>
            )}
          </div>

          {/* Setor */}
          <div>
            <label className="block text-sm font-medium">Setor</label>
            <input
              type="text"
              {...register("sector")}
              className="mt-1 w-full border rounded px-3 py-2"
            />
            {errors.sector && (
              <p className="text-xs text-red-500 mt-1">{errors.sector.message}</p>
            )}
          </div>

          {/* Nome do Responsável */}
          <div>
            <label className="block text-sm font-medium">
              Nome do Responsável
            </label>
            <input
              type="text"
              {...register("name")}
              className="mt-1 w-full border rounded px-3 py-2"
              placeholder="Informe o nome do responsável"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Data de Início */}
          <div>
            <label className="block text-sm font-medium">Data de Início</label>
            <input
              type="date"
              {...register("start_date")}
              className="mt-1 w-full border rounded px-3 py-2"
            />
            {errors.start_date && (
              <p className="text-xs text-red-500 mt-1">
                {errors.start_date.message}
              </p>
            )}
          </div>

          {/* Data de Vencimento */}
          <div>
            <label className="block text-sm font-medium">Data de Vencimento</label>
            <input
              type="date"
              {...register("due_date")}
              className="mt-1 w-full border rounded px-3 py-2"
            />
            {errors.due_date && (
              <p className="text-xs text-red-500 mt-1">
                {errors.due_date.message}
              </p>
            )}
          </div>

          {/* Prioridade */}
          <div>
            <label className="block text-sm font-medium">Prioridade</label>
            <select
              {...register("priority")}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
            </select>
            {errors.priority && (
              <p className="text-xs text-red-500 mt-1">
                {errors.priority.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              {...register("status")}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="Pendente">Pendente</option>
              <option value="Concluída">Concluída</option>
            </select>
            {errors.status && (
              <p className="text-xs text-red-500 mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Link */}
          <div>
  <label className="block text-sm font-medium">Link (opcional)</label>
  <input
    type="url"
    {...register("link")}
    className="mt-1 w-full border rounded px-3 py-2"
    placeholder="https://exemplo.com"
  />
  {errors.link && (
    <p className="text-xs text-red-500 mt-1">{errors.link.message}</p>
  )}
</div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
            >
              {isEditMode ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
