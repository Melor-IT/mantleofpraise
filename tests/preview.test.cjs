const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { createPreviewServer } = require('../scripts/preview.cjs');

test('preview serves the export with security headers and keeps private files inaccessible', async (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'mantle-preview-test-'));
  const root = path.join(directory, 'out');
  fs.mkdirSync(path.join(root, 'fa'), { recursive: true });
  fs.writeFileSync(
    path.join(root, '_headers'),
    "/*\n  Content-Security-Policy: default-src 'self'\n  X-Content-Type-Options: nosniff\n\n/_next/static/*\n  Cache-Control: public, max-age=31536000, immutable\n"
  );
  fs.writeFileSync(path.join(root, 'index.html'), '<h1>Home</h1>');
  fs.writeFileSync(path.join(root, 'fa/index.html'), '<h1>Persian</h1>');
  fs.writeFileSync(path.join(root, '404.html'), '<h1>Missing</h1>');
  fs.writeFileSync(path.join(root, '.env'), 'PRIVATE=secret');
  fs.writeFileSync(path.join(directory, 'private.txt'), 'Outside the export');
  fs.mkdirSync(path.join(root, '_next/static'), { recursive: true });
  fs.writeFileSync(path.join(root, '_next/static/app.js'), 'console.log("app")');
  fs.symlinkSync(
    directory,
    path.join(root, 'outside'),
    process.platform === 'win32' ? 'junction' : 'dir'
  );
  const server = createPreviewServer(root);
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(directory, { recursive: true, force: true });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const response = await fetch(origin + '/fa/');
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '<h1>Persian</h1>');
  assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('content-security-policy'), "default-src 'self'");
  assert.equal((await fetch(origin + '/', { method: 'HEAD' })).headers.get('content-length'), '13');
  assert.equal((await fetch(origin + '/', { method: 'POST' })).status, 405);
  const missing = await fetch(origin + '/missing/');
  assert.equal(missing.status, 404);
  assert.equal(await missing.text(), '<h1>Missing</h1>');
  for (const url of ['/.env', '/_headers', '/outside/private.txt', '/%2e%2e%2fprivate.txt']) {
    assert.equal((await fetch(origin + url)).status, 404, url);
  }
  const invalid = await new Promise((resolve, reject) => {
    http
      .get(origin + '/%ZZ', (res) => {
        res.resume();
        resolve(res.statusCode);
      })
      .on('error', reject);
  });
  assert.equal(invalid, 400);
  assert.equal(
    (await fetch(origin + '/_next/static/app.js')).headers.get('cache-control'),
    'public, max-age=31536000, immutable'
  );
});
