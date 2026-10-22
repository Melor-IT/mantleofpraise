const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mantle-reports-test-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const folder = path.join(root, 'pdf/annual-financial-reports');
  await fs.mkdir(folder, { recursive: true });
  const { getAnnualFinancialReports } = await import('../src/lib/financialReports.js');
  const report = (year, overrides = {}) => ({
    year,
    pdfUrl: `/pdf/annual-financial-reports/${year}.pdf`,
    title: { id: 'annualFinancialReportTitle' },
    approved: true,
    ...overrides
  });
  return { root, folder, report, load: (reports) => getAnnualFinancialReports(reports, root) };
}

test('no placeholder years are published; unapproved files are never listed', async (t) => {
  const { load, report } = await fixture(t);
  assert.deepEqual(await load([]), []);
  assert.deepEqual(
    await load([report(2025, { approved: false }), report(2024, { approved: undefined })]),
    []
  );
});

test('approved PDFs are listed newest first without changing the source data', async (t) => {
  const { load, folder, report } = await fixture(t);
  for (const year of [2023, 2025, 2024]) {
    // Only the file signature is needed for the publication guard's unit test.
    await fs.writeFile(path.join(folder, `${year}.pdf`), '%PDF-1.7\nTest fixture only.');
  }
  const reports = [report(2023), report(2025), report(2024)];
  assert.deepEqual(
    (await load(reports)).map((entry) => entry.year),
    [2025, 2024, 2023]
  );
  assert.equal(reports[0].year, 2023);
});

test('missing and mislabeled PDFs cannot be deployed as approved reports', async (t) => {
  const { load, folder, report } = await fixture(t);
  await assert.rejects(load([report(2025)]), /missing/);
  await fs.writeFile(path.join(folder, '2025.pdf'), '<html>Not a PDF</html>');
  await assert.rejects(load([report(2025)]), /must be a PDF/);
  await fs.writeFile(path.join(folder, '2025.pdf'), '%PDF');
  await assert.rejects(load([report(2025)]), /must be a PDF/);
});

test('external URLs, traversal paths, invalid titles, and duplicate years are rejected', async (t) => {
  const { load, folder, report } = await fixture(t);
  for (const pdfUrl of [
    'https://example.com/2025.pdf',
    '//example.com/2025.pdf',
    '/pdf/annual-financial-reports/../../private.pdf',
    '/pdf/annual-financial-reports/%2e%2e/private.pdf',
    '/pdf/termsFa.pdf',
    '/pdf/annual-financial-reports/2025.pdf?download=1'
  ]) {
    await assert.rejects(load([report(2025, { pdfUrl })]), /local PDF URL/);
  }
  await assert.rejects(load([report('2025')]), /unique year/);
  await assert.rejects(load([report(2025, { title: undefined })]), /title ID/);
  await fs.writeFile(path.join(folder, '2025.pdf'), '%PDF-1.7\nTest fixture only.');
  await assert.rejects(load([report(2025), report(2025)]), /unique year/);
});
