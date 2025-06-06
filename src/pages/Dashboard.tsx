import React, { useState, useMemo } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useTasks } from "../features/tasks/useTasks";
import { TaskCard } from "../features/tasks/TaskCard";
import { TaskModal } from "../features/tasks/TaskModal";
import { TaskFilters, FilterValues } from "../features/tasks/TaskFilters";
import { WeeklyView } from "../features/tasks/WeeklyView";

export default function Dashboard() {
  const {
    data: tasks = [],
    isLoading,
    error,
    deleteTask,
  } = useTasks();

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [filters, setFilters] = useState<FilterValues>({
    sector: "",
    priority: "",
    user: "",

    date: "",
    client: "",
  });

   const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.sector && task.sector !== filters.sector) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      // antes usava task.user_id, agora compara com task.name
      if (filters.user && task.name !== filters.user) return false;
      if (filters.client && task.client !== filters.client) return false;
      return true;
    });
  }, [tasks, filters]);

  const openNewModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task: any) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const openShareModal = (task: any) => {
    console.log("Compartilhar", task);
  };

  const handleDelete = (taskId: string) => {
    deleteTask.mutate(taskId);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Dashboard de Tarefas</h2>
        <button
          onClick={openNewModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nova Tarefa
        </button>
      </div>

      {/* Filtros */}
      <TaskFilters onFilter={setFilters} />

      {/* Visão Semanal */}
      <section className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Visão Semanal</h3>
        <WeeklyView
          tasks={filteredTasks}
          onEdit={openEditModal}
          onShare={openShareModal}
          onDelete={handleDelete}
        />
      </section>

      {/* Lista Geral (cards) */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div>Carregando tarefas...</div>
        ) : error ? (
          <div>Erro ao carregar tarefas.</div>
        ) : filteredTasks.length === 0 ? (
          <div>Nenhuma tarefa encontrada.</div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEditModal}
              onShare={openShareModal}
              onDelete={handleDelete}
            />
          ))
        )}
      </section>

      {/* Modal de Criar/Editar */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingTask}
      />
    </DashboardLayout>
  );
}
