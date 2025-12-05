import { Locale } from "@/lib/i18n/messages";

type StaffPageProps = {
  params: { locale: Locale };
};

const metrics = [
  { label: "Today's visits", value: 42 },
  { label: "Avg wait (min)", value: 11 },
  { label: "SLA", value: 0.93 }
];

const StaffDashboardPage = ({ params }: StaffPageProps) => {
  const { locale } = params;
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">{locale.toUpperCase()} Staff Dashboard</h1>
        <p className="text-slate-600">Use role-based guards (JWT or Firebase Custom Claims).</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{metric.label}</p>
            <p className="text-3xl font-semibold">{metric.value}</p>
          </article>
        ))}
      </div>
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6">
        <p className="font-semibold">Care team queue</p>
        <p className="text-sm text-slate-500">Stream upcoming appointments, urgent flags, and chat triage.</p>
      </div>
    </section>
  );
};

export default StaffDashboardPage;
