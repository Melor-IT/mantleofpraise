import { useIntl } from 'react-intl';
import BackgroundImage from '../components/BackgroundImage';

export default function AboutUs() {
  const { formatMessage } = useIntl();

  return (
    <div className="page join-us">
      <section>
        <BackgroundImage url="/images/join-us-banner.png" />

        <div className="page-content">
          <h1>{formatMessage({ id: 'aboutUs', defaultMessage: 'About Us' })}</h1>

          <h3 style={{ marginTop: '2rem' }}>
            {formatMessage({
              id: 'aboutUsText',
              defaultMessage: 'The Spirit of the Lord GOD is upon me ...'
            })}
          </h3>

          <h3>
            {formatMessage({
              id: 'aboutUsTextOnder',
              aboutUsTextOnder: '- Isaiah 61:1-3'
            })}
          </h3>
        </div>
      </section>

      <section className="secondary">
        <div className="page-content">
          <div>
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
          </div>
          <div>
            <div className="imageH&S"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
