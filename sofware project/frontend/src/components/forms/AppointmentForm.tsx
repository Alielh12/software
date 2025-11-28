"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter, useLocale } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAppointment } from "@/lib/api/appointments";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const appointmentSchema = z.object({
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  reason: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export function AppointmentForm() {
  const t = useTranslations("appointments");
  const router = useRouter();
  const locale = useLocale();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  const mutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      router.push(`/${locale}/appointments`);
    },
    onError: (error: any) => {
      console.error("Create appointment error:", error);
      alert(error.response?.data?.error || "Failed to create appointment");
    },
  });

  const onSubmit = (data: AppointmentFormData) => {
    // Combine date and time
    const dateTime = new Date(`${data.date}T${data.time}`);
    mutation.mutate({
      date: dateTime.toISOString(),
      reason: data.reason,
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t("scheduleAppointment")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t("date")}
              type="date"
              {...register("date")}
              error={errors.date?.message}
              min={new Date().toISOString().split("T")[0]}
            />

            <Input
              label={t("time")}
              type="time"
              {...register("time")}
              error={errors.time?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("reason")}
            </label>
            <textarea
              {...register("reason")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              rows={4}
              placeholder="Please describe the reason for your appointment..."
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.reason.message}
              </p>
            )}
          </div>

          <div className="flex space-x-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={mutation.isPending}
            >
              {t("scheduleAppointment")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

