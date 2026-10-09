// Local preview of the static export; production hosting is handled by Netlify.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2'
};

function createPreviewServer(exportDirectory) {
  const root = fs.realpathSync(exportDirectory);
  const headerFile = fs.readFileSync(path.join(root, '_headers'), 'utf8');
  const globalBlock = headerFile.split('/*\n')[1].split('\n\n')[0];
  const headers = Object.fromEntries(
    globalBlock
      .trim()
      .split('\n')
      .map((line) => {
        const colon = line.indexOf(':');
        return [line.slice(0, colon).trim(), line.slice(colon + 1).trim()];
      })
  );
  const insideRoot = (file) => file === root || file.startsWith(root + path.sep);

  return http.createServer(async (request, response) => {
    for (const [name, value] of Object.entries(headers)) response.setHeader(name, value);
    const fail = (status) =>
      response.writeHead(status, { 'Content-Type': 'text/plain' }).end(http.STATUS_CODES[status]);
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.setHeader('Allow', 'GET, HEAD');
      fail(405);
      return;
    }
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (pathname.includes('\0') || pathname.includes('\\')) return fail(400);
      if (pathname.split('/').some((part) => part.startsWith('.') || part === '_headers'))
        return fail(404);
      let file = path.resolve(root, '.' + pathname);
      if (!insideRoot(file)) return fail(404);
      let status = 200;
      try {
        if ((await fs.promises.stat(file)).isDirectory()) file = path.join(file, 'index.html');
        file = await fs.promises.realpath(file);
      } catch (error) {
        if (!['ENOENT', 'ENOTDIR'].includes(error.code)) throw error;
        status = 404;
        file = await fs.promises.realpath(path.join(root, '404.html'));
      }
      if (!insideRoot(file) || !(await fs.promises.stat(file)).isFile()) return fail(404);
      const body = await fs.promises.readFile(file);
      response.setHeader(
        'Content-Type',
        contentTypes[path.extname(file)] || 'application/octet-stream'
      );
      response.setHeader('Content-Length', body.length);
      response.setHeader(
        'Cache-Control',
        status === 200 && pathname.startsWith('/_next/static/')
          ? 'public, max-age=31536000, immutable'
          : 'no-cache'
      );
      response.writeHead(status);
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch (error) {
      fail(error instanceof URIError ? 400 : 500);
    }
  });
}

if (require.main === module) {
  try {
    const server = createPreviewServer(path.resolve(__dirname, '../out'));
    const port = Number(process.env.PORT || 3000);
    if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('Invalid PORT.');
    server.on('error', (error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
    server.listen(port, '127.0.0.1', () =>
      console.log(`Static preview: http://127.0.0.1:${server.address().port}`)
    );
  } catch (error) {
    console.error('Run npm run build before npm start. ' + error.message);
    process.exitCode = 1;
  }
}

module.exports = { createPreviewServer };
