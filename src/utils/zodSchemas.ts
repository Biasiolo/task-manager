// src/utils/zodSchemas.ts
import { z } from "zod";

export const TaskCreateSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().optional().nullable(),
  client:   z.string().optional().nullable(),
  sector:   z.string().min(1, "Setor obrigatório"),
  start_date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Data de início inválida" }),
  due_date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Data de vencimento inválida" }),
  priority: z.enum(["Baixa", "Média", "Alta"]),
  status:   z.enum(["Pendente", "Concluída"]),

  // Aqui: aceitar "", null ou undefined e só validar URL se houver texto
  link: z
    .string()
    .optional()

    
    .nullable()
    .transform((val) => (val === "" ? null : val)),

  name:    z.string().min(1, "Nome do responsável obrigatório"),
  user_id: z.string().uuid().optional().nullable(),
});

export type TaskCreateForm = z.infer<typeof TaskCreateSchema>;

export const TaskUpdateSchema = TaskCreateSchema.extend({
  id: z.string().uuid(),
});
export type TaskUpdateForm = z.infer<typeof TaskUpdateSchema>;
