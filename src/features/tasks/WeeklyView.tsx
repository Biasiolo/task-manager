import React, { useState, useEffect } from "react";
import { Task } from "./useTasks";
import { format, startOfWeek, addDays, subDays, isSameDay } from "date-fns";
import { supabase } from "../../integrations/supabase/supabaseClient";

interface WeeklyViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onShare: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function WeeklyView({ tasks, onEdit, onShare, onDelete }: WeeklyViewProps) {
  const [startDate, setStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({}); // Armazenar nomes dos usuários

  const days = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  const handleNextWeek = () => {
    setStartDate((prev) => addDays(prev, 7));
  };

  const handlePreviousWeek = () => {
    setStartDate((prev) => subDays(prev, 7));
  };

  // Carregar os nomes dos responsáveis (usuários) ao montar o componente
  useEffect(() => {
    const fetchUserNames = async () => {
      // Buscar os usuários do Supabase
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name");

      if (error) {
        console.error("Erro ao buscar usuários:", error);
        return;
      }

      // Mapear para um objeto com chave id e nome do usuário
      const names: { [key: string]: string } = {};
      data?.forEach((user: { id: string; name: string }) => {
        names[user.id] = user.name;
      });

      setUserNames(names);
    };

    fetchUserNames();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePreviousWeek}
          className="bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300"
        >
          ← Semana Anterior
        </button>
        <h4 className="text-md font-semibold">
          {format(days[0], "dd/MM/yyyy")} - {format(days[6], "dd/MM/yyyy")}
        </h4>
        <button
          onClick={handleNextWeek}
          className="bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300"
        >
          Próxima Semana →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-2">
        {days.map((day) => {
          const dayTasks = tasks.filter((task) => {
            if (!task.due_date) return false;
            return isSameDay(new Date(task.due_date), day);
          });

          return (
            <div key={day.toISOString()} className="bg-white rounded shadow-sm p-4">
              <div className="text-center text-sm font-semibold mb-2">
                {format(day, "EEEE dd/MM")}
              </div>
              <div className="space-y-2">
                {dayTasks.map((task) => {
                  const responsibleUserName = userNames[task.user_id || ""];

                  return (
                    <div
                      key={task.id}
                      className="bg-blue-50 text-xs p-2 rounded cursor-pointer hover:bg-blue-100"
                      onClick={() => onEdit(task)}
                    >
                      <div className="font-medium">{task.title}</div>
                      {task.priority && (
                        <div
                          className={`text-xs mt-1 ${
                            task.priority === "Alta"
                              ? "text-red-600"
                              : task.priority === "Média"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {task.priority}
                        </div>
                      )}
                      {/* Exibindo o nome do responsável */}
                      {task.user_id && responsibleUserName && (
                        <div className="text-xs text-gray-500 mt-1">
                          Responsável: {responsibleUserName}
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <button
                          className="text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task.id);
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
