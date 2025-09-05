import { useIntl } from 'react-intl';
import BackgroundImage from '../components/BackgroundImage';
import { Link } from 'react-router-dom';

export default function HomePage({ locale, setLocale }) {
  const { formatMessage } = useIntl();

  return (
    <main className="page home">
      <section className="banner">
        <BackgroundImage url="/images/home-banner.jpg" />

        <div className="page-content">
          <h2>
            {formatMessage({
              id: 'welcomTo',
              defaultMessage: 'Welcome to'
            })}
          </h2>
          <h1>
            {formatMessage({
              id: 'mantleOfPraise',
              defaultMessage: 'Mantle of Praise'
            })}
          </h1>

          <div className="botoje-white"></div>
        </div>
      </section>

      <section className="secondary">
        <BackgroundImage url="/images/back2.jpg" className='mission'/>
        <div className="page-content">
          <header className="missionus">
            <h2>
              {formatMessage({
                id: 'ourMission',
                defaultMessage: 'Our Mission'
              })}
            </h2>
            <p>
              {formatMessage({
                id: 'ourMissionText',
                defaultMessage: ''
              })}
            </p>
          </header>

          <div className="services">
            <div>
              <h3>
                {formatMessage({
                  id: 'firstService',
                  defaultMessage: 'Equipping Worshipers'
                })}
              </h3>
              <p>
                {formatMessage({
                  id: 'firstServiceText',
                  defaultMessage:
                    'Preparing and training members for service in churches and leading worship sessions.'
                })}
              </p>
              <div className="image-circle">
                <img src="/images/firstService.jpg" alt="Equipping Worshipers"/>
              </div>
            </div>
            <div>
              <h3>
                {formatMessage({
                  id: 'secondService',
                  defaultMessage: 'Nurturing Prophets'
                })}
              </h3>
              <p>
                {formatMessage({
                  id: 'secondServiceText',
                  defaultMessage:
                    'Teaching, guiding, and supporting prophets for effective ministry in the body of Christ and prophetic flow. Worship combined with prophetic service and leading prayer sessions.'
                })}
              </p>
              <div className="image-circle ne">
                <img src="/images/secondService.jpeg" alt="Nurturing Prophets" />
              </div>
            </div>
            <div>
              <h3>
                {formatMessage({
                  id: 'thirdService',
                  defaultMessage: 'Organizing Prayer and Worship Sessions'
                })}
              </h3>
              <p>
                {formatMessage({
                  id: 'thirdServiceText',
                  defaultMessage:
                    'Combining music and worship under the guidance of the Holy Spirit, inspired by the Bible (1 Samuel 10:5), and organizing worship and prayer meetings to strengthen the presence of the Lord.'
                })}
              </p>
              <div className="image-circle sw">
                <img src="/images/thirdService.jpg" alt="Organizing Prayer and Worship Sessions" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="primary about-us">
        <div className="page-content">
          <div className="botoje-white"></div>
          <div className="text-block">
            <h2>
              {formatMessage({
                id: 'aboutUs',
                defaultMessage: 'About Us'
              })}
            </h2>
          </div>
          
          <div className="text-block">
            <p>
              {formatMessage({
                id: 'aboutUsSectionText',
                defaultMessage: ''
              })}
            </p>
            <Link className="button" to="/about-us">
              {formatMessage({
                id: 'more',
                defaultMessage: 'More'
              })}
            </Link>
          </div>
        </div>
      </section>

      <section className="secondary our-vision">
        <BackgroundImage url="/images/back2.jpg" />
        <div className="page-content">
          {/*<div>*/}
          <h2>
            {formatMessage({
              id: 'visen',
              defaultMessage: 'Our Vision'
            })}
          </h2>

          <p>
            {formatMessage({
              id: 'visenText',
              defaultMessage:
                'Our vision is to form an inspiring community of worshipers and prophets who, through music and worship filled with the guidance of the Holy Spirit, spread the light and presence of God in churches, awaken and heal every heart, and create a living, deep, and lasting experience of connection with the Lord for each individual and congregation.'
            })}
          </p>
          <Link className="button" to="/about-us">
            {formatMessage({
              id: 'more',
              defaultMessage: 'More'
            })}
          </Link>
          {/*</div>*/}
          {/*<div>*/}
          {/*  <div className="imagevision"></div>*/}
          {/*</div>*/}
        </div>
      </section>
    </main>
  );
}
