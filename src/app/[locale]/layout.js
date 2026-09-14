import { notFound } from 'next/navigation';
import '../../style/main.css';
import { locales, messages } from '../../lib/site';
import SiteShell from '../../components/SiteShell';
import { siteUrl } from '../../lib/site';

export const metadata = { metadataBase: new URL(siteUrl), icons: { icon: '/images/logo-mini.png' } };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  return <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'}><body>
    <SiteShell locale={locale} messages={messages[locale]}>{children}</SiteShell>
  </body></html>;
}
