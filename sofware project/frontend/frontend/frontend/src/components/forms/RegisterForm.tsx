"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter, useLocale } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { register as registerUser } from "@/lib/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const locale = useLocale();
  const { login: setAuthUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setAuthUser(data.user);
      if (data.token) {
        document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Strict`;
      }
      router.push(`/${locale}/dashboard`);
    },
    onError: (error: any) => {
      console.error("Register error:", error);
      alert(error.response?.data?.error || t("registerError"));
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    mutation.mutate({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: "STUDENT",
    });
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t("registerTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t("firstName")}
              {...register("firstName")}
              error={errors.firstName?.message}
            />
            <Input
              label={t("lastName")}
              {...register("lastName")}
              error={errors.lastName?.message}
            />
          </div>

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

          <Input
            label={t("confirmPassword")}
            type="password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={mutation.isPending}
          >
            {t("register")}
          </Button>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            {t("hasAccount")}{" "}
            <a href={`/${locale}/login`} className="text-primary-600 hover:underline">
              {t("login")}
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

