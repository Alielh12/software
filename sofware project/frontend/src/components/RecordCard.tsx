"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, User, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PatientRecord } from "@/types/record";
import { format } from "date-fns";

interface RecordCardProps {
  record: PatientRecord;
  onView?: (id: string) => void;
}

export function RecordCard({ record, onView }: RecordCardProps) {
  const t = useTranslations("records");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("records")} - {format(new Date(record.createdAt), "PPP")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(record.createdAt), "PPP 'at' p")}</span>
          </div>
          {record.doctor && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <User className="w-4 h-4" />
              <span>
                Dr. {record.doctor.firstName} {record.doctor.lastName}
              </span>
            </div>
          )}
          {record.diagnosis && (
            <div className="flex items-start space-x-2 text-sm">
              <FileText className="w-4 h-4 mt-0.5" />
              <div>
                <span className="font-medium">{t("diagnosis")}:</span>
                <p className="text-gray-600 dark:text-gray-400">{record.diagnosis}</p>
              </div>
            </div>
          )}
        </div>
        {onView && (
          <div className="mt-4">
            <Button variant="primary" size="sm" onClick={() => onView(record.id)}>
              {t("viewRecord")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

