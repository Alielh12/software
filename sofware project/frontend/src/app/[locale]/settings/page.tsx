"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const t = useTranslations("common");
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {t("settings")}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
              <p className="font-medium">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
              <p className="font-medium">{user?.role}</p>
            </div>
            <Button variant="primary">Update Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

