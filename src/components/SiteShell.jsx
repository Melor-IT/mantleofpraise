'use client';
import { IntlProvider } from 'react-intl';
import Header from './fixed/Header';
import Partners from './fixed/Partners';
import Footer from './fixed/Footer';
import DonationProvider from './system/DonationDialog';

export default function SiteShell({ locale, messages, children, donationQr }) {
  const direction = locale === 'fa' ? 'rtl' : 'ltr';

  return (
    <IntlProvider key={locale} locale={locale} messages={messages}>
      <div className={`app ${direction}`} dir={direction}>
        <DonationProvider qrDataUrl={donationQr}>
          <Header locale={locale} />
          <main>{children}</main>
          <Partners />
          <Footer />
        </DonationProvider>
      </div>
    </IntlProvider>
  );
}
