'use client';
import { IntlProvider } from 'react-intl';
import Header from './Header';
import Footer from './Footer';

export default function SiteShell({ locale, messages, children }) {
  const direction = locale === 'fa' ? 'rtl' : 'ltr';

  return (
    <IntlProvider key={locale} locale={locale} messages={messages}>
      <div className={`app ${direction}`} dir={direction}>
        <Header locale={locale} />
        <main>{children}</main>
        <Footer />
      </div>
    </IntlProvider>
  );
}
