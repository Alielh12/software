"use client";

import { redirect } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === "STUDENT") {
    redirect("/dashboard/student");
  } else if (user?.role === "DOCTOR") {
    redirect("/dashboard/doctor");
  } else if (user?.role === "NURSE" || user?.role === "ADMIN") {
    redirect("/dashboard/staff");
  }

  redirect("/login");
}

