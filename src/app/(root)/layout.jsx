import '../../style/globals.css';
import '../../style/main.css';
import { siteUrl } from '../../lib/site';

export const metadata = {
  metadataBase: new URL(siteUrl),
  icons: { icon: '/images/logo-mini.png' }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
