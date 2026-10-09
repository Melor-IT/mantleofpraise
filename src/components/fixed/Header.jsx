'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';
import { useEffect, useRef, useState } from 'react';
import { pathFor } from '../../lib/site';
import DonationButton from '../system/DonationButton';

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

const normalizePath = (path) => path.replace(/\/+$/, '') || '/';

const Header = ({ locale }) => {
  const { formatMessage } = useIntl();
  const pathname = usePathname();
  const router = useRouter();
  const routeSuffix = normalizePath(pathname).split('/').slice(2).join('/');
  const suffix = routeSuffix === 'Home' ? '' : routeSuffix;
  const languagePath = (lang) => pathFor(lang, suffix);
  const menuPath = (itemPath) => pathFor(locale, itemPath === '/' ? '' : itemPath.slice(1));
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageMenuRef = useRef(null);
  const languageTriggerRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const currentLanguage = languages.find((language) => language.code === locale) || languages[0];
  const availableLanguages = languages.filter((language) => language.code !== currentLanguage.code);
  const isActive = (itemPath) => {
    const currentPath = normalizePath(pathname);
    const targetPath = normalizePath(menuPath(itemPath));

    return itemPath === '/'
      ? currentPath === targetPath
      : currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia('(min-width: 37.501em)').matches) {
        setOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    const handlePointerDown = (event) => {
      if (!languageMenuRef.current?.contains(event.target)) setLanguageOpen(false);
      if (
        !mobileMenuRef.current?.contains(event.target) &&
        !hamburgerRef.current?.contains(event.target)
      )
        setOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (languageMenuRef.current?.contains(document.activeElement)) {
          languageTriggerRef.current?.focus();
        }
        if (mobileMenuRef.current?.contains(document.activeElement)) {
          hamburgerRef.current?.focus();
        }
        setLanguageOpen(false);
        setOpen(false);
      }
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

  useEffect(() => {
    if (languageOpen) languageMenuRef.current?.querySelector('[role="menuitem"]')?.focus();
  }, [languageOpen]);

  function handleLanguageKeys(event) {
    const items = [...languageMenuRef.current.querySelectorAll('[role="menuitem"]')];
    const index = items.indexOf(document.activeElement);
    let nextIndex;
    if (event.key === 'ArrowDown') nextIndex = (index + 1) % items.length;
    else if (event.key === 'ArrowUp') nextIndex = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = items.length - 1;
    else if (event.key === 'Tab') {
      setLanguageOpen(false);
      languageTriggerRef.current.focus();
      return;
    } else return;
    event.preventDefault();
    items[nextIndex]?.focus();
  }

  return (
    <header className="app-header">
      <div className="page-content">
        {/* Logo */}
        <Link
          className="logo-full"
          href={pathFor(locale)}
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
          ref={hamburgerRef}
          onClick={() => setOpen((prev) => !prev)}
          aria-label={formatMessage({ id: 'menu', defaultMessage: 'Menu' })}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="header-actions">
          <DonationButton />
          {/* Language Selector */}
          <div
            className={`lang-selector desktop-language ${languageOpen ? 'is-open' : ''}`}
            ref={languageMenuRef}
          >
            <button
              type="button"
              className="language-trigger"
              ref={languageTriggerRef}
              onClick={() => setLanguageOpen((value) => !value)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                  event.preventDefault();
                  setLanguageOpen(true);
                }
              }}
              aria-label={formatMessage({
                id: 'selectLanguage',
                defaultMessage: 'Select language'
              })}
              aria-haspopup="menu"
              aria-expanded={languageOpen}
              aria-controls="language-navigation"
            >
              <span className="language-code">{currentLanguage.short}</span>
            </button>

            <div
              className="language-menu"
              id="language-navigation"
              role="menu"
              onKeyDown={handleLanguageKeys}
              aria-hidden={!languageOpen}
              inert={!languageOpen}
            >
              {availableLanguages.map((language) => (
                <button
                  type="button"
                  role="menuitem"
                  aria-label={language.label}
                  key={language.code}
                  onClick={() => {
                    setLanguageOpen(false);
                    router.push(languagePath(language.code));
                  }}
                >
                  {language.short}
                </button>
              ))}
            </div>
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
              href={menuPath(item.to)}
              className={isActive(item.to) ? 'active' : ''}
              aria-current={isActive(item.to) ? 'page' : undefined}
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
          ref={mobileMenuRef}
          className={`mobile-menu ${open ? 'show' : ''}`}
          aria-label={formatMessage({ id: 'mainNavigation', defaultMessage: 'Main navigation' })}
          aria-hidden={!open}
          inert={!open}
        >
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={menuPath(item.to)}
              onClick={() => setOpen(false)}
              className={isActive(item.to) ? 'active' : ''}
              aria-current={isActive(item.to) ? 'page' : undefined}
            >
              {formatMessage({
                id: item.id,
                defaultMessage: item.defaultMessage
              })}
            </Link>
          ))}
          <div className="mobile-menu-actions">
            <DonationButton onClick={() => setOpen(false)} />
            <div
              className="mobile-language-switcher"
              role="group"
              aria-label={formatMessage({
                id: 'selectLanguage',
                defaultMessage: 'Select language'
              })}
            >
              {availableLanguages.map((language) => (
                <button
                  type="button"
                  aria-label={language.label}
                  key={language.code}
                  onClick={() => {
                    setOpen(false);
                    router.push(languagePath(language.code));
                  }}
                >
                  {language.short}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
