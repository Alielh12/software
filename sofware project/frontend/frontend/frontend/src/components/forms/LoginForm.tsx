"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter, useLocale } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const locale = useLocale();
  const { login: setAuthUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuthUser(data.user);
      // Set token in HttpOnly cookie (handled by backend)
      // For client-side storage if needed:
      if (data.token) {
        document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Strict`;
      }
      router.push(`/${locale}/dashboard`);
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      alert(error.response?.data?.error || t("loginError"));
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t("loginTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label={t("email")}
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label={t("password")}
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />

          <div className="flex items-center justify-between">
            <a href="#" className="text-sm text-primary-600 hover:underline">
              {t("forgotPassword")}
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={mutation.isPending}
          >
            {t("login")}
          </Button>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            {t("noAccount")}{" "}
            <a href={`/${locale}/register`} className="text-primary-600 hover:underline">
              {t("register")}
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

