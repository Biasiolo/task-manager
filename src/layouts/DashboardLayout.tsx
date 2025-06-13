// src/layouts/DashboardLayout.tsx

import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/supabaseClient";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) return console.error("Erro ao obter usuário:", error);

      // Pega o nome salvo em user_metadata
      const nameFromMeta = (user.user_metadata as any)?.name;
      setUserName(nameFromMeta ?? "");
    }

    loadUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro ao deslogar:", error.message);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-950 text-white ">
        <div className="px-4 py-6">
          <h1 className="text-xl font-bold">Voia Tasks</h1>
        </div>
        <nav className="mt-8 px-4 flex flex-col space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-3 py-2 rounded ${
                isActive ? "bg-teal-600" : "hover:bg-orange-400"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/dashboard/tasks"
            className="px-3 py-2 rounded hover:bg-orange-400"
          >
            Minhas Tarefas
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-neutral-100">
        <header className="h-16 bg-neutral-950 text-white  px-6 flex items-center justify-between">
          <span className="font-medium">
            Bem-vindo{userName && <>, <strong>{userName}</strong></>}  
          </span>
          <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-600">
            Sair
          </button>
        </header>
        <main className="p-10 flex-1 overflow-y-auto bg-neutral-950">{children}</main>
      </div>
    </div>
  );
}
