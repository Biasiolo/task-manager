// useUsers.ts
import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/supabaseClient";

// Hook customizado para buscar usuários
export function useUsers() {
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from("profiles").select("id, name");
        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        setError("Erro ao buscar usuários");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
}
