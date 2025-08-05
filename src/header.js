import { NavLink } from "react-router-dom";
import { useIntl } from "react-intl";

const Header = ({ locale, setLocale }) => {
  const { formatMessage } = useIntl();
  return (
    <header>
      <div className="header-left">
      </div>
      <nav className="nav-menu" aria-label="Main navigation">
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
          {formatMessage({ id: "home", defaultMessage: "Home" })}
        </NavLink>
        <NavLink to="/gallery" className={({ isActive }) => (isActive ? "active" : "")}>
          {formatMessage({ id: "gallery", defaultMessage: "Gallery" })}
        </NavLink>
        <NavLink to="/joinUs" className={({ isActive }) => (isActive ? "active" : "")}>
          {formatMessage({ id: "joinUs", defaultMessage: "Join Us" })}
        </NavLink>
        <NavLink to="/aboutUs" className={({ isActive }) => (isActive ? "active" : "")}>
          {formatMessage({ id: "aboutUs", defaultMessage: "About Us" })}
        </NavLink>
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
      </nav>
      <div className="header-right">
        <img src="/images/MantleofPraise.jpeg" alt="Logo" className="logo-image" />
      </div>
    </header>
  );
};

export default Header;