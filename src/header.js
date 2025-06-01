import React from 'react';
import Logo from './images/logo-big.png';

const Header = ({ locale, setLocale }) => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-text">
          Mantle<span>Of</span>Praise
        </div>
      </div>
      <nav className="nav-menu" aria-label="Main navigation">
        <a href="#" aria-current={locale === "home" ? "page" : undefined} className="active">Home</a>
        <a href="#">Gallery</a>
        <a href="#">Join US</a>
        <a href="#">About US</a>
      </nav>
      <select
        className="locale-select"
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
        aria-label="Select language"
      >
        <option value="en">English</option>
        <option value="fa">فارسی</option>
      </select>
      <div className="header-right">
        <img src={Logo} alt="Logo" className="logo-image" />
      </div>
    </header>
  );
};

export default Header;
