import { useIntl } from 'react-intl';
import BackgroundImage from '../components/BackgroundImage';

export default function OurVision() {
  const { formatMessage } = useIntl();

  return (
    <div className="page our-vision">

      <section>
        <BackgroundImage url="/images/join-us-banner.png" className="ourVision" />

        <div className="page-content ">
          <h1>{formatMessage({ id: 'ourVision', defaultMessage: 'Our Vision' })}</h1>

          <h3 className='page-intro'>
            {formatMessage({
              id: 'ourVisionText',
              defaultMessage: ''
            })}
          </h3>

          <h3>
            {formatMessage({
              id: 'ourVisionTextOnder',
              aboutUsTextOnder: ''
            })}
          </h3>
        </div>

      </section>

      <section className="primary">
        <div className="page-content">
          <div className="text-block">
            <h2>
              {formatMessage({
                id: 'leder',
                defaultMessage: 'Our Vision'
              })}
            </h2>

            <p>
              {formatMessage({
                id: 'lederText',
                defaultMessage:
                  'Our vision is to form an inspiring community of worshipers and prophets who, through music and worship filled with the guidance of the Holy Spirit, spread the light and presence of God in churches, awaken and heal every heart, and create a living, deep, and lasting experience of connection with the Lord for each individual and congregation.'
              })}
            </p>
          </div>
          <div className="team">
            <div className="team-member">
              <img src="/images/sima.jpg" alt="Sima Sasanfar" />
              <strong>
                {formatMessage({
                  id: 'sima',
                  defaultMessage: 'Sima Sasanfar'
                })}
              </strong>
            </div>

            <div className="team-member">
              <img src="/images/hamid.jpg" alt="Hamid Ghanbari" />
              <strong>
                {formatMessage({
                  id: 'hamid',
                  defaultMessage: 'Hamid Ghanbari'
                })}
              </strong>
            </div>

            <div className="team-member">
              <img src="/images/alireza.jpg" alt="Ali Reza Shayan" />
              <strong>
                {formatMessage({
                  id: 'alireza',
                  defaultMessage: 'Ali Reza Shayan'
                })}
              </strong>
            </div>

            <div className="team-member">
              <img src="/images/atena.jpg" alt="Atena Gholami" />
              <strong>
                {' '}
                {formatMessage({
                  id: 'atena',
                  defaultMessage: 'Atena Gholami'
                })}
              </strong>
            </div>

            <div className="team-member">
              <img src="/images/homa.jpg" alt="Homa K Mohammadi" />
              <strong>
                {' '}
                {formatMessage({
                  id: 'homa',
                  defaultMessage: 'Homa Mohammadi'
                })}
              </strong>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
