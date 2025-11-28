import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Locale } from "@/lib/i18n/messages";

type MainLayoutProps = {
  children: ReactNode;
  locale: Locale;
};

const MainLayout = ({ children, locale }: MainLayoutProps) => (
  <div className="flex min-h-screen flex-col bg-slate-50">
    <Navbar locale={locale} />
    <main className="flex-1">
      <div className="mx-auto max-w-6xl px-6 py-12">{children}</div>
    </main>
    <Footer locale={locale} />
  </div>
);

export default MainLayout;
