import { useIntl } from 'react-intl';
import { donation } from '../../data/donation';
import Paisley from '../system/Paisley';

const Footer = () => {
  const { formatMessage, locale } = useIntl();

  return (
    <footer className="footer">
      <div className="page-content">
        <div className="content-row message">
          <h3>
            {' '}
            {formatMessage({
              id: 'footerText',
              defaultMessage: 'footerText'
            })}
          </h3>
        </div>
        <Paisley className="footer-ornament" tone="gold" />
        <div className="content-row">
          <div className="dark-glass">
            <h4>
              {formatMessage({
                id: 'address',
                defaultMessage: 'Address'
              })}
            </h4>
            <p dir="ltr">Tante Pollewopstraat, 1336KB Almere, Netherlands</p>

            <h4>
              {formatMessage({
                id: 'email',
                defaultMessage: 'Email'
              })}
            </h4>
            <p>
              <a href="mailto:info@mantleofpraise.nl" dir="ltr">
                info@mantleofpraise.nl
              </a>
            </p>
            <h4>
              {formatMessage({
                id: 'instagram',
                defaultMessage: 'instagram'
              })}
            </h4>
            <p>
              <a
                href="https://www.instagram.com/mantle.of.praise/"
                target="_blank"
                rel="noreferrer"
                dir="ltr"
              >
                @mantle.of.praise
              </a>
            </p>
          </div>
          <div className="dark-glass">
            <h4>
              {formatMessage({
                id: 'kvk',
                defaultMessage: 'KVK'
              })}
            </h4>
            <p dir="ltr">{donation.kvk}</p>

            <h4> RSIN </h4>
            <p dir="ltr">{donation.rsin}</p>

            <h4>IBAN</h4>
            <p dir="ltr">{donation.iban}</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p dir={locale === 'fa' ? 'rtl' : 'ltr'}>
          {locale === 'fa' ? '© ۲۰۲۶ ردای ستایش' : '© 2026 Mantle of Praise'}
        </p>
        <p>
          <a className="footer-credit" href="https://mel-or.com/" dir="ltr" lang="en">
            <span className="footer-credit__label">Made by</span>{' '}
            <span className="footer-credit__brand">Melor</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
