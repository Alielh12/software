"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import axiosInstance from "@/lib/api/axios";
import { RecordCard } from "@/components/RecordCard";

export default function RecordsPage() {
  const t = useTranslations("records");

  const { data: records, isLoading } = useQuery({
    queryKey: ["records"],
    queryFn: async () => {
      const response = await axiosInstance.get("/patients/me/records");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {t("title")}
      </h1>

      {records && records.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((record: any) => (
            <RecordCard
              key={record.id}
              record={record}
              onView={(id) => {
                window.location.href = `/records/${id}`;
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">{t("noRecords")}</p>
        </div>
      )}
    </div>
  );
}

