'use client';
import { IntlProvider } from 'react-intl';
import Header from './fixed/Header';
import Footer from './fixed/Footer';
import DonationProvider from './system/DonationDialog';

export default function SiteShell({ locale, messages, children, donationQr }) {
  const direction = locale === 'fa' ? 'rtl' : 'ltr';

  return (
    <IntlProvider key={locale} locale={locale} messages={messages}>
      <div className={`app ${direction}`} dir={direction}>
        <DonationProvider qrDataUrl={donationQr}>
          <Header locale={locale} />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </DonationProvider>
      </div>
    </IntlProvider>
  );
}
