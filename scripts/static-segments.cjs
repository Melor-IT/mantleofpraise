const fs = require('node:fs');
const path = require('node:path');

// Next's static export nests segment payloads while the client requests dot-separated names.
// Keep both forms so the export works on ordinary static hosts without server rewrites.
function copyStaticSegments(exportRoot) {
  function files(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) return files(file);
      return entry.isFile() && entry.name.endsWith('.txt') ? [file] : [];
    });
  }
  let count = 0;
  for (const source of files(exportRoot)) {
    const parts = path.relative(exportRoot, source).split(path.sep);
    const segment = parts.findIndex((part) => part.startsWith('__next.'));
    if (segment < 0 || segment === parts.length - 1) continue;
    const target = path.join(
      exportRoot,
      ...parts.slice(0, segment),
      parts.slice(segment).join('.')
    );
    if (fs.existsSync(target)) {
      if (!fs.readFileSync(source).equals(fs.readFileSync(target))) {
        throw new Error(`Conflicting static segment payload: ${path.relative(exportRoot, target)}`);
      }
    } else {
      fs.copyFileSync(source, target);
      count++;
    }
  }
  return count;
}

module.exports = { copyStaticSegments };
