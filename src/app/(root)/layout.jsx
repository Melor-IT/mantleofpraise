import '../../style/globals.css';
import '../../style/main.css';
import { siteUrl } from '../../lib/site';
import OrganizationData from '../../components/system/OrganizationData';

export const metadata = {
  metadataBase: new URL(siteUrl),
  icons: { icon: '/images/logo-mini.png' }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <OrganizationData locale="en" />
        {children}
      </body>
    </html>
  );
}
