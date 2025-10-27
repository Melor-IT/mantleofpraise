import { useIntl } from 'react-intl';

const Footer = ({ locale, setLocale }) => {
  const { formatMessage } = useIntl();

  const footerStyle = {
    backgroundImage: `url(/images/footerimage.jpg)`
  };

  return (
    <footer className="footer" style={footerStyle}>
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
              <a href="to:info@mantleofpraise.nl">info@mantleofpraise.nl</a>
            </p>
            <h4>
              {formatMessage({
                id: 'instagram',
                defaultMessage: 'instagram'
              })}
            </h4>
            <p>
              <a href="https://www.instagram.com/mantle.of.praise/" target="_blank" rel="noreferrer">
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
            <p>97889539</p>

            <h4> RSIN </h4>
            <p>868276972</p>

            <h4>IBAN</h4>
            <p>NL56TRIO0321129849</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
