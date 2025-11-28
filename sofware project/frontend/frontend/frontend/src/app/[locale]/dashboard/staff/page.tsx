"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function StaffDashboardPage() {
  const t = useTranslations("dashboard.staff");

  return (
    <div className="flex">
      <Sidebar role="NURSE" />
      <div className="ml-64 flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {t("title")}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">Staff dashboard content</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

