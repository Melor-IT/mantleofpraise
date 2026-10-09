const fs = require('node:fs');
const path = require('node:path');
const { securityHeaders } = require('./security-headers.cjs');

const exportRoot = path.resolve(__dirname, '../out');
const headers = securityHeaders(exportRoot);
const rules = Object.entries(headers)
  .map(([name, value]) => `  ${name}: ${value}`)
  .join('\n');
fs.writeFileSync(
  path.join(exportRoot, '_headers'),
  `# Generated after every build. Deploy this file with the complete out directory.\n/*\n${rules}\n\n/_next/static/*\n  Cache-Control: public, max-age=31536000, immutable\n`
);
console.log('Generated security headers with hashes for the exported inline scripts.');
