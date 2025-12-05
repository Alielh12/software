import { Locale, resolveMessage } from "@/lib/i18n/messages";

type LocalePageProps = {
  params: { locale: Locale };
};

const LocaleLanding = ({ params }: LocalePageProps) => {
  const { locale } = params;
  return (
    <section className="space-y-10">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.4em] text-primary">CareConnect</p>
        <h1 className="text-4xl font-bold tracking-tight">
          {resolveMessage(locale, 'tagline')}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Integrated urgent care, preventive medicine, mental health, and telehealth services designed
          for busy students and clinicians.
        </p>
        <div className="flex gap-3">
          <a className="px-4 py-2 rounded-md bg-primary text-white" href={`/${locale}/student`}>
            {resolveMessage(locale, 'heroCta')}
          </a>
          <a className="px-4 py-2 rounded-md border border-slate-300" href={`/${locale}/staff`}>
            {resolveMessage(locale, 'staffDashboard')}
          </a>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {['Appointments', 'Lab Results', 'Emergency Chat'].map((card) => (
          <article key={card} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-semibold">{card}</p>
            <p className="text-sm text-slate-500">Track usage and SLAs at a glance.</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LocaleLanding;
