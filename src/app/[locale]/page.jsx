import { notFound } from 'next/navigation';
import { createIntl } from 'react-intl/server';
import Banner from '../../components/system/Banner';
import GridSteps from '../../components/system/GridSteps';
import ContentImageButton from '../../components/system/ContentImageButton';
import { messages, pageMetadata, pathFor } from '../../lib/site';

const serviceSteps = [
  {
    id: 'firstService',
    defaultTitle: 'Worship and Worshipers',
    image: '/images/firstService.jpg',
    imageClassName: 'sw'
  },
  {
    id: 'secondService',
    defaultTitle: 'Prophecy and Prophets',
    image: '/images/secondService.jpeg'
  },
  {
    id: 'thirdService',
    defaultTitle: 'Organizing Prayer and Worship Sessions',
    image: '/images/thirdService.jpg',
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
    imageAlt: text(step.id, step.defaultTitle),
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
        buttonText={text('introduction')}
        buttonHref={pathFor(locale, 'introduction')}
      />
    </div>
  );
}
