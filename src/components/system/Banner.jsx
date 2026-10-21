import BackgroundImage from './BackgroundImage';
import Paisley from './Paisley';

export default function Banner({ title, subtitle, backgroundImage }) {
  return (
    <section className="banner">
      <BackgroundImage url={backgroundImage} priority />
      <div className="page-content">
        <h2>{subtitle}</h2>
        <h1>{title}</h1>
      </div>
      <div className="banner-ornament" aria-hidden="true">
        <Paisley className="banner-ornament__motif" />
      </div>
    </section>
  );
}
