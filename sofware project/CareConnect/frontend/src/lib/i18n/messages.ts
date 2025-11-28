export type Locale = 'en' | 'fr' | 'ar';

export const messages: Record<Locale, Record<string, string>> = {
  en: {
    tagline: 'Whole-person care for our campus community',
    studentPortal: 'Student Portal',
    staffDashboard: 'Doctor & Staff Dashboard',
    heroCta: 'Book a visit',
    languageLabel: 'Language'
  },
  fr: {
    tagline: 'Des soins complets pour notre communauté universitaire',
    studentPortal: 'Portail Étudiant',
    staffDashboard: 'Tableau de bord Médecins & Personnel',
    heroCta: 'Réserver une visite',
    languageLabel: 'Langue'
  },
  ar: {
    tagline: 'رعاية شاملة لمجتمع الحرم الجامعي',
    studentPortal: 'بوابة الطلبة',
    staffDashboard: 'لوحة الأطباء والموظفين',
    heroCta: 'احجز زيارة',
    languageLabel: 'اللغة'
  }
};

export const supportedLocales: Locale[] = ['en', 'fr', 'ar'];

export const resolveMessage = (locale: Locale, key: string) => {
  const fallback = messages['en'][key] ?? key;
  return messages[locale]?.[key] ?? fallback;
};
