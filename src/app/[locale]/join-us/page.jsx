import { notFound } from 'next/navigation';
import { createIntl } from 'react-intl/server';
import Hero from '../../../components/system/Hero';
import TeamIntro from '../../../components/system/TeamIntro';
import MembershipForm from '../../../components/system/MembershipForm';
import { messages, pageMetadata } from '../../../lib/site';

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale, 'join-us');
}

export default async function JoinUs({ params }) {
  const { locale } = await params;
  if (!Object.hasOwn(messages, locale)) notFound();
  const { formatMessage } = createIntl({ locale, messages: messages[locale] });

  return (
    <div className="page join-us">
      <Hero
        title={formatMessage({ id: 'joinUs', defaultMessage: 'Join Us' })}
        intro={formatMessage({
          id: 'joinUsText',
          defaultMessage:
            'And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together, as some are in the habit of doing, but encouraging one another—and all the more as you see the Day approaching.'
        })}
        reference={formatMessage({ id: 'joinUsTextOnder', defaultMessage: '- Hebrews 10:24-25' })}
        backgroundImage="/images/juneUs.png"
        contentClassName="page-content"
      />
      <TeamIntro
        title={formatMessage({ id: 'team', defaultMessage: 'our team' })}
        description={formatMessage({ id: 'teamText', defaultMessage: '' })}
        image="/images/HS.jpg"
        imageAlt="Hamid and Sima, Mantle of Praise leaders"
      />
      <MembershipForm />
    </div>
  );
}
