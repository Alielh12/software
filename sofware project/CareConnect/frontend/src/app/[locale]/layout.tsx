import { ReactNode } from "react";
import { Locale, supportedLocales } from "@/lib/i18n/messages";
import MainLayout from "@/components/layout/MainLayout";
import { notFound } from "next/navigation";

type LocaleLayoutProps = {
  children: ReactNode;
  params: { locale: Locale };
};

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

const LocaleLayout = ({ children, params }: LocaleLayoutProps) => {
  const { locale } = params;
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <MainLayout locale={locale}>{children}</MainLayout>
      </body>
    </html>
  );
};

export default LocaleLayout;
