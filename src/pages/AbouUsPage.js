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
              id: "aboutUsText",
              defaultMessage:"The Spirit of the Lord GOD is upon me ..."
            })} 
          </h3>
          
          <h3>
            {formatMessage({
              id: "aboutUsTextOnder",
              aboutUsTextOnder:"- Isaiah 61:1-3"
            })} 
          </h3>

        </div>
      </section>
    </div>
  );
}
