const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { securityHeaders } = require('../scripts/security-headers.cjs');

test('CSP allows exact exported scripts and rejects arbitrary inline JavaScript', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mantle-csp-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'fa'));
  const scripts = ['self.__next_f.push([1,"English"]);', 'self.__next_f.push([1,"Farsi"]);'];
  fs.writeFileSync(
    path.join(root, 'index.html'),
    `<script src="/_next/app.js"></script><script>${scripts[0]}</script>`
  );
  fs.writeFileSync(path.join(root, 'fa/index.html'), `<script>${scripts[1]}</script>`);
  const headers = securityHeaders(root);
  const policy = headers['Content-Security-Policy'];
  const scriptPolicy = policy.split('; ').find((directive) => directive.startsWith('script-src '));
  for (const script of scripts) {
    assert(
      scriptPolicy.includes(`'sha256-${createHash('sha256').update(script).digest('base64')}'`)
    );
  }
  assert(!scriptPolicy.includes('unsafe-inline'));
  assert(!scriptPolicy.includes('unsafe-eval'));
  assert(!scriptPolicy.includes(createHash('sha256').update('alert("injected")').digest('base64')));
  assert(policy.includes("script-src-attr 'none'"));
  assert(policy.includes("frame-ancestors 'none'"));
  assert.equal(headers['X-Content-Type-Options'], 'nosniff');

  fs.writeFileSync(path.join(root, 'index.html'), `<script>${scripts[0]}\n</script>`);
  assert.notEqual(
    securityHeaders(root)['Content-Security-Policy'],
    policy,
    'Whitespace changes need new hashes'
  );
});

test('generating headers without a built page fails instead of deploying a broken policy', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mantle-empty-export-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  assert.throws(() => securityHeaders(root), /Build the static export/);
});
