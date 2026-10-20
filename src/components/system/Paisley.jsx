export default function Paisley({ className = '', tone = 'purple' }) {
  return <span className={`paisley paisley--${tone} ${className}`.trim()} aria-hidden="true" />;
}
