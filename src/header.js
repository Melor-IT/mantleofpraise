import React from "react";
import Logo from "./images/logo-big.png";
import Logotext from "./images/rada- eng.png";
import { Link } from "react-router-dom";
import { useIntl } from "react-intl";

const Header = ({ locale, setLocale }) => {
  const { formatMessage } = useIntl();
  return (
    <header className="header">
      <div className="header-left">
        <img src={Logotext} alt="Logo" className="logo-image" />
      </div>
      <nav className="nav-menu" aria-label="Main navigation">
        <Link
          to="/"
          aria-current={locale === "home" ? "page" : undefined}
          className="active"
        >
          {formatMessage({ id: "home", defaultMessage: "Home" })}
        </Link>
        <Link to={`/gallery`} activeClassName="current">
          {formatMessage({ id: "gallery", defaultMessage: "gallery" })}
        </Link>
        <Link to={`/joinUs`} activeClassName="current">
          {formatMessage({ id: "joinUs", defaultMessage: "joinUs" })}
        </Link>
        <Link to={`/aboutUs`} activeClassName="current">
          {formatMessage({ id: "aboutUs", defaultMessage: "aboutUs" })}
        </Link>
        <select
          class="language-select"
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
        <img src={Logo} alt="Logo" className="logo-image" />
      </div>
    </header>
  );
};

export default Header;
