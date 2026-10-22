import { notFound } from 'next/navigation';
import { createIntl } from 'react-intl/server';
import Hero from '../../../components/system/Hero';
import ContentSection from '../../../components/system/ContentSection';
import AnnualFinancialReports from '../../../components/system/AnnualFinancialReports';
import { messages, pageMetadata } from '../../../lib/site';

const sections = [
  {
    title: { id: 'policyGoalsTitle', defaultMessage: '1. Doelstellingen van de stichting' },
    description: {
      id: 'policyGoalsIntro',
      defaultMessage: 'Stichting Mantle of Praise heeft de volgende doelstellingen:'
    },
    items: [
      {
        id: 'policyGoals1',
        defaultMessage: 'Het bevorderen van christelijke aanbidding en geestelijke vorming.'
      },
      {
        id: 'policyGoals2',
        defaultMessage:
          'Het opleiden en begeleiden van aanbidders, muzikanten en geestelijke leiders.'
      },
      {
        id: 'policyGoals3',
        defaultMessage:
          'Het ondersteunen van kerken en christelijke gemeenschappen door middel van aanbidding, onderwijs en samenwerking.'
      }
    ],
    className: 'primary'
  },
  {
    title: {
      id: 'policyActivitiesTitle',
      defaultMessage: '2. Activiteiten om deze doelstellingen te bereiken'
    },
    items: [
      {
        id: 'policyActivities1',
        defaultMessage: 'Het organiseren van aanbiddingsbijeenkomsten, conferenties en trainingen.'
      },
      {
        id: 'policyActivities2',
        defaultMessage:
          'Het ontwikkelen en beschikbaar stellen van liederen, materialen en hulpmiddelen voor aanbidding.'
      },
      {
        id: 'policyActivities3',
        defaultMessage: 'Het geven van onderwijs en begeleiding aan leden en deelnemers.'
      },
      {
        id: 'policyActivities4',
        defaultMessage:
          'Het bevorderen van samenwerking tussen kerken en christelijke organisaties.'
      }
    ],
    className: 'secondary'
  },
  {
    title: { id: 'policyIncomeTitle', defaultMessage: '3. Inkomstenbronnen' },
    description: {
      id: 'policyIncomeIntro',
      defaultMessage: 'De inkomsten van de organisatie bestaan uit:'
    },
    items: [
      {
        id: 'policyIncome1',
        defaultMessage: 'Vrijwillige bijdragen en donaties van particulieren en kerken.'
      },
      {
        id: 'policyIncome2',
        defaultMessage: 'Collecten en giften tijdens bijeenkomsten en evenementen.'
      },
      {
        id: 'policyIncome3',
        defaultMessage: 'Eventuele bijdragen van samenwerkende organisaties of fondsen.'
      }
    ],
    className: 'primary'
  },
  {
    title: { id: 'policyExpensesTitle', defaultMessage: '4. Besteding van de middelen' },
    description: {
      id: 'policyExpensesIntro',
      defaultMessage: 'De bestedingen van de organisatie zijn gericht op:'
    },
    items: [
      { id: 'policyExpenses1', defaultMessage: 'Het organiseren van activiteiten en evenementen.' },
      {
        id: 'policyExpenses2',
        defaultMessage: 'Onderwijs, training en begeleiding van leden en deelnemers.'
      },
      {
        id: 'policyExpenses3',
        defaultMessage: 'Aanschaf van muziekinstrumenten, apparatuur en materialen.'
      },
      { id: 'policyExpenses4', defaultMessage: 'Ondersteuning van kerken en bedieningen.' },
      { id: 'policyExpenses5', defaultMessage: 'Algemene beheers- en organisatiekosten.' }
    ],
    className: 'secondary'
  },
  {
    title: { id: 'policyAssetsTitle', defaultMessage: '5. Beheer van het vermogen' },
    description: {
      id: 'policyAssetsText',
      defaultMessage:
        'Het bestuur beheert het vermogen van de stichting zorgvuldig en transparant, in overeenstemming met de statuten en onder toezicht van de penningmeester en de toezichtscommissie. De middelen worden uitsluitend besteed aan het realiseren van de doelstellingen van de stichting.'
    },
    className: 'primary'
  }
];

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale, 'ANBI-information');
}

export default async function ANBIInformation({ params }) {
  const { locale } = await params;
  if (!Object.hasOwn(messages, locale)) notFound();
  const { formatMessage } = createIntl({ locale, messages: messages[locale] });

  return (
    <div className="page ANBI-Information">
      <Hero
        title={formatMessage({
          id: 'beleidsplanTitle',
          defaultMessage: 'Beleidsplan Stichting Mantle of Praise'
        })}
        backgroundImage="/images/ANBI-banner.jpg"
        backgroundClassName="ANBIinformation"
        contentClassName="page-content"
      />
      {sections.map((section) => (
        <ContentSection
          key={section.title.id}
          title={formatMessage(section.title)}
          description={section.description ? formatMessage(section.description) : undefined}
          items={section.items?.map((item) => formatMessage(item))}
          className={section.className}
        />
      ))}
      <AnnualFinancialReports locale={locale} />
    </div>
  );
}
