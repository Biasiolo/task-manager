// src/integrations/supabase/types.ts

/**
 * Este arquivo descreve o esquema do seu banco Supabase, na versão "public".
 * Ajustado para corresponder corretamente à tabela "tasks" conforme seu schema atual.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/** Definição do objeto "Database" */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          id: string;
          name: string;
          role: string | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          id: string;
          name: string;
          role?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          id?: string;
          name?: string;
          role?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      task_assignments: {
        Row: {
          completed_at: string | null;
          created_at: string | null;
          id: string;
          is_completed: boolean | null;
          task_id: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string | null;
          id?: string;
          is_completed?: boolean | null;
          task_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string | null;
          id?: string;
          is_completed?: boolean | null;
          task_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "task_assignments_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          }
        ];
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          client: string | null;
          sector: string | null;
          start_date: string | null;
          due_date: string | null;
          priority: string | null;
          status: string | null;
          link: string | null;
          created_by: string | null;
          observation: string | null;
          completed_at: string | null;
          created_at: string | null;
          updated_at: string | null;
          user_id: string | null;
          name: string | null; // Novo campo adicionado para o nome do responsável
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          client?: string | null;
          sector?: string | null;
          start_date?: string | null;
          due_date?: string | null;
          priority?: string | null;
          status?: string | null;
          link?: string | null;
          created_by?: string | null;
          observation?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          user_id?: string | null;   // ID do responsável
          name?: string | null;      // Nome do responsável
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          client?: string | null;
          sector?: string | null;
          start_date?: string | null;
          due_date?: string | null;
          priority?: string | null;
          status?: string | null;
          link?: string | null;
          created_by?: string | null;
          observation?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          user_id?: string | null;   // ID do responsável
          name?: string | null;      // Nome do responsável
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

/** Facilita pegar diretamente a “Row” de qualquer tabela pública */
type DefaultSchema = Database[Extract<keyof Database, "public">];

/** Extrai apenas o tipo “Row” de determinada tabela ou view */
export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

/** Extrai apenas o tipo “Insert” de determinada tabela */
export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

/** Extrai apenas o tipo “Update” de determinada tabela */
export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

/** Extrai enums caso existam (não há em “public” por enquanto) */
export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

/** Extrai tipos compostos caso existam (não há em “public” por enquanto) */
export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

/** Constantes para enums (nenhum enum definido em “public”) */
export const Constants = {
  public: {
    Enums: {},
  },
} as const;
