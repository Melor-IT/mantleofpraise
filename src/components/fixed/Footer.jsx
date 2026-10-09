import { useIntl } from 'react-intl';
import { donation } from '../../data/donation';

const Footer = () => {
  const { formatMessage } = useIntl();

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
        <div className="botoje-gold"></div>
        <div className="content-row">
          <div className="dark-glass">
            <h4>
              {formatMessage({
                id: 'address',
                defaultMessage: 'Address'
              })}
            </h4>
            <p>Tante Pollewopstraat, 1336KB Almere, Netherlands</p>

            <h4>
              {formatMessage({
                id: 'email',
                defaultMessage: 'Email'
              })}
            </h4>
            <p>
              <a href="mailto:info@mantleofpraise.nl">info@mantleofpraise.nl</a>
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
            <p>{donation.kvk}</p>

            <h4> RSIN </h4>
            <p>{donation.rsin}</p>

            <h4>IBAN</h4>
            <p dir="ltr">{donation.iban}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
