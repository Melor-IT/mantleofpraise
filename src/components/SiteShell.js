'use client';
import { IntlProvider } from 'react-intl';
import Header from './Header';
import Footer from './Footer';

export default function SiteShell({ locale, messages, children }) {
  return <IntlProvider locale={locale} messages={messages}>
    <div className={`app ${locale === 'fa' ? 'rtl' : 'ltr'}`} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <Header locale={locale} /><main>{children}</main><Footer />
    </div>
  </IntlProvider>;
}
