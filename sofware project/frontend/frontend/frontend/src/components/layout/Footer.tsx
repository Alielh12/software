"use client";

import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export function Footer() {
  const t = useTranslations("common");
  const locale = useLocale();

  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">CareConnect</h3>
            <p className="text-gray-400 text-sm">
              University Health Center Management System
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/dashboard`} className="text-gray-400 hover:text-white">
                  {t("dashboard")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/appointments`} className="text-gray-400 hover:text-white">
                  {t("appointments")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/records`} className="text-gray-400 hover:text-white">
                  {t("records")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400 text-sm">
              Email: health@university.edu
              <br />
              Phone: +1 (555) 123-4567
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} CareConnect. All rights reserved.</p>
          <p className="mt-2">GDPR Compliant • HIPAA Compliant • Secure & Private</p>
        </div>
      </div>
    </footer>
  );
}
