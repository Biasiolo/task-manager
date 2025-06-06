import React from "react";
import { NavLink } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="px-4 py-6">
          <h1 className="text-xl font-bold">Voia Tasks</h1>
        </div>
        <nav className="mt-8 px-4 flex flex-col space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-3 py-2 rounded ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink to="/dashboard/tasks" className="px-3 py-2 rounded hover:bg-gray-100">
            Minhas Tarefas
          </NavLink>
          {/* Outras rotas se necessário */}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header */}
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
          <span>Bem-vindo, Usuário</span>
          <button
            onClick={() => {
              // logout no Supabase
            }}
            className="text-sm text-red-500"
          >
            Sair
          </button>
        </header>

        {/* Conteúdo principal */}
        <main className="p-6 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
