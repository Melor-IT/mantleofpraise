import { createIntl } from 'react-intl/server';
import { messages } from '../../lib/site';
import { getAnnualFinancialReports } from '../../lib/financialReports';
import Paisley from './Paisley';
import FinancialReportModal from './FinancialReportModal';

export default async function AnnualFinancialReports({ locale = 'en' }) {
  const { formatMessage } = createIntl({ locale, messages: messages[locale] });
  const reports = await getAnnualFinancialReports();

  return (
    <section
      className="annual-financial-reports content-section secondary"
      aria-labelledby="annual-financial-reports-title"
    >
      <div className="page-content">
        <div className="content-section__card content-card">
          <div className="section-heading--ornament">
            <h2 id="annual-financial-reports-title" className="section-title">
              {formatMessage({ id: 'annualFinancialReportsTitle' })}
            </h2>
            <Paisley seed="annual-financial-reports" />
          </div>
          <div className="content-section__body">
            <p>{formatMessage({ id: 'annualFinancialReportsIntro' })}</p>
            {reports.length ? (
              <ul className="annual-financial-reports__years" role="list">
                {reports.map((report) => {
                  const title = formatMessage(report.title, { year: String(report.year) });
                  return (
                    <li key={report.year}>
                      <FinancialReportModal
                        report={{ year: report.year, pdfUrl: report.pdfUrl, title }}
                        triggerClassName="annual-financial-reports__year"
                      >
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                          <path
                            d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-5-5Zm0 0v5h5M8 13h8M8 17h5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <bdi>{report.year}</bdi>
                        <span className="annual-financial-reports__format" aria-hidden="true">
                          PDF
                        </span>
                      </FinancialReportModal>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="annual-financial-reports__empty">
                {formatMessage({ id: 'annualFinancialReportsEmpty' })}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
