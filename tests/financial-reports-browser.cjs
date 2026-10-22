// Exercise real report dialogs without putting sample financial reports in the
// application or its production export. Everything is built in a temporary copy.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const workspace = path.resolve(__dirname, '..');
const fixture = fs.mkdtempSync(path.join(workspace, '.reports-browser-test-'));

function run(script, args = []) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: fixture,
    env: { ...process.env, REPORTS_ONLY: '1' },
    stdio: 'inherit',
    windowsHide: true
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${path.basename(script)} exited ${result.status}`);
}

function testPdf(pageCount = 1) {
  const text = 'PDF viewer test fixture. Not a financial report.';
  const stream = `BT /F1 16 Tf 40 740 Td (${text}) Tj ET\n`;
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [3 0 R ${pageCount > 1 ? '6 0 R' : ''}] /Count ${pageCount} >>`,
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}endstream`
  ];
  if (pageCount > 1) {
    const secondStream =
      'BT /F1 16 Tf 40 740 Td (Second viewer test page. Not a financial report.) Tj ET\n';
    objects.push(
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 7 0 R >>',
      `<< /Length ${Buffer.byteLength(secondStream)} >>\nstream\n${secondStream}endstream`
    );
  }
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const [index, object] of objects.entries()) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  }
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${offsets.length}\n0000000000 65535 f \n`;
  pdf += offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`)
    .join('');
  return pdf + `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
}

try {
  for (const directory of ['src', 'messages', 'public', 'scripts', 'tests']) {
    fs.cpSync(path.join(workspace, directory), path.join(fixture, directory), { recursive: true });
  }
  for (const file of ['package.json', 'next.config.js']) {
    fs.copyFileSync(path.join(workspace, file), path.join(fixture, file));
  }
  const pdfDirectory = path.join(fixture, 'public/pdf/annual-financial-reports');
  fs.mkdirSync(pdfDirectory, { recursive: true });
  const reports = [2024, 2025].map((year) => {
    fs.writeFileSync(
      path.join(pdfDirectory, `viewer-test-${year}.pdf`),
      testPdf(year === 2025 ? 2 : 1)
    );
    return {
      year,
      pdfUrl: `/pdf/annual-financial-reports/viewer-test-${year}.pdf`,
      title: { id: 'annualFinancialReportTitle' },
      approved: true
    };
  });
  fs.writeFileSync(
    path.join(fixture, 'src/data/financialReports.js'),
    `export const annualFinancialReports = ${JSON.stringify(reports)};\n`
  );
  run(path.join(fixture, 'scripts/prepare-pdf-viewer.cjs'));
  run(path.join(workspace, 'node_modules/next/dist/bin/next'), ['build']);
  run(path.join(fixture, 'scripts/postbuild.cjs'));
  run(path.join(fixture, 'tests/browser-check.cjs'));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  if (
    path.dirname(fixture) !== workspace ||
    !path.basename(fixture).startsWith('.reports-browser-test-')
  ) {
    throw new Error('Unexpected report test directory');
  }
  fs.rmSync(fixture, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
}
