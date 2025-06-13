// src/pages/Register.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../integrations/supabase/supabaseClient";
import { useNavigate } from "react-router-dom";

const RegisterSchema = z
  .object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    email: z.string().email({ message: "E-mail inválido" }),
    password: z.string().min(6, { message: "A senha deve ter ao menos 6 caracteres" }),
    confirm: z.string().min(6),
  })
  .refine((data) => data.password === data.confirm, {
    message: "As senhas não conferem",
    path: ["confirm"],
  });

type RegisterFormValues = z.infer<typeof RegisterSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          // Grava o nome em user_metadata
          data: { name: data.name },
          emailRedirectTo: window.location.origin + "/dashboard",
        },
      });

      if (error) {
        setAuthError(error.message);
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setAuthError("Erro inesperado. Tente novamente.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">Cadastrar</h1>

        {authError && (
          <div className="mb-4 text-sm text-red-600 text-center">{authError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium">Nome</label>
            <input
              type="text"
              {...register("name")}
              className={`mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-400 focus:ring-red-200"
                  : "border-gray-300 focus:ring-green-200"
              }`}
              placeholder="Seu nome completo"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-sm font-medium">E-mail</label>
            <input
              type="email"
              {...register("email")}
              className={`mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-400 focus:ring-red-200"
                  : "border-gray-300 focus:ring-green-200"
              }`}
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium">Senha</label>
            <input
              type="password"
              {...register("password")}
              className={`mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-400 focus:ring-red-200"
                  : "border-gray-300 focus:ring-green-200"
              }`}
              placeholder="********"
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirmação */}
          <div>
            <label className="block text-sm font-medium">Confirme a Senha</label>
            <input
              type="password"
              {...register("confirm")}
              className={`mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.confirm
                  ? "border-red-400 focus:ring-red-200"
                  : "border-gray-300 focus:ring-green-200"
              }`}
              placeholder="********"
            />
            {errors.confirm && (
              <p className="text-xs text-red-600 mt-1">{errors.confirm.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem conta?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}
