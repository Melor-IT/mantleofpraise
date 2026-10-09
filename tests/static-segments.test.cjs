const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { copyStaticSegments } = require('../scripts/static-segments.cjs');

test('static segment URLs work for root, localized and nested pages without changing other payloads', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mantle-segments-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const fixtures = [
    ['__next.!KHJvb3Qp/__PAGE__.txt', '__next.!KHJvb3Qp.__PAGE__.txt'],
    ['fa/__next.$d$locale/__PAGE__.txt', 'fa/__next.$d$locale.__PAGE__.txt'],
    [
      'nl/our-vision/__next.$d$locale/our-vision/__PAGE__.txt',
      'nl/our-vision/__next.$d$locale.our-vision.__PAGE__.txt'
    ]
  ];
  for (const [source] of fixtures) {
    fs.mkdirSync(path.dirname(path.join(root, source)), { recursive: true });
    fs.writeFileSync(path.join(root, source), source);
  }
  fs.writeFileSync(path.join(root, 'index.txt'), 'full page');
  fs.writeFileSync(path.join(root, '__next._tree.txt'), 'route tree');
  assert.equal(copyStaticSegments(root), fixtures.length);
  for (const [source, target] of fixtures) {
    assert.equal(fs.readFileSync(path.join(root, target), 'utf8'), source);
    assert(fs.existsSync(path.join(root, source)));
  }
  assert.equal(fs.readFileSync(path.join(root, 'index.txt'), 'utf8'), 'full page');
  assert.equal(copyStaticSegments(root), 0, 'Running postbuild twice must be safe');
  fs.writeFileSync(path.join(root, fixtures[0][1]), 'conflicting payload');
  assert.throws(() => copyStaticSegments(root), /Conflicting static segment payload/);
});
