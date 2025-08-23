import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { useState } from "react";
import enMessages from "./i18n/en";
import faMessages from "./i18n/fa";
import nlMessages from "./i18n/nl";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import JoinUsPage from "./pages/JoinUsPage";
import "./style/main.scss";

const messages = {
  en: enMessages,
  fa: faMessages,
  nl: nlMessages
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
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/join-us" element={<JoinUsPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </IntlProvider>
  );
}

export default App;
