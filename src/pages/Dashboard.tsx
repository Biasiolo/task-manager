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
      <div className="min-h-screen bg-neutral-950 p-6">
        {/* Container principal com design mais sofisticado */}
        <div className="max-w-full mx-auto space-y-8">
          
          {/* Cabeçalho principal */}
          <div className="bg-neutral-100 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
                  Dashboard de Tarefas
                </h1>
                <p className="text-slate-500 font-light">
                  Gerencie suas atividades com eficiência
                </p>
              </div>
              
              <button
                onClick={openNew}
                className="group relative cursor-pointer bg-teal-700 hover:bg-slate-700 text-white px-6 py-3 rounded-xl 
                         font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5
                         border border-slate-700/20"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nova Tarefa
                </span>
              </button>
            </div>
          </div>

          {/* Seção de filtros com design refinado */}
          <div className="bg-neutral-100 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6">
            <TaskFilters tasks={tasks} onFilter={setFilters} />
          </div>

          {/* Visão semanal com header melhorado */}
          <div className="bg-white backdrop-blur-sm rounded-3xl shadow-sm  overflow-hidden">
            <div className="bg-teal-700 px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-orange-400 rounded-full"></div>
                <h2 className="text-xl font-semibold text-white">Visão Semanal</h2>
              </div>
            </div>
            
            <div className="p-8">
              <WeeklyView
                tasks={filtered}
                onEdit={openEdit}
                onShare={() => {}}
                onDelete={handleDelete}
                onWeekChange={setWeekStart}
                weekStart={weekStart}
              />
            </div>
          </div>

          {/* Grid de cards com espaçamento aprimorado */}
          <div className="bg-white backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-8">
          
            <div className="flex items-center gap-3 mb-6 ">
              <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
              <h3 className="text-xl font-medium text-slate-800">Tarefas da Semana</h3>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                  <span className="font-medium">Carregando tarefas...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-600 font-medium">Erro ao carregar tarefas</p>
                  <p className="text-slate-400 text-sm">Tente novamente em alguns instantes</p>
                </div>
              </div>
            ) : weekTasks.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-600 font-medium text-lg">Nenhuma tarefa programada</p>
                    <p className="text-slate-400">Não há tarefas para esta semana ainda</p>
                  </div>
                  <button
                    onClick={openNew}
                    className="inline-flex cursor-pointer items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Criar primeira tarefa
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {weekTasks.map((task) => (
                  <div key={task.id} className="transform transition-all duration-200 hover:scale-[1.02]">
                    <TaskCard
                      task={task}
                      onEdit={openEdit}
                      onShare={() => {}}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          initialData={editingTask}
        />
      </div>
    </DashboardLayout>
  );
}