"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Moon, Sun, Menu, X, Globe } from "lucide-react";
import { useTheme } from "next-themes";

export function Navbar() {
  const t = useTranslations("common");
  const locale = useLocale();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const changeLanguage = (lang: string) => {
    window.location.href = `/${lang}${window.location.pathname.slice(3)}`;
  };

  const locales = [
    { code: "en", name: "English" },
    { code: "ar", name: "العربية" },
    { code: "fr", name: "Français" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href={`/${locale}`} className="text-xl font-bold text-primary-600 dark:text-primary-400">
            CareConnect
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link href={`/${locale}/dashboard`} className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t("dashboard")}
                </Link>
                <Link href={`/${locale}/appointments`} className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t("appointments")}
                </Link>
                <Link href={`/${locale}/records`} className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t("records")}
                </Link>
                <Link href={`/${locale}/chatbot`} className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t("chatbot")}
                </Link>
              </>
            ) : (
              <>
                <Link href={`/${locale}/login`} className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t("login")}
                </Link>
                <Link href={`/${locale}/register`}>
                  <Button variant="primary" size="sm">
                    {t("register")}
                  </Button>
                </Link>
              </>
            )}

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <Globe className="w-5 h-5" />
                <span className="uppercase">{locale}</span>
              </button>
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1">
                  {locales.map((loc) => (
                    <button
                      key={loc.code}
                      onClick={() => {
                        changeLanguage(loc.code);
                        setIsLangMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated && (
              <>
                <span className="text-gray-700 dark:text-gray-300">
                  {user?.firstName} {user?.lastName}
                </span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  {t("logout")}
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
