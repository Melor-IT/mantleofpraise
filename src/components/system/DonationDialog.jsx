'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import DonationDetails from './DonationDetails';
import { donation } from '../../data/donation';

const DonationContext = createContext(null);

export function useDonation() {
  return useContext(DonationContext);
}

export default function DonationProvider({ qrDataUrl, children }) {
  const { formatMessage } = useIntl();
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(null);
  const outsidePointerRef = useRef(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousGutter = document.documentElement.style.scrollbarGutter;
    document.documentElement.style.scrollbarGutter = 'stable';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.scrollbarGutter = previousGutter;
    };
  }, [open]);

  function openDonation(trigger) {
    returnFocusRef.current = trigger.closest('.mobile-menu')
      ? document.querySelector('.hamburger')
      : trigger;
    dialogRef.current.showModal();
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    returnFocusRef.current?.focus({ preventScroll: true });
  }

  return (
    <DonationContext.Provider value={openDonation}>
      {children}
      <dialog
        className="donation-dialog"
        ref={dialogRef}
        aria-labelledby="donation-dialog-title"
        aria-describedby="donation-dialog-description"
        onClose={handleClose}
        onPointerDown={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          outsidePointerRef.current =
            event.target === event.currentTarget &&
            (event.clientX < rect.left ||
              event.clientX > rect.right ||
              event.clientY < rect.top ||
              event.clientY > rect.bottom);
        }}
        onClick={(event) => {
          if (outsidePointerRef.current && event.target === event.currentTarget) {
            dialogRef.current.close();
          }
          outsidePointerRef.current = false;
        }}
      >
        <div className="donation-dialog__panel">
          <button
            type="button"
            className="donation-dialog__close"
            aria-label={formatMessage({ id: 'closeDonation' })}
            onClick={() => dialogRef.current.close()}
            autoFocus
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="donation-dialog__heading">
            <h2 id="donation-dialog-title">{formatMessage({ id: 'donationTitle' })}</h2>
            <p id="donation-dialog-description">{formatMessage({ id: 'donationIntro' })}</p>
          </div>
          <DonationDetails account={donation} qrDataUrl={qrDataUrl} />
        </div>
      </dialog>
    </DonationContext.Provider>
  );
}
