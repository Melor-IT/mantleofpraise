import { NavLink } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

const menuItems = [
  { to: '/', id: 'home', defaultMessage: 'Home' },
  { to: '/join-us', id: 'joinUs', defaultMessage: 'Join Us' },
  { to: '/about-us', id: 'aboutUs', defaultMessage: 'About Us' },
  { to: '/our-vision', id: 'ourVision', defaultMessage: 'Our Vision' },
  { to: '/ANBI-information', id: 'ANBIInformation', defaultMessage: 'ANBI Information' }
];

const Header = ({ locale, setLocale }) => {
  const { formatMessage } = useIntl();
  return (
    <header className="app-header">
      <div className="page-content">
        <Link to="/">
          <div className="logo-full">
            <img src="/images/logo-mini.png" alt="Logo" />
            <img
              src={locale === 'fa' ? '/images/rada-farsi.png' : '/images/rada-eng.png'}
              alt="Logo"
            />
          </div>{' '}
        </Link>

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
      </div>
    </header>
  );
};

export default Header;
