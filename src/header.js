import { NavLink } from "react-router-dom";
import { useIntl } from "react-intl";

const menuItems = [
  { to: "/", id: "home", defaultMessage: "Home" },
  { to: "/gallery", id: "gallery", defaultMessage: "Gallery" },
  { to: "/join-us", id: "joinUs", defaultMessage: "Join Us" },
  { to: "/about-us", id: "aboutUs", defaultMessage: "About Us" },
];

const Header = ({ locale, setLocale }) => {
  const { formatMessage } = useIntl();
  return (
    <header>
      <div className="header-left">
        <img src="/images/rada-eng.png" alt="Logo" className="logo-image" />
      </div>
      <nav className="nav-menu" aria-label="Main navigation">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {formatMessage({
              id: item.id,
              defaultMessage: item.defaultMessage,
            })}
          </NavLink>
        ))}

        <div>
          <select
            id="language-select"
            className="language-select"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            aria-label="Select language"
          >
            <option value="en">🇺🇸</option>
            <option value="fa">🇮🇷</option>
            <option value="nl">🇳🇱</option>
          </select>
        </div>
      </nav>
      <div className="header-right">
        <img src="/images/logo-big.png" alt="Logo" className="logo-image" />
      </div>
    </header>
  );
};

export default Header;
