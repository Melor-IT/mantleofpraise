'use client';

import { useState } from 'react';
import { useIntl } from 'react-intl';

export default function DonationDetails({ account, qrDataUrl }) {
  const { formatMessage } = useIntl();
  const [copyStatus, setCopyStatus] = useState('');
  const text = (id) => formatMessage({ id });

  async function copyIban() {
    try {
      await navigator.clipboard.writeText(account.iban);
      setCopyStatus('ibanCopied');
    } catch {
      setCopyStatus('ibanCopyFailed');
    }
  }

  return (
    <section className="donation-details" aria-labelledby="bank-details-title">
      <div className="page-content">
        <div
          className={`donation-details__card ${qrDataUrl ? '' : 'donation-details__card--bank-only'}`}
        >
          <div className="donation-details__account">
            <h2 id="bank-details-title">{text('bankDetails')}</h2>
            <dl>
              <div>
                <dt>{text('organization')}</dt>
                <dd>{account.organization}</dd>
              </div>
              <div>
                <dt>IBAN</dt>
                <dd className="donation-details__iban" dir="ltr">
                  {account.iban}
                </dd>
              </div>
              <div>
                <dt>{text('chamberOfCommerceTitle')}</dt>
                <dd dir="ltr">{account.kvk}</dd>
              </div>
              <div>
                <dt>RSIN</dt>
                <dd dir="ltr">{account.rsin}</dd>
              </div>
            </dl>
            <button className="donation-details__copy" type="button" onClick={copyIban}>
              {text('copyIban')}
            </button>
            <p className="donation-details__status" role="status" aria-live="polite">
              {copyStatus ? text(copyStatus) : ''}
            </p>
          </div>
          {qrDataUrl && (
            <figure className="donation-details__qr">
              <h2>{text('donationQrTitle')}</h2>
              <img src={qrDataUrl} width={280} height={280} alt={text('donationQrAlt')} />
              <figcaption>{text('donationQrDescription')}</figcaption>
              <a
                className="donation-details__payment"
                href={account.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {text('openPayment')}
              </a>
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}
