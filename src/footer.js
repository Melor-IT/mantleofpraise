import { useIntl } from "react-intl";

const Footer = ({ locale, setLocale }) => {
  const { formatMessage } = useIntl();

  const footerStyle = {
  backgroundImage: `url(/images/footerimage.jpg)`
}

  return (
    <footer className="footer" style={footerStyle}>
      <div className="info">
        <div className="col">
          <h4>
            {formatMessage({
              id: "visitingAddress",
              defaultMessage: "VisitingAddress",
            })}
          </h4>
          <p>Tante Pollewopstraat, 1336KB Almere, Netherlands</p>
        </div>
        <div className="col">
          <h4>
            {formatMessage({
              id: "mailingAddress",
              defaultMessage: "MailingAddress",
            })}
          </h4>
          <p>Alseïdenstraat 20-2, 1363SR Almere</p>
        </div>
        <div className="col">
          <h4>
            {formatMessage({
              id: "kvk",
              defaultMessage: "KVK",
            })}
          </h4>
          <p>97889539</p>
        </div>
      </div>
      <div className="socialmedia">
        <h4>
          {formatMessage({
            id: "socialMedia",
            defaultMessage: "SocialMedia",
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
    </footer>
  );
};

export default Footer;
