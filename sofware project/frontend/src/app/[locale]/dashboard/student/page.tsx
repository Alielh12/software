"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function StudentDashboardPage() {
  const t = useTranslations("dashboard.student");
  const { user } = useAuth();

  return (
    <div className="flex">
      <Sidebar role="STUDENT" />
      <div className="ml-64 flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {t("title")}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          {t("welcome")}, {user?.firstName}!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Schedule an appointment or view your records.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

