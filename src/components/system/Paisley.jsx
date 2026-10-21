const tones = ['purple', 'gold', 'teal'];

export default function Paisley({ className = '', tone, seed = '' }) {
  // Keep the varied colors stable between static HTML and client renders.
  let hash = 0;
  for (const character of seed) {
    hash = (Math.imul(hash, 31) + character.codePointAt(0)) >>> 0;
  }
  const resolvedTone = tone ?? tones[hash % tones.length];

  return (
    <span className={`paisley paisley--${resolvedTone} ${className}`.trim()} aria-hidden="true" />
  );
}
