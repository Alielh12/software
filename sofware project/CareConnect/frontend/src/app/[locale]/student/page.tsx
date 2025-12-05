import { Locale } from "@/lib/i18n/messages";

type StudentPageProps = {
  params: { locale: Locale };
};

const StudentPortalPage = ({ params }: StudentPageProps) => {
  const { locale } = params;
  const grid = [
    {
      title: "Visit scheduling",
      description: "Book in-person, virtual, or triage visits with SMS reminders"
    },
    {
      title: "Records & forms",
      description: "Download immunizations and upload insurance in one place"
    },
    {
      title: "Wellness programs",
      description: "Workshops, nutrition plans, and mental health circles"
    }
  ];

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">{locale.toUpperCase()} Student Portal</h1>
        <p className="text-slate-600">Guarded routes should check auth tokens or Firebase session.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {grid.map((card) => (
          <article key={card.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-semibold">{card.title}</p>
            <p className="text-sm text-slate-500">{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default StudentPortalPage;
