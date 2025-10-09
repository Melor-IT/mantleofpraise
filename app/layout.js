'use client';

import { useState, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import Header from '../components/Header';
import Footer from '../components/Footer';

import enMessages from '../i18n/en';
import faMessages from '../i18n/fa';
import nlMessages from '../i18n/nl';

import '../styles/main.scss';

const messages = {
  en: enMessages,
  fa: faMessages,
  nl: nlMessages
};

export default function RootLayout({ children }) {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'en';
    setLocale(savedLocale);
  }, []);

  const changeLocale = (newLocale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <html lang={locale}>
      <body className={locale === 'fa' ? 'rtl' : 'ltr'} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
        <IntlProvider locale={locale} messages={messages[locale]}>
          <Header locale={locale} setLocale={changeLocale} />
          <main>{children}</main>
          <Footer />
        </IntlProvider>
      </body>
    </html>
  );
}
