import { Locale, resolveMessage } from "@/lib/i18n/messages";

type FooterProps = {
  locale: Locale;
};

const Footer = ({ locale }: FooterProps) => (
  <footer className="bg-slate-900 text-slate-100 mt-20">
    <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-semibold">CareConnect</p>
        <p className="text-sm text-slate-300">{resolveMessage(locale, 'tagline')}</p>
      </div>
      <p className="text-xs text-slate-400"> {new Date().getFullYear()} CareConnect Health Center</p>
    </div>
  </footer>
);

export default Footer;
