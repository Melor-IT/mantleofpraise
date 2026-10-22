const fs = require('node:fs');
const path = require('node:path');

const pdfjsRoot = path.dirname(require.resolve('pdfjs-dist/package.json'));
const { version } = require(path.join(pdfjsRoot, 'package.json'));
const destination = path.resolve(__dirname, '../public/pdf-viewer', version);
fs.mkdirSync(destination, { recursive: true });
fs.copyFileSync(
  path.join(pdfjsRoot, 'build/pdf.worker.min.mjs'),
  path.join(destination, 'pdf.worker.min.mjs')
);
for (const directory of ['cmaps', 'standard_fonts', 'wasm']) {
  fs.cpSync(path.join(pdfjsRoot, directory), path.join(destination, directory), {
    recursive: true
  });
}
fs.copyFileSync(path.join(pdfjsRoot, 'LICENSE'), path.join(destination, 'LICENSE'));
console.log(`Prepared locally hosted PDF viewer assets (${version}).`);
