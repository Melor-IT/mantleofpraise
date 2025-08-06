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
          <h3> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
            standard dummy text ever since the 1500s</h3>
        </div>

        <div className="content-row">
          <div className="dark-glass">
            <h4>
              {formatMessage({
                id: 'visitingAddress',
                defaultMessage: 'VisitingAddress'
              })}
            </h4>
            <p>Tante Pollewopstraat, 1336KB Almere, Netherlands</p>

            <h4>
              {formatMessage({
                id: 'mailingAddress',
                defaultMessage: 'MailingAddress'
              })}
            </h4>
            <p>Alseïdenstraat 20-2, 1363SR Almere</p>

            <h4>
              {formatMessage({
                id: 'kvk',
                defaultMessage: 'KVK'
              })}
            </h4>
            <p>97889539</p>
          </div>

          <div>
            <h4>
              {formatMessage({
                id: 'socialMedia',
                defaultMessage: 'SocialMedia'
              })}
            </h4>
            <div>
              <a href="tel:+31636348934">
                <span className="icon-phone"></span>
              </a>
              <a href="gh.hamid89@gmail.com">
                <span className="icon-envelop"></span>
              </a>
              {/* <a href="https://www.youtube.com/@LichtWereldKerk">
            <span className="icon-youtube"></span>
          </a>
          <a href="https://www.instagram.com/noorejahan_farsi_church?igsh=MTA1djZzdnByeHJldQ==">
            <span className="icon-instagram"></span>
          </a> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
