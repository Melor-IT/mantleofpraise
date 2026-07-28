import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { useState } from 'react';
import enMessages from './i18n/en';
import faMessages from './i18n/fa';
import nlMessages from './i18n/nl';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import OurVisionPage from './pages/OurVisionPage';
import ANBIInformationPage from './pages/ANBIInformationPage';
import JoinUsPage from './pages/JoinUsPage';
import ScrollToTop from './components/ScrollToTop';
import './style/main.scss';

const messages = {
  en: enMessages,
  fa: faMessages,
  nl: nlMessages
};

const supportedLocales = Object.keys(messages);

const getInitialLocale = () => {
  const storedLocale = localStorage.getItem('locale');
  return supportedLocales.includes(storedLocale) ? storedLocale : 'en';
};

function App() {
  const [locale, setLocale] = useState(getInitialLocale);

  const changeLocale = (newLocale) => {
    if (!supportedLocales.includes(newLocale)) return;
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <BrowserRouter>
       <ScrollToTop />
        <div
          className={`app ${locale === 'fa' ? 'rtl' : 'ltr'}`}
          dir={locale === 'fa' ? 'rtl' : 'ltr'}>
          <Header locale={locale} setLocale={changeLocale} />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/join-us" element={<JoinUsPage />} />
              <Route path="/our-vision" element={<OurVisionPage />} />
              <Route path="/ANBI-information" element={<ANBIInformationPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </IntlProvider>
  );
}

export default App;
