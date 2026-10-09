'use client';

import { useIntl } from 'react-intl';
import { useDonation } from './DonationDialog';

export default function DonationButton({ onClick }) {
  const { formatMessage } = useIntl();
  const openDonation = useDonation();

  return (
    <button
      type="button"
      className="donation-button"
      aria-haspopup="dialog"
      onClick={(event) => {
        onClick?.(event);
        openDonation(event.currentTarget);
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path
          d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{formatMessage({ id: 'donate', defaultMessage: 'Donate' })}</span>
    </button>
  );
}
