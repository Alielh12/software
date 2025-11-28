"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Phone, AlertCircle } from "lucide-react";

export default function EmergencyPage() {
  const t = useTranslations("common");

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto border-red-500 border-2">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <CardTitle className="text-red-600">Emergency</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-lg">
              If this is a medical emergency, please call:
            </p>
            <div className="flex items-center space-x-4">
              <Phone className="w-6 h-6 text-primary-600" />
              <a href="tel:911" className="text-2xl font-bold text-primary-600">
                911
              </a>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              For non-emergency health concerns, please contact the health center
              during business hours or schedule an appointment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

