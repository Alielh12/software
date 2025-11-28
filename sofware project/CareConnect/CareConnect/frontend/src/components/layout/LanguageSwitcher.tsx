"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { supportedLocales, Locale } from "@/lib/i18n/messages";

const LanguageSwitcher = ({ activeLocale }: { activeLocale: Locale }) => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  segments[0] = activeLocale;

  return (
    <div className="flex items-center gap-2">
      {supportedLocales.map((locale) => {
        const href = `/${[locale, ...segments.slice(1)].join('/')}`.replace(/\/+/, '/');
        const isActive = locale === activeLocale;
        return (
          <Link
            key={locale}
            href={href}
            className={`text-xs uppercase tracking-wide ${isActive ? 'text-primary font-semibold' : 'text-slate-500'}`}
          >
            {locale}
          </Link>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
