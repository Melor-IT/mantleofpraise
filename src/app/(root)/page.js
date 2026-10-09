import Home from '../[locale]/page';
import SiteShell from '../../components/SiteShell';
import { messages, pageMetadata } from '../../lib/site';
import { getDonationQr } from '../../lib/donationQr';

export const metadata = pageMetadata('en');

export default async function RootPage() {
  return (
    <SiteShell locale="en" messages={messages.en} donationQr={await getDonationQr()}>
      <Home params={{ locale: 'en' }} />
    </SiteShell>
  );
}
