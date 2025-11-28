"use client";

import Link from "next/link";
import { Locale, resolveMessage } from "@/lib/i18n/messages";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

type NavbarProps = {
  locale: Locale;
};

const Navbar = ({ locale }: NavbarProps) => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href={`/${locale}`} className="text-xl font-semibold text-primary">
          CareConnect
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href={`/${locale}/student`} className="hover:text-primary">
            {resolveMessage(locale, "studentPortal")}
          </Link>
          <Link href={`/${locale}/staff`} className="hover:text-primary">
            {resolveMessage(locale, "staffDashboard")}
          </Link>
          <LanguageSwitcher activeLocale={locale} />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
