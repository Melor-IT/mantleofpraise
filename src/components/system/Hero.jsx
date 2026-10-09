import BackgroundImage from './BackgroundImage';

export default function Hero({
  title,
  intro,
  reference,
  backgroundImage,
  backgroundClassName = '',
  className = '',
  contentClassName = 'page-content',
  titleId
}) {
  return (
    <section className={['hero', className].filter(Boolean).join(' ')} aria-labelledby={titleId}>
      <BackgroundImage url={backgroundImage} className={backgroundClassName} />
      <div className={contentClassName}>
        <h1 className="hero__title" id={titleId}>
          {title}
        </h1>
        {intro !== undefined && <p className="hero__intro">{intro}</p>}
        {reference !== undefined && <p className="hero__reference">{reference}</p>}
      </div>
    </section>
  );
}
