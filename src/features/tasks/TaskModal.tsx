// src/features/tasks/TaskModal.tsx

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskCreateSchema, TaskUpdateSchema } from "../../utils/zodSchemas";
import { Task, useTasks } from "./useTasks";
import { TaskCreateForm, TaskUpdateForm } from "./types";
import { format } from "date-fns";
import clsx from "clsx";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Task;
}

export function TaskModal({ isOpen, onClose, initialData }: TaskModalProps) {
  const isEditMode = Boolean(initialData);
  const { createTask, updateTask } = useTasks();

  // Default values for creation
  const defaultValues = useMemo<TaskCreateForm>(
    () => ({
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
      observation: null,
    }),
    []
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskCreateForm | TaskUpdateForm>({
    resolver: zodResolver(isEditMode ? TaskUpdateSchema : TaskCreateSchema),
    defaultValues,
  });

  // Reset on open/new
  useEffect(() => {
    if (isOpen && !isEditMode) reset(defaultValues);
  }, [isOpen, isEditMode, reset, defaultValues]);

  // Populate on edit
  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        title: initialData.title,
        description: initialData.description ?? "",
        client: initialData.client ?? "",
        sector: initialData.sector ?? "",
        start_date: initialData.start_date ?? defaultValues.start_date,
        due_date: initialData.due_date ?? defaultValues.due_date,
        priority: initialData.priority ?? defaultValues.priority,
        status: initialData.status ?? defaultValues.status,
        link: initialData.link ?? "",
        name: initialData.name ?? "",
        observation: initialData.observation ?? null,
      });
    }
  }, [initialData, reset, defaultValues]);

  const onSubmit = async (data: TaskCreateForm | TaskUpdateForm) => {
    try {
      if (isEditMode && initialData) {
        await updateTask.mutateAsync({ ...(data as TaskUpdateForm), id: initialData.id });
      } else {
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
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 z-10">
        {/* top stripe */}
        <div
          className={clsx(
            "absolute top-0 left-0 right-0 h-2 rounded-t-2xl",
            "bg-gradient-to-r from-green-500 via-teal-600 to-green-500"
          )}
        />

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditMode ? "Editar Tarefa" : "Nova Tarefa"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              {...register("title")}
              className="mt-1 w-full bg-white/80 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="mt-1 w-full bg-white/80 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Cliente e Setor lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cliente
              </label>
              <input
                type="text"
                {...register("client")}
                className="mt-1 w-full bg-white/80 border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-300 focus:outline-none transition"
              />
              {errors.client && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.client.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Setor
              </label>
              <select
                {...register("sector")}
                className="mt-1 w-full bg-white/80 border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-300 focus:outline-none transition"
              >
                <option value="">Selecione um setor</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Web">Web</option>
                <option value="Tráfego">Tráfego</option>
                <option value="Copy">Copy</option>
              </select>
              {errors.sector && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.sector.message}
                </p>
              )}
            </div>
          </div>

          {/* Responsável */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome do Responsável
            </label>
            <input
              type="text"
              {...register("name")}
              className="mt-1 w-full bg-white/80 border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-300 focus:outline-none transition"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Início
              </label>
              <input
                type="date"
                {...register("start_date")}
                className="mt-1 w-full bg-white/80 border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-300 focus:outline-none transition"
              />
              {errors.start_date && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.start_date.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vencimento
              </label>
              <input
                type="date"
                {...register("due_date")}
                className="mt-1 w-full bg-white/80 border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-300 focus:outline-none transition"
              />
              {errors.due_date && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.due_date.message}
                </p>
              )}
            </div>
          </div>

          {/* Prioridade & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prioridade
              </label>
              <select
                {...register("priority")}
                className="mt-1 w-full bg-white/80 border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-300 focus:outline-none transition"
              >
                <option value="Baixa">🟡 Baixa</option>
                <option value="Média">🟠 Média</option>
                <option value="Alta">🔴 Alta</option>
              </select>
              {errors.priority && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.priority.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                {...register("status")}
                className="mt-1 w-full bg-white/80 border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-300 focus:outline-none transition"
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
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Link (opcional)
            </label>
            <input
              type="url"
              {...register("link")}
              className="mt-1 w-full bg-white/80 border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-300 focus:outline-none transition"
              placeholder="https://exemplo.com"
            />
            {errors.link && (
              <p className="text-xs text-red-500 mt-1">
                {errors.link.message}
              </p>
            )}
          </div>

          {/* Ações */}
          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition disabled:opacity-50 cursor-pointer"
            >
              {isEditMode ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
