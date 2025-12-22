import { NavLink } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';

const menuItems = [
  { to: '/', id: 'home', defaultMessage: 'Home' },
  { to: '/join-us', id: 'joinUs', defaultMessage: 'Join Us' },
  { to: '/about-us', id: 'aboutUs', defaultMessage: 'About Us' },
  { to: '/our-vision', id: 'ourVision', defaultMessage: 'Our Vision' },
  { to: '/ANBI-information', id: 'ANBIInformation', defaultMessage: 'ANBI Information' }
];

const Header = ({ locale, setLocale }) => {
  const { formatMessage } = useIntl();
  const [open, setOpen] = useState(false);
  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth > 500) {
      setOpen(false);
    }
  };

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);


  return (
    <header className="app-header">
      <div className="page-content">
        {/* Logo */}
        <div className="logo-full">
          <img src="/images/logo-mini.png" alt="Logo" />
          <img
            src={locale === 'fa' ? '/images/rada-farsi.png' : '/images/rada-eng.png'}
            alt="Logo"
          />
        </div>

        {/* Hamburger Menu Button */}
        <button
          className={`hamburger ${open ? 'open' : ''}`}
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Language Selector */}
        <div className="lang-selector">
          <select
            id="language-select"
            className="language-select"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            aria-label="Select language">
            <option value="en">🇺🇸</option>
            <option value="fa">🇮🇷</option>
            <option value="nl">🇳🇱</option>
          </select>
        </div>

        {/* Desktop Menu */}
        <nav className="nav-menu" aria-label="Main navigation">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) => (isActive ? 'active' : '')}>
              {formatMessage({
                id: item.id,
                defaultMessage: item.defaultMessage
              })}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${open ? 'show' : ''}`}>
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? 'active' : '')}>
              {formatMessage({
                id: item.id,
                defaultMessage: item.defaultMessage
              })}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
