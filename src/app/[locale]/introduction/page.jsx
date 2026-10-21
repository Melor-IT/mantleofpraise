import { notFound } from 'next/navigation';
import Hero from '../../../components/system/Hero';
import ContentSection from '../../../components/system/ContentSection';
import GridSteps from '../../../components/system/GridSteps';
import ContentImageButton from '../../../components/system/ContentImageButton';
import introduction from '../../../data/introduction';
import { pageMetadata, pathFor } from '../../../lib/site';

const serviceImages = [
  '/images/Worship-Praise-clean.jpeg',
  '/images/prayer-spiritual-fellowship.png',
  '/images/open-bible.jpg',
  '/images/thirdService.jpg',
  '/images/home-banner.jpg',
  '/images/community-service.png',
];

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale, 'introduction');
}

export default async function Introduction({ params }) {
  const { locale } = await params;
  if (!Object.hasOwn(introduction, locale)) notFound();
  const content = introduction[locale];
  const listItems = (items) => items.map(([title, description]) => `${title}: ${description}`);

  return (
    <div className="page introduction">
      <Hero
        title={content.title}
        intro={content.tagline}
        backgroundImage="/images/introduction-faces-v2.jpg"
      />
      <ContentImageButton
        title={content.aboutTitle}
        description={content.about.join(' ')}
        buttonText={content.servicesButton}
        buttonHref="#services"
      />
      <ContentSection title={content.missionTitle} paragraphs={content.mission} />
      <ContentSection
        title={content.visionTitle}
        paragraphs={content.vision}
        className="secondary"
        ornament
      />
      <GridSteps
        id="services"
        title={content.servicesTitle}
        description={content.servicesIntro}
        backgroundImage="/images/back2.jpg"
        steps={content.services.map(([title, description], index) => ({
          id: `service-${index}`,
          title,
          description,
          image: serviceImages[index],
          imageAlt: title
        }))}
      />
      <ContentSection title={content.valuesTitle} items={listItems(content.values)} />
      <ContentSection
        title={content.churchesTitle}
        paragraphs={content.churches}
        className="secondary"
      />
      <ContentSection title={content.membershipTitle} paragraphs={content.membership} />
      <ContentSection
        title={content.requirementsTitle}
        description={content.requirementsIntro}
        items={listItems(content.requirements)}
        className="secondary"
      />
      <ContentSection title={content.stepsTitle} items={listItems(content.steps)} ordered />
      <ContentImageButton
        title={content.closingTitle}
        description={content.closing.join(' ')}
        buttonText={content.membershipButton}
        buttonHref={`${pathFor(locale, 'join-us')}#membership-form`}
      />
    </div>
  );
}
