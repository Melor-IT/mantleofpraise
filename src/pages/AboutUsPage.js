import { useIntl } from 'react-intl';
import BackgroundImage from '../components/BackgroundImage';

export default function AboutUs() {
  const { formatMessage } = useIntl();

  return (
    <div className="page juin-us">
      <section>
        <BackgroundImage url="/images/join-us-banner.png" className="aboutus" />

        <div className="page-content ">
          <h1>{formatMessage({ id: 'aboutUs', defaultMessage: 'About Us' })}</h1>

          <h3 className="page-intro">
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

              <p>
                {formatMessage({
                  id: 'chairperson',
                  defaultMessage: 'Chairperson'
                })}
              </p>
            </div>

            <div className="team-member">
              <img src="/images/hamid.jpg" alt="Hamid Ghanbari" />
              <strong>
                {formatMessage({
                  id: 'hamid',
                  defaultMessage: 'Hamid Ghanbari'
                })}
              </strong>
              <p>
                {formatMessage({
                  id: 'secretary',
                  defaultMessage: 'Secretary'
                })}
              </p>
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
      <section className="secondary">
        <div className="page-content">
          <div className="text-block">
            <h2>
              {formatMessage({
                id: 'supervisoryCommission',
                defaultMessage: 'OSupervisory Commission'
              })}
            </h2>

            <p>
              {formatMessage({
                id: 'supervisoryCommissionText',
                defaultMessage: `The Supervisory Commission of the Reda-ye Setayesh Service Organization is composed of Levites from the member churches. Its responsibility is to oversee the spiritual integrity of the organization, provide pastoral and spiritual support to its members and activities, and ensure that the organization operates within biblical principles.`
              })}
            </p>
          </div>
          <div className="team">
            <div className="team-member">
              <img src="/images/kamil.jpg" alt="Kamil Navai" />
              <strong>
                {formatMessage({
                  id: 'kamil',
                  defaultMessage: 'Pastor Kamil Navai'
                })}
              </strong>

              <p>
                {formatMessage({
                  id: 'advisoryBoardMember',
                  defaultMessage: 'Advisory Board Member'
                })}
              </p>
            </div>

            <div className="team-member">
              <img src="/images/babak.jpg" alt="Babak Zeynalie" />
              <strong>
                {formatMessage({
                  id: 'babak',
                  defaultMessage: ''
                })}
              </strong>
            </div>

            <div className="team-member">
              <img src="/images/kazem.jpg" alt="Kazem Dehghanie" />
              <strong>
                {' '}
                {formatMessage({
                  id: 'Kazem',
                  defaultMessage: 'Kazem Dehghanie'
                })}
              </strong>
              <p>
                {formatMessage({
                  id: 'treasurer',
                  defaultMessage: 'Treasurer'
                })}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
