'use client';

import { useId } from 'react';
import { useIntl } from 'react-intl';
import { partners as defaultPartners } from '../../data/partners';

export default function Partners({ partners = defaultPartners }) {
  const { formatMessage } = useIntl();
  const headingId = useId();

  if (!partners.length) return null;

  return (
    <section className="partners" aria-labelledby={headingId}>
      <div className="page-content">
        <div className="partners__heading">
          <h2 id={headingId}>{formatMessage({ id: 'partnersTitle' })}</h2>
          <p>{formatMessage({ id: 'partnersSubtitle' })}</p>
        </div>
        <ul className="partners-grid" role="list">
          {partners.map((partner) => {
            const logo = (
              <img
                src={partner.logo}
                alt={partner.name}
                width={192}
                height={120}
                loading="lazy"
                decoding="async"
              />
            );
            const external = /^https?:\/\//i.test(partner.href || '');

            return (
              <li key={partner.id}>
                {partner.href ? (
                  <a
                    className="partner-card"
                    href={partner.href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                  >
                    {logo}
                  </a>
                ) : (
                  <div className="partner-card">{logo}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
