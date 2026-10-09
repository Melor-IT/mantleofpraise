import { notFound } from 'next/navigation';
import { createIntl } from 'react-intl/server';
import Hero from '../../../components/system/Hero';
import Lead from '../../../components/system/Lead';
import { messages, pageMetadata } from '../../../lib/site';

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

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale, 'about-us');
}

export default async function AboutUs({ params }) {
  const { locale } = await params;
  if (!Object.hasOwn(messages, locale)) notFound();

  const { formatMessage } = createIntl({ locale, messages: messages[locale] });
  const text = (id, defaultMessage = '') => formatMessage({ id, defaultMessage });
  const localizeMembers = (members) =>
    members.map((member) => ({
      id: member.nameId,
      image: member.img,
      imageAlt: member.alt,
      name: text(member.nameId, member.defaultName),
      role: member.roleId ? text(member.roleId, member.defaultRole) : undefined
    }));

  return (
    <div className="page juin-us">
      <Hero
        title={text('aboutUs', 'About Us')}
        intro={text('aboutUsText', 'The Spirit of the Lord GOD is upon me ...')}
        reference={text('aboutUsTextOnder', '- Isaiah 61:1-3')}
        backgroundImage="/images/join-us-banner.png"
        backgroundClassName="aboutus"
      />
      <Lead
        title={text('leader', 'Our Vision')}
        description={text('leaderText', 'Our vision is to form an inspiring community...')}
        members={localizeMembers(leadershipTeam)}
      />
      <Lead
        title={text('supervisoryCommission', 'Supervisory Commission')}
        description={text(
          'supervisoryCommissionText',
          'The Supervisory Commission of the Reda-ye Setayesh Service Organization...'
        )}
        members={localizeMembers(supervisoryTeam)}
        className="secondary"
      />
    </div>
  );
}
