const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const images = [
  'home-banner.jpg',
  'ourvision-banner.png',
  'juneUs.png',
  'join-us-banner.png',
  'ANBI-banner.jpg',
  'introduction-faces-v2.jpg',
  'back2.jpg'
];

async function main() {
  const directory = path.join(root, 'public/images/optimized');
  await fs.mkdir(directory, { recursive: true });
  const manifest = {};

  for (const name of images) {
    const input = path.join(root, 'public/images', name);
    const { width, height } = await sharp(input).metadata();
    const widths = [...new Set([768, 1280, 1920].map((size) => Math.min(size, width)))];
    const sources = [];
    for (const size of widths) {
      const filename = `${path.parse(name).name}-${size}.webp`;
      const result = await sharp(input)
        .resize({ width: size, withoutEnlargement: true })
        .webp({ quality: 78, effort: 6 })
        .toFile(path.join(directory, filename));
      sources.push(`/images/optimized/${filename} ${result.width}w`);
      console.log(`${filename}: ${Math.round(result.size / 1024)} KB`);
    }
    manifest[`/images/${name}`] = { width, height, srcSet: sources.join(', ') };
  }

  await fs.writeFile(
    path.join(root, 'src/data/background-images.json'),
    JSON.stringify(manifest, null, 2) + '\n'
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
