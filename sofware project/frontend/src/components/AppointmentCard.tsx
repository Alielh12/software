"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, User, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Appointment } from "@/types/appointment";
import { format } from "date-fns";

interface AppointmentCardProps {
  appointment: Appointment;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export function AppointmentCard({
  appointment,
  onView,
  onEdit,
  onCancel,
}: AppointmentCardProps) {
  const t = useTranslations("appointments");

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    CONFIRMED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    COMPLETED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {t("appointments")} #{appointment.id.slice(0, 8)}
          </CardTitle>
          <Badge className={statusColors[appointment.status]}>
            {t(appointment.status.toLowerCase())}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(appointment.date), "PPP")}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{format(new Date(appointment.date), "p")}</span>
          </div>
          {appointment.reason && (
            <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <FileText className="w-4 h-4 mt-0.5" />
              <span>{appointment.reason}</span>
            </div>
          )}
          {appointment.doctor && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <User className="w-4 h-4" />
              <span>
                Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
              </span>
            </div>
          )}
        </div>
        <div className="flex space-x-2 mt-4">
          {onView && (
            <Button variant="ghost" size="sm" onClick={() => onView(appointment.id)}>
              {t("view")}
            </Button>
          )}
          {appointment.status === "PENDING" && onEdit && (
            <Button variant="secondary" size="sm" onClick={() => onEdit(appointment.id)}>
              {t("edit")}
            </Button>
          )}
          {appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED" && onCancel && (
            <Button variant="danger" size="sm" onClick={() => onCancel(appointment.id)}>
              {t("cancel")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

