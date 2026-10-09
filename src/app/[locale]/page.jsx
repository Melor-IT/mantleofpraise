import { notFound } from 'next/navigation';
import { createIntl } from 'react-intl/server';
import Banner from '../../components/system/Banner';
import GridSteps from '../../components/system/GridSteps';
import ContentImageButton from '../../components/system/ContentImageButton';
import { messages, pageMetadata, pathFor } from '../../lib/site';

const serviceSteps = [
  {
    id: 'firstService',
    defaultTitle: 'Organizing Prayer and Worship Sessions',
    image: '/images/firstService.jpg',
    imageAlt: 'Organizing Prayer and Worship Sessions',
    imageClassName: 'sw'
  },
  {
    id: 'secondService',
    defaultTitle: 'Equipping Worshipers',
    image: '/images/secondService.jpeg',
    imageAlt: 'Equipping Worshipers'
  },
  {
    id: 'thirdService',
    defaultTitle: 'Nurturing Prophets',
    image: '/images/thirdService.jpg',
    imageAlt: 'Nurturing Prophets',
    imageClassName: 'ne'
  }
];

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale);
}

export default async function Home({ params }) {
  const { locale } = await params;
  if (!Object.hasOwn(messages, locale)) notFound();

  const { formatMessage } = createIntl({ locale, messages: messages[locale] });
  const text = (id, defaultMessage = '') => formatMessage({ id, defaultMessage });
  const steps = serviceSteps.map((step) => ({
    ...step,
    title: text(step.id, step.defaultTitle),
    description: text(`${step.id}Text`)
  }));

  return (
    <div className="page home">
      <Banner
        title={text('mantleOfPraise', 'Mantle of Praise')}
        subtitle={text('welcomeTo', 'Welcome to')}
        backgroundImage="/images/home-banner.jpg"
      />
      <GridSteps
        title={text('ourMission', 'Our Mission')}
        description={text('ourMissionText')}
        backgroundImage="/images/back2.jpg"
        steps={steps}
      />
      <ContentImageButton
        title={text('aboutUs', 'About Us')}
        description={text('aboutUsSectionText')}
        buttonText={text('more', 'More')}
        buttonHref={pathFor(locale, 'about-us')}
      />
    </div>
  );
}
