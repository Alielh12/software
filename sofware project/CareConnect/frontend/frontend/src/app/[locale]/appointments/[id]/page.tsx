"use client";

import React from "react";
import { useParams, useLocale } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getAppointmentById } from "@/lib/api/appointments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { format } from "date-fns";

export default function AppointmentDetailPage() {
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations("appointments");
  const id = params.id as string;

  const { data: appointment, isLoading } = useQuery({
    queryKey: ["appointment", id],
    queryFn: () => getAppointmentById(id),
  });

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!appointment) {
    return <div className="container mx-auto px-4 py-8">Appointment not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href={`/${locale}/appointments`}>
        <Button variant="secondary" className="mb-6">← Back</Button>
      </Link>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>Appointment Details</CardTitle>
            <Badge>{t(appointment.status.toLowerCase())}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">{t("date")}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {format(new Date(appointment.date), "PPP 'at' p")}
              </p>
            </div>
            {appointment.reason && (
              <div>
                <h3 className="font-semibold mb-1">{t("reason")}</h3>
                <p className="text-gray-600 dark:text-gray-400">{appointment.reason}</p>
              </div>
            )}
            {appointment.notes && (
              <div>
                <h3 className="font-semibold mb-1">{t("notes")}</h3>
                <p className="text-gray-600 dark:text-gray-400">{appointment.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

