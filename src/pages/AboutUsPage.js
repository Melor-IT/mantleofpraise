import { useIntl } from 'react-intl';
import BackgroundImage from '../components/BackgroundImage';

export default function AboutUs() {
  const { formatMessage } = useIntl();

  const leadershipTeam = [
    {
      img: '/images/sima.jpg',
      alt: 'Sima Sasanfar',
      nameId: 'sima',
      defaultName: 'Sima Sasanfar',
      roleId: 'chairperson',
      defaultRole: 'Chairperson'
    },
    {
      img: '/images/hamid.jpg',
      alt: 'Hamid Ghanbari',
      nameId: 'hamid',
      defaultName: 'Hamid Ghanbari',
      roleId: 'secretary',
      defaultRole: 'Secretary'
    }
    //  {
    //   img: '/images/homa.jpg',
    //   alt: 'Homa K Mohammadi',
    //   nameId: 'homa',
    //   defaultName: 'Homa Mohammadi'
    // }
    // {
    //   img: '/images/alireza.jpg',
    //   alt: 'Ali Reza Shayan',
    //   nameId: 'alireza',
    //   defaultName: 'Ali Reza Shayan'
    // },
    // {
    //   img: '/images/atena.jpg',
    //   alt: 'Atena Gholami',
    //   nameId: 'atena',
    //   defaultName: 'Atena Gholami'
    // },
  ];

  const supervisoryTeam = [
    {
      img: '/images/kamil.jpg',
      alt: 'Kamil Navai',
      nameId: 'kamil',
      defaultName: 'Pastor Kamil Navai',
      roleId: 'advisoryBoardMember',
      defaultRole: 'Advisory Board Member'
    },
    {
      img: '/images/sahar.jpg',
      alt: 'Sahar Apistola',
      nameId: 'sahar',
      defaultName: 'Sahar Apistola'
    },
    {
      img: '/images/kazem.jpg',
      alt: 'Kazem Dehghanie',
      nameId: 'Kazem',
      defaultName: 'Kazem Dehghanie',
      roleId: 'treasurer',
      defaultRole: 'Treasurer'
    }
  ];

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
              defaultMessage: '- Isaiah 61:1-3'
            })}
          </h3>
        </div>
      </section>

      <section className="primary">
        <div className="page-content">
          <div className="text-block">
            <h2>
              {formatMessage({
                id: 'leader',
                defaultMessage: 'Our Vision'
              })}
            </h2>

            <p>
              {formatMessage({
                id: 'leaderText',
                defaultMessage: 'Our vision is to form an inspiring community...'
              })}
            </p>
          </div>

          <div className="team">
            {leadershipTeam.map((member, index) => (
              <div className="team-member" key={index}>
                <img src={member.img} alt={member.alt} />

                <strong>
                  {formatMessage({
                    id: member.nameId,
                    defaultMessage: member.defaultName
                  })}
                </strong>

                {member.roleId && (
                  <p>
                    {formatMessage({
                      id: member.roleId,
                      defaultMessage: member.defaultRole
                    })}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="secondary">
        <div className="page-content">
          <div className="text-block">
            <h2>
              {formatMessage({
                id: 'supervisoryCommission',
                defaultMessage: 'Supervisory Commission'
              })}
            </h2>

            <p>
              {formatMessage({
                id: 'supervisoryCommissionText',
                defaultMessage:
                  'The Supervisory Commission of the Reda-ye Setayesh Service Organization...'
              })}
            </p>
          </div>

          <div className="team">
            {supervisoryTeam.map((member, index) => (
              <div className="team-member" key={index}>
                <img src={member.img} alt={member.alt} />

                <strong>
                  {formatMessage({
                    id: member.nameId,
                    defaultMessage: member.defaultName
                  })}
                </strong>

                {member.roleId && (
                  <p>
                    {formatMessage({
                      id: member.roleId,
                      defaultMessage: member.defaultRole
                    })}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
