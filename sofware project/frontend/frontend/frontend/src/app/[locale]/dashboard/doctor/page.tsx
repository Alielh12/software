"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function DoctorDashboardPage() {
  const t = useTranslations("dashboard.doctor");

  return (
    <div className="flex">
      <Sidebar role="DOCTOR" />
      <div className="ml-64 flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {t("title")}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary-600">0</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

