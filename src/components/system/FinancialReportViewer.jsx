'use client';

import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

const assetBase = `/pdf-viewer/${pdfjs.version}`;
pdfjs.GlobalWorkerOptions.workerSrc = `${assetBase}/pdf.worker.min.mjs`;
const options = {
  cMapUrl: `${assetBase}/cmaps/`,
  standardFontDataUrl: `${assetBase}/standard_fonts/`,
  wasmUrl: `${assetBase}/wasm/`
};

export default function FinancialReportViewer({ report }) {
  const { formatMessage, formatNumber } = useIntl();
  const viewportRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    const observer = new ResizeObserver(() => setWidth(Math.max(1, viewport.clientWidth - 32)));
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  function changePage(nextPage) {
    setPage(Math.min(pageCount, Math.max(1, nextPage)));
    viewportRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  const loading = <p role="status">{formatMessage({ id: 'financialReportLoading' })}</p>;
  const error = <p role="alert">{formatMessage({ id: 'financialReportError' })}</p>;

  return (
    <div className="financial-report-viewer">
      <div className="financial-report-viewer__toolbar">
        <button type="button" disabled={page <= 1} onClick={() => changePage(page - 1)}>
          {formatMessage({ id: 'financialReportPreviousPage' })}
        </button>
        <span aria-live="polite" aria-atomic="true">
          {pageCount
            ? formatMessage({ id: 'financialReportPage' }, { page, total: pageCount })
            : '—'}
        </span>
        <button
          type="button"
          disabled={!pageCount || page >= pageCount}
          onClick={() => changePage(page + 1)}
        >
          {formatMessage({ id: 'financialReportNextPage' })}
        </button>
        <div className="financial-report-viewer__zoom">
          <button
            type="button"
            disabled={zoom <= 0.75}
            aria-label={formatMessage({ id: 'financialReportZoomOut' })}
            onClick={() => setZoom((value) => Math.max(0.75, value - 0.25))}
          >
            −
          </button>
          <span>{formatNumber(zoom, { style: 'percent' })}</span>
          <button
            type="button"
            disabled={zoom >= 2}
            aria-label={formatMessage({ id: 'financialReportZoomIn' })}
            onClick={() => setZoom((value) => Math.min(2, value + 0.25))}
          >
            +
          </button>
        </div>
      </div>
      <div
        ref={viewportRef}
        className="financial-report-viewer__viewport"
        role="region"
        aria-label={report.title}
        tabIndex={0}
      >
        {failed ? (
          error
        ) : (
          <Document
            file={report.pdfUrl}
            options={options}
            suspense={false}
            loading={loading}
            error={error}
            onPassword={() => setFailed(true)}
            onLoadSuccess={({ numPages }) => setPageCount(numPages)}
            onItemClick={({ pageNumber }) => changePage(pageNumber)}
            externalLinkTarget="_blank"
            externalLinkRel="noopener noreferrer"
          >
            {width > 0 && (
              <Page
                pageNumber={page}
                width={width * zoom}
                devicePixelRatio={Math.min(window.devicePixelRatio || 1, 2)}
                loading={loading}
                error={error}
                canvasBackground="#ffffff"
              />
            )}
          </Document>
        )}
      </div>
    </div>
  );
}
