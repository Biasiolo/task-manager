import React, { useState, useMemo } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useTasks } from "../features/tasks/useTasks";
import { TaskCard } from "../features/tasks/TaskCard";
import { TaskModal } from "../features/tasks/TaskModal";
import { TaskFilters, FilterValues } from "../features/tasks/TaskFilters";
import { WeeklyView } from "../features/tasks/WeeklyView";
import { addDays, startOfWeek, isWithinInterval } from "date-fns";

export default function Dashboard() {
  const { data: tasks = [], isLoading, error, deleteTask } = useTasks();

  // filtros gerais
  const [filters, setFilters] = useState<FilterValues>({
    sector: "",
    priority: "",
    user: "",
    client: "",
    date: "",
  });

  // modal criar/editar
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);

  // **semana ativa** (começando na segunda-feira)
  const [weekStart, setWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  // tasks já aplicando filtros de TaskFilters
  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.sector && task.sector !== filters.sector) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.user && task.name !== filters.user) return false;
      if (filters.client && task.client !== filters.client) return false;
      return true;
    });
  }, [tasks, filters]);

  // tasks da semana ativa (filtra por due_date entre weekStart e weekStart+6)
  const weekTasks = useMemo(() => {
    const weekEnd = addDays(weekStart, 6);
    return filtered.filter((task) => {
      if (!task.due_date) return false;
      const due = new Date(task.due_date);
      return isWithinInterval(due, { start: weekStart, end: weekEnd });
    });
  }, [filtered, weekStart]);

  // handlers
  const openNew = () => { setEditingTask(null); setModalOpen(true); };
  const openEdit = (t: any) => { setEditingTask(t); setModalOpen(true); };
  const handleDelete = (id: string) => deleteTask.mutate(id);

  return (
    <DashboardLayout>
      {/* cabeçalho e botão + Nova Tarefa */}
      <div className="flex items-center justify-between mb-6 ">
        <h2 className="text-2xl font-bold">Dashboard de Tarefas</h2>
        <button
          onClick={openNew}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nova Tarefa
        </button>
      </div>

      {/* filtros */}
      <TaskFilters tasks={tasks} onFilter={setFilters} />

      {/* visão semanal */}
      <section className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Visão Semanal</h3>
        <WeeklyView
          tasks={filtered}               // passa só as filtradas
          onEdit={openEdit}
          onShare={() => {}}
          onDelete={handleDelete}
          onWeekChange={setWeekStart}    // callback para atualizar semana
          weekStart={weekStart}          // a semana atual
        />
      </section>

      {/* grid de cards PARA A MESMA SEMANA */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div>Carregando tarefas...</div>
        ) : error ? (
          <div>Erro ao carregar tarefas.</div>
        ) : weekTasks.length === 0 ? (
          <div>Nenhuma tarefa programada para esta semana.</div>
        ) : (
          weekTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEdit}
              onShare={() => {}}
              onDelete={handleDelete}
            />
          ))
        )}
      </section>

      {/* modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingTask}
      />
    </DashboardLayout>
  );
}
