const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

test('all 18 canonical pages have localized metadata and reciprocal language alternatives', async () => {
  const { messages, locales, routes, siteUrl, pathFor, pageMetadata } =
    await import('../src/lib/site.js');
  const canonicals = new Set();
  const descriptions = new Set();
  for (const locale of locales) {
    for (const route of routes) {
      const metadata = pageMetadata(locale, route);
      assert(metadata.title.length > 10, `${locale}/${route}: missing title`);
      assert(metadata.description.length > 50, `${locale}/${route}: missing description`);
      assert(
        !descriptions.has(metadata.description),
        'Descriptions must be specific to each page and language'
      );
      descriptions.add(metadata.description);
      const canonical = new URL(metadata.alternates.canonical, siteUrl).href;
      assert(!canonicals.has(canonical), 'Canonical pages must have unique URLs');
      canonicals.add(canonical);
      for (const alternate of locales) {
        const alternatePath = metadata.alternates.languages[alternate];
        assert.equal(alternatePath, pathFor(alternate, route));
        assert.equal(
          pageMetadata(alternate, route).alternates.languages[locale],
          pathFor(locale, route)
        );
      }
      assert.equal(metadata.alternates.languages[locale], metadata.alternates.canonical);
      assert.equal(metadata.alternates.languages['x-default'], pathFor('en', route));
      assert.equal(metadata.openGraph.title, metadata.title);
      assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
      assert.match(metadata.openGraph.locale, /^[a-z]{2}_[A-Z]{2}$/);
      assert.equal(metadata.openGraph.alternateLocale.length, 2);
      assert(!metadata.openGraph.alternateLocale.includes(metadata.openGraph.locale));
      assert.equal(metadata.twitter.description, metadata.description);
      assert.equal(metadata.twitter.card, 'summary_large_image');
      for (const image of metadata.openGraph.images) {
        assert(image.alt);
        assert(fs.existsSync(path.join(__dirname, '../public', image.url)));
      }
    }
    assert.equal(pageMetadata(locale).title, messages[locale].homeTitle);
  }
  assert.equal(canonicals.size, 18);
  assert.equal(pathFor('en'), '/');
  assert.deepEqual(pageMetadata('invalid'), {});
  assert.deepEqual(pageMetadata('en', 'missing'), {});
});

test('organization structured data uses published details and cannot escape its script element', async () => {
  const { locales, siteUrl, organizationStructuredData, serializeStructuredData } =
    await import('../src/lib/site.js');
  for (const locale of locales) {
    const data = organizationStructuredData(locale);
    assert.equal(data['@context'], 'https://schema.org');
    const organization = data['@graph'].find((item) => item['@type'] === 'Organization');
    const website = data['@graph'].find((item) => item['@type'] === 'WebSite');
    assert.equal(organization.url, siteUrl + '/');
    assert.equal(organization.email, 'info@mantleofpraise.nl');
    assert.deepEqual(website.inLanguage, locales);
    assert.equal(website.publisher['@id'], organization['@id']);
    assert.deepEqual(JSON.parse(serializeStructuredData(data)), data);
  }
  const untrusted = { name: '</script><script>alert("injected")</script>' };
  const serialized = serializeStructuredData(untrusted);
  assert(!serialized.includes('<'));
  assert.deepEqual(JSON.parse(serialized), untrusted);
  assert.throws(() => organizationStructuredData('invalid'), /Unsupported/);
});

test('invalid deployment origins fail instead of publishing unsafe canonical and structured-data URLs', () => {
  for (const origin of [
    'http://example.com',
    'https://user:pass@example.com',
    'https://example.com/path',
    'https://example.com/?query=1',
    'https://example.com/#fragment'
  ]) {
    const result = spawnSync(
      process.execPath,
      ['--input-type=module', '-e', "await import('./src/lib/site.js')"],
      {
        cwd: path.resolve(__dirname, '..'),
        env: { ...process.env, NEXT_PUBLIC_SITE_URL: origin },
        encoding: 'utf8'
      }
    );
    assert.notEqual(result.status, 0, origin);
    assert.match(result.stderr, /must be an HTTPS origin/);
  }
});
