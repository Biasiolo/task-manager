import { useEffect, useState } from "react";
import { supabase } from "../../integrations/supabase/supabaseClient";

export function useAuth() {
  const [session, setSession] = useState(supabase.auth.getSession());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });
    // verificar ao montar
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });
  }, []);

  return { session, isLoading };
}
