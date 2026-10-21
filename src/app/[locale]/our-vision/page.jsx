import { notFound } from 'next/navigation';
import { createIntl } from 'react-intl/server';
import Hero from '../../../components/system/Hero';
import ContentSection from '../../../components/system/ContentSection';
import { messages, pageMetadata } from '../../../lib/site';

const sections = [
  {
    title: { id: 'unityPrayerWorshipTitle', defaultMessage: 'Unity in Prayer and True Worship' },
    description: {
      id: 'unityPrayerWorshipIntro',
      defaultMessage:
        'Christian faith is not merely an individual faith. From the beginning of the Bible, God gathers His people to worship Him together. True worship becomes more powerful when believers unite their hearts and spirits.'
    },
    className: 'primary'
  },
  {
    title: {
      id: 'godThroneTitle',
      defaultMessage: 'God enthroned through the praise of His people'
    },
    description: {
      id: 'godThroneText',
      defaultMessage:
        'Psalm 22:3: "Yet you are holy, enthroned on the praises of Israel." When God’s people lift their voices together, He sits enthroned on their worship, establishing His presence on earth.'
    },
    className: 'secondary'
  },
  {
    title: { id: 'godsThroneAmongPeopleTitle', defaultMessage: 'God’s throne among His people' },
    description: {
      id: 'godsThroneAmongPeopleText',
      defaultMessage:
        'Jeremiah 49:38: "I will set up my throne there." When we unite in prayer and worship, God’s throne is established, and His authority is revealed in our church.'
    },
    className: 'primary'
  },
  {
    title: { id: 'godsTempleTitle', defaultMessage: 'We are God’s temple' },
    description: {
      id: 'godsTempleText',
      defaultMessage:
        '1 Corinthians 3:16: "Do you not know that you are God’s temple and that God’s Spirit dwells in you?" Each believer is a living temple, and together we form a greater temple where God’s presence is revealed.'
    },
    className: 'secondary'
  },
  {
    title: { id: 'worshipSpiritTruthTitle', defaultMessage: 'Worship in Spirit and Truth' },
    description: {
      id: 'worshipSpiritTruthText',
      defaultMessage:
        'John 4:20-23: True worshipers will worship the Father in spirit and truth. True worship occurs when our whole being aligns with God’s truth.'
    },
    className: 'primary'
  },
  {
    title: { id: 'applicationTodayTitle', defaultMessage: 'Application for Today' },
    description: {
      id: 'applicationTodayText',
      defaultMessage:
        'Acts 2:46-47: When our prayer and worship are united, God’s presence comes in a fresh way, the enemy is defeated, our faith grows stronger, and others see God’s glory and are drawn to Christ.'
    },
    className: 'secondary'
  }
];

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale, 'our-vision');
}

export default async function OurVision({ params }) {
  const { locale } = await params;
  if (!Object.hasOwn(messages, locale)) notFound();
  const { formatMessage } = createIntl({ locale, messages: messages[locale] });

  return (
    <div className="page OurVision">
      <Hero
        title={formatMessage({ id: 'ourVisionTitle', defaultMessage: 'Our Vision' })}
        backgroundImage="/images/ourvision-banner.png"
        backgroundClassName="OurVisionHeader"
        contentClassName="page-content"
      />
      {sections.map((section) => (
        <ContentSection
          key={section.title.id}
          title={formatMessage(section.title)}
          description={formatMessage(section.description)}
          className={section.className}
        />
      ))}
    </div>
  );
}
