'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';
import { useEffect, useRef, useState } from 'react';

const menuItems = [
  { to: '/', id: 'home', defaultMessage: 'Home' },
  { to: '/our-vision', id: 'ourVision', defaultMessage: 'Our Vision' },
  { to: '/ANBI-information', id: 'ANBIInformation', defaultMessage: 'ANBI Information' },
  { to: '/about-us', id: 'aboutUs', defaultMessage: 'About Us' },
  { to: '/join-us', id: 'joinUs', defaultMessage: 'Join Us' }
];

const languages = [
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'fa', short: 'FA', label: 'فارسی' },
  { code: 'nl', short: 'NL', label: 'Nederlands' }
];

const Header = ({ locale }) => {
  const { formatMessage } = useIntl();
  const pathname = usePathname();
  const router = useRouter();
  const suffix = pathname.split('/').slice(2).join('/');
  const languagePath = (lang) => `/${lang}${suffix ? `/${suffix}` : ''}`;
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageMenuRef = useRef(null);
  const currentLanguage = languages.find((language) => language.code === locale) || languages[0];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 500) {
        setOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    const handlePointerDown = (event) => {
      if (!languageMenuRef.current?.contains(event.target)) setLanguageOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setLanguageOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setLanguageOpen(false);
  }, [pathname]);

  return (
    <header className="app-header">
      <div className="page-content">
        {/* Logo */}
        <Link
          className="logo-full"
          href={`/${locale}`}
          aria-label={formatMessage({ id: 'home', defaultMessage: 'Home' })}
        >
          <img src="/images/logo-mini.png" alt="Mantle of Praise logo" />
          <img
            src={locale === 'fa' ? '/images/rada-farsi.png' : '/images/rada-eng.png'}
            alt="Reda-ye Setayesh logo"
          />
        </Link>

        {/* Hamburger Menu Button */}
        <button
          type="button"
          className={`hamburger ${open ? 'open' : ''}`}
          onClick={() => setOpen((prev) => !prev)}
          aria-label={formatMessage({ id: 'menu', defaultMessage: 'Menu' })}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Language Selector */}
        <div
          className={`lang-selector desktop-language ${languageOpen ? 'is-open' : ''}`}
          ref={languageMenuRef}
        >
          <button
            type="button"
            className="language-trigger"
            onClick={() => setLanguageOpen((value) => !value)}
            aria-label={formatMessage({ id: 'selectLanguage', defaultMessage: 'Select language' })}
            aria-haspopup="menu"
            aria-expanded={languageOpen}
          >
            <span className="language-code">{currentLanguage.short}</span>
          </button>

          <div
            className="language-menu"
            role="menu"
            aria-hidden={!languageOpen}
            inert={!languageOpen}
          >
            {languages.map((language) => (
              <button
                type="button"
                role="menuitemradio"
                aria-checked={language.code === locale}
                aria-label={language.label}
                className={language.code === locale ? 'active' : ''}
                key={language.code}
                onClick={() => {
                  setLanguageOpen(false);
                  if (language.code !== locale) router.push(languagePath(language.code));
                }}
              >
                <span className="language-code">{language.short}</span>
                <span className="language-check" aria-hidden="true">
                  ✓
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Menu */}
        <nav
          className="nav-menu"
          aria-label={formatMessage({ id: 'mainNavigation', defaultMessage: 'Main navigation' })}
        >
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}${item.to === '/' ? '' : item.to}`}
              className={pathname === `/${locale}${item.to === '/' ? '' : item.to}` ? 'active' : ''}
            >
              {formatMessage({
                id: item.id,
                defaultMessage: item.defaultMessage
              })}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu */}
        <nav
          id="mobile-navigation"
          className={`mobile-menu ${open ? 'show' : ''}`}
          aria-label={formatMessage({ id: 'mainNavigation', defaultMessage: 'Main navigation' })}
          aria-hidden={!open}
          inert={!open}
        >
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}${item.to === '/' ? '' : item.to}`}
              onClick={() => setOpen(false)}
              className={pathname === `/${locale}${item.to === '/' ? '' : item.to}` ? 'active' : ''}
            >
              {formatMessage({
                id: item.id,
                defaultMessage: item.defaultMessage
              })}
            </Link>
          ))}
          <div
            className="mobile-language-switcher"
            role="group"
            aria-label={formatMessage({
              id: 'selectLanguage',
              defaultMessage: 'Select language'
            })}
          >
            {languages.map((language) => (
              <button
                type="button"
                className={language.code === locale ? 'active' : ''}
                aria-label={language.label}
                aria-pressed={language.code === locale}
                key={language.code}
                onClick={() => {
                  setOpen(false);
                  if (language.code !== locale) router.push(languagePath(language.code));
                }}
              >
                {language.short}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
