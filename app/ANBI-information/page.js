'use client';

import { useIntl } from 'react-intl';
import BackgroundImage from '../../components/BackgroundImage';


export default function ANBIInformationPage({ locale, setLocale }) {
  const { formatMessage } = useIntl();

  return (
    <div className="page ANBI-Information">
      {/* Header */}
      <section>
        <BackgroundImage
          url="/images/ANBI-banner.jpg"
          className="ANBIinformation"
        />
        <div className="page-content">
          <h1>
            {formatMessage({
              id: 'beleidsplanTitle',
              defaultMessage: 'Beleidsplan Stichting Mantle of Praise'
            })}
          </h1>
        </div>
      </section>

      {/* Section 1 – Doelstelling */}
      <section className="primary">
        <div className="page-content">
          <div className="text-block">
            <h2>
              {formatMessage({
                id: 'policyGoalsTitle',
                defaultMessage: '1. Doelstelling van de instelling'
              })}
            </h2>
            <p>
              {formatMessage({
                id: 'policyGoalsIntro',
                defaultMessage: 'De organisatie Stichting Mantle of Praise heeft als doel:'
              })}
            </p>
            <ul>
              <li>{formatMessage({ id: 'policyGoals1', defaultMessage: 'Het bevorderen van christelijke aanbidding en geestelijke vorming.' })}</li>
              <li>{formatMessage({ id: 'policyGoals2', defaultMessage: 'Het opleiden en begeleiden van aanbidders, muzikanten en geestelijke leiders.' })}</li>
              <li>{formatMessage({ id: 'policyGoals3', defaultMessage: 'Het ondersteunen van kerken en christelijke gemeenschappen door middel van aanbidding, onderwijs en samenwerking.' })}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2 – Activiteiten */}
      <section className="secondary">
        <div className="page-content">
          <div className="text-block">
            <h2>
              {formatMessage({
                id: 'policyActivitiesTitle',
                defaultMessage: '2. Activiteiten om dit doel te bereiken'
              })}
            </h2>
            <ul>
              <li>{formatMessage({ id: 'policyActivities1', defaultMessage: 'Het organiseren van aanbidding bijeenkomsten, conferenties en trainingen.' })}</li>
              <li>{formatMessage({ id: 'policyActivities2', defaultMessage: 'Het ontwikkelen en beschikbaar stellen van liederen, materialen en hulpmiddelen voor aanbidding.' })}</li>
              <li>{formatMessage({ id: 'policyActivities3', defaultMessage: 'Het geven van onderwijs en begeleiding aan leden en deelnemers.' })}</li>
              <li>{formatMessage({ id: 'policyActivities4', defaultMessage: 'Het bevorderen van samenwerking tussen kerken en christelijke organisaties.' })}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3 – Inkomsten */}
      <section className="primary">
        <div className="page-content">
          <div className="text-block">
            <h2>
              {formatMessage({
                id: 'policyIncomeTitle',
                defaultMessage: '3. Inkomstenbronnen'
              })}
            </h2>
            <p>
              {formatMessage({
                id: 'policyIncomeIntro',
                defaultMessage: 'De inkomsten van de organisatie bestaan uit:'
              })}
            </p>
            <ul>
              <li>{formatMessage({ id: 'policyIncome1', defaultMessage: 'Vrijwillige bijdragen en donaties van particulieren en kerken.' })}</li>
              <li>{formatMessage({ id: 'policyIncome2', defaultMessage: 'Collecten en giften tijdens bijeenkomsten en evenementen.' })}</li>
              <li>{formatMessage({ id: 'policyIncome3', defaultMessage: 'Eventuele bijdragen van samenwerkende organisaties of fondsen.' })}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 4 – Besteding */}
      <section className="secondary">
        <div className="page-content">
          <div className="text-block">
            <h2>
              {formatMessage({
                id: 'policyExpensesTitle',
                defaultMessage: '4. Besteding van de middelen'
              })}
            </h2>
            <p>
              {formatMessage({
                id: 'policyExpensesIntro',
                defaultMessage: 'De bestedingen van de organisatie zijn gericht op:'
              })}
            </p>
            <ul>
              <li>{formatMessage({ id: 'policyExpenses1', defaultMessage: 'Het organiseren van activiteiten en evenementen.' })}</li>
              <li>{formatMessage({ id: 'policyExpenses2', defaultMessage: 'Onderwijs, training en begeleiding van leden en deelnemers.' })}</li>
              <li>{formatMessage({ id: 'policyExpenses3', defaultMessage: 'Aanschaf van muziekinstrumenten, apparatuur en materialen.' })}</li>
              <li>{formatMessage({ id: 'policyExpenses4', defaultMessage: 'Ondersteuning van kerken en bedieningen.' })}</li>
              <li>{formatMessage({ id: 'policyExpenses5', defaultMessage: 'Algemene beheers- en organisatiekosten.' })}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 5 – Beheer van het vermogen */}
      <section className="primary">
        <div className="page-content">
          <div className="text-block">
            <h2>
              {formatMessage({
                id: 'policyAssetsTitle',
                defaultMessage: '5. Beheer van het vermogen'
              })}
            </h2>
            <p>
              {formatMessage({
                id: 'policyAssetsText',
                defaultMessage: 'Het vermogen van de organisatie wordt zorgvuldig en transparant beheerd door het bestuur, conform de statuten en onder toezicht van de penningmeester en de commissie met toezicht. De middelen worden uitsluitend besteed aan de verwezenlijking van de doelstellingen.'
              })}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
