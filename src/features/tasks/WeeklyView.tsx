// src/features/tasks/WeeklyView.tsx

import React, { useEffect, useState } from "react";
import {
  format,
  addDays,
  subDays,
  isSameDay,
  isValid,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Avatar from "@radix-ui/react-avatar";
import { supabase } from "../../integrations/supabase/supabaseClient";
import { Task } from "./useTasks";
import { ChevronLeft, ChevronRight, User, CheckCircle2, Clock, Trash2 } from "lucide-react";
import clsx from "clsx";

interface WeeklyViewProps {
  tasks: Task[];
  weekStart: Date;
  onWeekChange: (newStart: Date) => void;
  onEdit: (task: Task) => void;
  onShare: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function WeeklyView({
  tasks,
  weekStart,
  onWeekChange,
  onEdit,
  onShare,
  onDelete,
}: WeeklyViewProps) {
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});

  const baseDate = isValid(weekStart) ? weekStart : new Date();
  const days = Array.from({ length: 7 }).map((_, i) =>
    addDays(baseDate, i)
  );

  const prev = () => onWeekChange(subDays(baseDate, 7));
  const next = () => onWeekChange(addDays(baseDate, 7));

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id,name")
      .then(({ data }) => {
        if (data) {
          const m: any = {};
          data.forEach((u) => {
            m[u.id] = u.name;
          });
          setUserNames(m);
        }
      });
  }, []);

  const today = new Date();

  return (
    <Tooltip.Provider delayDuration={200}>
      <div className="space-y-6">
        {/* Header Navigation */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md shadow-neutral-500 border-none">
          <button
            onClick={prev}
            className="flex items-center cursor-pointer  gap-2 px-6 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 hover:text-teal-800 transition-all duration-200 border border-teal-600 hover:border-teal-300"
          >
            <ChevronLeft size={16} />
            <span className="font-medium">Anterior</span>
          </button>

          <div className="text-center">
            <h4 className="text-xl font-bold text-gray-900">
              {isValid(days[0]) && isValid(days[6])
                ? `${format(days[0], "dd/MM", { locale: ptBR })} – ${format(days[6], "dd/MM/yyyy", { locale: ptBR })}`
                : "—/— – —/—"}
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              Visão Semanal
            </p>
          </div>

          <button
            onClick={next}
            className="flex cursor-pointer items-center gap-2 px-6 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 hover:text-teal-800 transition-all duration-200 border border-teal-600 hover:border-teal-300"
          >
            <span className="font-medium">Próxima</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Calendar Grid */}
        <ScrollArea.Root className="w-full overflow-hidden rounded-2xl border-none  shadow-md shadow-neutral-500">
          <ScrollArea.Viewport>
            <div className="grid grid-cols-7 gap-3 p-4 min-w-max">
              {days.map((day) => {
                const dayTasks = tasks
                  .filter((t) => t.due_date && isSameDay(new Date(t.due_date), day))
                  .filter((t) => t.status !== "Concluída");  // remove concluídas

                const isToday = isSameDay(day, today);
                const completedTasks = dayTasks.filter(t => t.status === "Concluída").length;
                const totalTasks = dayTasks.length;

                return (
                  <div
                    key={day.toISOString()}
                    className={clsx(
                      "flex flex-col bg-white rounded-xl shadow-md shadow-neutral-500 border-none transition-all duration-300 hover:shadow-md min-h-[200px]",
                      isToday && "ring-2 ring-white ring-opacity-50 border-blue-200"
                    )}
                  >
                    {/* Day Header */}
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <div className={clsx(
                          "px-3 py-2 rounded-t-xl text-center text-sm font-semibold cursor-default relative border-none",
                          isToday
                            ? "bg-orange-500 text-white"
                            : "bg-teal-700 text-white"
                        )}>
                          {isValid(day) ? (
                            <>
                              <div className="text-xs opacity-90">
                                {format(day, "EEE", { locale: ptBR }).toUpperCase()}
                              </div>
                              <div className="text-lg font-bold">
                                {format(day, "dd", { locale: ptBR })}
                              </div>
                            </>
                          ) : (
                            "-- --"
                          )}

                          {/* Task counter badge */}
                          {totalTasks > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                              {totalTasks}
                            </div>
                          )}
                        </div>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          side="top"
                          className="px-3 py-2 rounded-lg bg-orange-100 text-gray-900 text-sm shadow-lg border-none mb-2"
                        >
                          {isValid(day)
                            ? format(day, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                            : "Data inválida"}
                          {totalTasks > 0 && (
                            <div className="mt-1 text-xs opacity-90">
                              {totalTasks} pendente(s)
                            </div>
                          )}
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>

                    {/* Tasks Container */}
                    <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                      {dayTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                          <Clock size={24} className="mb-2 opacity-50" />
                          <p className="text-xs text-center">Nenhuma tarefa</p>
                        </div>
                      ) : (
                        dayTasks.map((t) => {
                          const isDone = t.status === "Concluída";

                          return (
                            <div
                              key={t.id}
                              onClick={() => onEdit(t)}
                              className={clsx(
                                "py-2 px-4 rounded-lg cursor-pointer transition-all duration-200 border-none group relative overflow-hidden",
                                isDone
                                  ? "bg-green-50 hover:bg-green-100"
                                  : "bg-white shadow-md shadow-neutral-500 hover:bg-orange-100  hover:shadow-sm"
                              )}
                            >
                              {/* Priority indicator bar */}
                              <div
                                className={clsx(
                                  "absolute top-0 left-0 right-0 h-2 rounded-t-lg",
                                  t.priority === "Alta" && "bg-red-600/60",
                                  t.priority === "Média" && "bg-orange-400/70",
                                  t.priority === "Baixa" && "bg-yellow-300/70"
                                )}
                              />

                              {/* Task Title */}
                              <div className="flex items-start gap-2 m-2">
                                {isDone && (
                                  <CheckCircle2 size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                                )}
                                <h5
                                  className={clsx(
                                    "font-semibold text-sm leading-tight flex-1",
                                    isDone
                                      ? "line-through text-gray-500"
                                      : "text-gray-900"
                                  )}
                                >
                                  {t.title}
                                </h5>
                              </div>

                              {/* Assignee */}
                              <div className="flex items-center gap-2 mb-2">
                                <Avatar.Root className="w-6 h-6 overflow-hidden rounded-full bg-gradient-to-br from-stone-300 via-gray-200 to-stone-400 flex items-center justify-center">
                                  <Avatar.Fallback
                                    delayMs={600}
                                    className="w-full h-full flex items-center justify-center text-[10px] font-bold text-black"
                                  >
                                    {(() => {
                                      const name = t.name ?? "";
                                      const parts = name.trim().split(" ");
                                      if (parts.length === 1) {
                                        return parts[0].charAt(0).toUpperCase();
                                      }
                                      return (
                                        parts[0].charAt(0) +
                                        parts[parts.length - 1].charAt(0)
                                      ).toUpperCase();
                                    })()}
                                  </Avatar.Fallback>
                                </Avatar.Root>
                                <span className={clsx(
                                  "text-xs font-medium flex-1",
                                  isDone ? "text-gray-400" : "text-gray-700"
                                )}>
                                  {t.name ?? "Não atribuído"}
                                </span>
                              </div>

                              {/* Footer */}
                              <div className="flex justify-between items-center">
                                <span
                                  className={clsx(
                                    "text-xs font-medium px-2 py-1 rounded-full",
                                    t.priority === "Alta" && (isDone ? "bg-gray-100 text-gray-400" : "bg-red-100 text-red-400"),
                                    t.priority === "Média" && (isDone ? "bg-gray-100 text-gray-400" : "bg-orange-100 text-orange-500"),
                                    t.priority === "Baixa" && (isDone ? "bg-gray-100 text-gray-400" : "bg-yellow-100 text-yellow-600")
                                  )}
                                >
                                  {t.priority}
                                </span>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(t.id);
                                  }}
                                  className={clsx(
                                    "p-1.5 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100",
                                    isDone
                                      ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                      : "text-red-400 hover:text-red-600 hover:bg-red-50"
                                  )}
                                  title="Excluir tarefa"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea.Viewport>

          <ScrollArea.Scrollbar
            orientation="horizontal"
            className="flex touch-none p-0.5 bg-gray-100 rounded-b-2xl"
          >
            <ScrollArea.Thumb className="flex-1 bg-gray-400 rounded-full opacity-50 hover:opacity-75 transition-opacity" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>
    </Tooltip.Provider>
  );
}