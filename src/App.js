import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { useState } from "react";
import enMessages from "./i18n/en";
import faMessages from "./i18n/fa";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import "./style/main.scss";

const messages = {
  en: enMessages,
  fa: faMessages,
};

function App() {
  const [locale, setLocale] = useState(
    localStorage.getItem("locale") || "en"
  );

  const changeLocale = (newLocale) => {
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <BrowserRouter>
        <div className="app">
          <Header locale={locale} setLocale={changeLocale} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </IntlProvider>
  );
}

export default App;
