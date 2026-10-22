'use client';

import { Component, useEffect, useId, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useIntl } from 'react-intl';

function ViewerLoading() {
  const { formatMessage } = useIntl();
  return <p role="status">{formatMessage({ id: 'financialReportLoading' })}</p>;
}

const FinancialReportViewer = dynamic(() => import('./FinancialReportViewer'), {
  ssr: false,
  loading: ViewerLoading
});

class ViewerBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function FinancialReportModal({ report, children, triggerClassName }) {
  const { formatMessage } = useIntl();
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const outsidePointerRef = useRef(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const root = document.documentElement;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const previousBody = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width
    };
    const previousGutter = root.style.scrollbarGutter;
    root.style.scrollbarGutter = 'stable';
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    return () => {
      Object.assign(body.style, previousBody);
      root.style.scrollbarGutter = previousGutter;
      window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' });
    };
  }, [open]);

  function close() {
    dialogRef.current.close();
  }

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        className={triggerClassName}
        aria-label={report.title}
        aria-haspopup="dialog"
        onClick={() => {
          dialogRef.current.showModal();
          setOpen(true);
        }}
      >
        {children || report.title}
      </button>
      <dialog
        ref={dialogRef}
        className="financial-report-modal"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            close();
            return;
          }
          if (event.key !== 'Tab') return;
          const controls = event.currentTarget.querySelectorAll(
            'button:not([disabled]), a[href], [tabindex="0"], input:not([disabled]), select:not([disabled])'
          );
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && event.target === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && event.target === last) {
            event.preventDefault();
            first.focus();
          }
        }}
        onClose={() => {
          setOpen(false);
          outsidePointerRef.current = false;
          triggerRef.current?.focus({ preventScroll: true });
        }}
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
          if (outsidePointerRef.current && event.target === event.currentTarget) close();
          outsidePointerRef.current = false;
        }}
      >
        <div className="financial-report-modal__panel">
          <div className="financial-report-modal__heading">
            <h2 id={titleId}>{report.title}</h2>
            <button
              type="button"
              className="financial-report-modal__close"
              aria-label={formatMessage({ id: 'closeFinancialReport' })}
              onClick={close}
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
          </div>
          {open && (
            <div className="financial-report-modal__viewer">
              <ViewerBoundary
                fallback={<p role="alert">{formatMessage({ id: 'financialReportError' })}</p>}
              >
                <FinancialReportViewer report={report} />
              </ViewerBoundary>
            </div>
          )}
          <div className="financial-report-modal__actions">
            <a className="financial-report-modal__download" href={report.pdfUrl} download>
              {formatMessage({ id: 'downloadFinancialReport' })}
            </a>
            <p id={descriptionId}>
              {formatMessage({ id: 'financialReportViewerHelp' })}{' '}
              <a href={report.pdfUrl} target="_blank" rel="noopener noreferrer">
                {formatMessage({ id: 'openFinancialReport' })}
              </a>
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
