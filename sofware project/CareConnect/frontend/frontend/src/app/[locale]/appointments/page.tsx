"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import { getAppointments } from "@/lib/api/appointments";
import { AppointmentCard } from "@/components/AppointmentCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function AppointmentsPage() {
  const t = useTranslations("appointments");
  const locale = useLocale();

  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Error loading appointments</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("title")}
        </h1>
        <Link href={`/${locale}/appointments/new`}>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            {t("newAppointment")}
          </Button>
        </Link>
      </div>

      {appointments && appointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onView={(id) => {
                window.location.href = `/${locale}/appointments/${id}`;
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">{t("noAppointments")}</p>
          <Link href={`/${locale}/appointments/new`}>
            <Button variant="primary">{t("newAppointment")}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

