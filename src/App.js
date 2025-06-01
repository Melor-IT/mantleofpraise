import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { useState } from 'react';
import enMessages from './i18n/en';
import faMessages from './i18n/fa';

import Header from './header';
import Footer from './footer';
import Home from './pages/home';
import Contact from './pages/contact';
import './App.css';
import './style/main.css';
const messages = {
  en: enMessages,
  fa: faMessages,
};

function App() {
  const [locale, setLocale] = useState('en');

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <BrowserRouter>
        <main className="app">
          <Header locale={locale} setLocale={setLocale} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
        </main>
      </BrowserRouter>
    </IntlProvider>
  );
}

export default App;
