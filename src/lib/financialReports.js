import { open, realpath } from 'node:fs/promises';
import path from 'node:path';
import { annualFinancialReports } from '../data/financialReports.js';

// Runs during static generation, so missing PDFs cannot become public year cards.
export async function getAnnualFinancialReports(
  reports = annualFinancialReports,
  publicDirectory = path.join(process.cwd(), 'public')
) {
  const approvedReports = reports.filter((report) => report.approved === true);
  const years = new Set();

  for (const report of approvedReports) {
    if (
      !Number.isInteger(report.year) ||
      report.year < 1000 ||
      report.year > 9999 ||
      years.has(report.year) ||
      !report.title?.id ||
      !/^\/pdf\/annual-financial-reports\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.pdf$/.test(report.pdfUrl)
    ) {
      throw new Error('Annual financial reports need a unique year, title ID, and local PDF URL.');
    }
    years.add(report.year);

    const root = await realpath(publicDirectory);
    let file;
    try {
      file = await realpath(path.join(root, report.pdfUrl.slice(1)));
    } catch {
      throw new Error(
        `Approved annual financial report ${report.year} is missing: ${report.pdfUrl}`
      );
    }
    if (!file.startsWith(root + path.sep)) {
      throw new Error(`Annual financial report ${report.year} must be inside public/.`);
    }

    const handle = await open(file, 'r');
    try {
      const signature = Buffer.alloc(5);
      const { bytesRead } = await handle.read(signature, 0, signature.length, 0);
      if (bytesRead !== 5 || signature.toString('ascii') !== '%PDF-') {
        throw new Error(`Annual financial report ${report.year} must be a PDF file.`);
      }
    } finally {
      await handle.close();
    }
  }

  return [...approvedReports].sort((first, second) => second.year - first.year);
}
