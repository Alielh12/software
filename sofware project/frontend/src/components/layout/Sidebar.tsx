"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useLocale } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  AlertCircle,
  User,
} from "lucide-react";

interface SidebarProps {
  role?: "STUDENT" | "DOCTOR" | "NURSE" | "ADMIN";
}

export function Sidebar({ role = "STUDENT" }: SidebarProps) {
  const t = useTranslations("common");
  const pathname = usePathname();
  const locale = useLocale();

  const basePath = `/${locale}`;

  const studentMenu = [
    { href: `${basePath}/dashboard/student`, label: t("dashboard"), icon: LayoutDashboard },
    { href: `${basePath}/appointments`, label: t("appointments"), icon: Calendar },
    { href: `${basePath}/records`, label: t("records"), icon: FileText },
    { href: `${basePath}/chatbot`, label: t("chatbot"), icon: MessageSquare },
    { href: `${basePath}/emergency`, label: t("emergency"), icon: AlertCircle },
    { href: `${basePath}/settings`, label: t("settings"), icon: Settings },
  ];

  const staffMenu = [
    { href: `${basePath}/dashboard/${role.toLowerCase()}`, label: t("dashboard"), icon: LayoutDashboard },
    { href: `${basePath}/appointments`, label: t("appointments"), icon: Calendar },
    { href: `${basePath}/records`, label: t("records"), icon: FileText },
    { href: `${basePath}/chatbot`, label: t("chatbot"), icon: MessageSquare },
    { href: `${basePath}/settings`, label: t("settings"), icon: Settings },
  ];

  const menuItems = role === "STUDENT" ? studentMenu : staffMenu;

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-md min-h-screen fixed left-0 top-16">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

