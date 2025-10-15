'use client';

import Link from 'next/link';

const menuItems = [
  { to: '/', id: 'home', defaultMessage: 'Home' },
  // { to: '/join-us', id: 'joinUs', defaultMessage: 'Join Us' },
  // { to: '/about-us', id: 'aboutUs', defaultMessage: 'About Us' },
  // { to: '/our-vision', id: 'ourVision', defaultMessage: 'Our Vision' },
  // { to: '/ANBI-information', id: 'ANBIInformation', defaultMessage: 'ANBI Information' }
];


import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { locales, defaultLocale } from '@/i18n/request';

export default function Header({ locale }) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (newLocale) => {
    // Validate the new locale
    const validLocale = locales.includes(newLocale) ? newLocale : defaultLocale;
    // Set locale in a cookie
    document.cookie = `locale=${validLocale}; path=/; SameSite=Strict`;
    // Redirect to the same page with the new locale
    const currentPath = window.location.pathname.replace(/^\/(en|fa|nl)/, '') || '/';
    router.push(`/${validLocale}${currentPath}`);
  };
  return (
    <header className="app-header">
      <div className="page-content">
        <Link href="/">
          <div className="logo-full">
            <img src="/images/logo-mini.png" alt="Logo" />
            <img
              src={locale === 'fa' ? '/images/rada-farsi.png' : '/images/rada-eng.png'}
              alt="Logo"
            />
          </div>
        </Link>

        <nav className="nav-menu" aria-label="Main navigation">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.to}
              className={pathname === item.to ? 'active' : ''}>
              {t(item.id)}
            </Link>
          ))}
        </nav>

        <div className="lang-selector">
          <select
            id="language-select"
            className="language-select"
            value={locale}
            onChange={(e) => changeLocale(e.target.value)}
            aria-label="Select language">
            <option value="en">🇺🇸</option>
            <option value="fa">🇮🇷</option>
            <option value="nl">🇳🇱</option>
          </select>
        </div>
      </div>
    </header>
  );
};
