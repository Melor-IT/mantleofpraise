import Link from 'next/link';
import Paisley from './Paisley';

export default function ContentImageButton({
  title,
  description,
  image,
  buttonText,
  buttonHref,
  ornamentTone
}) {
  return (
    <section className="primary about-us">
      <div className="page-content">
        {image && (
          <div
            className="botoje-white"
            style={{ backgroundImage: `url(${image})` }}
            aria-hidden="true"
          />
        )}
        <div className="about-us__card content-card">
          <div className="section-heading--ornament">
            <h2 className="section-title">{title}</h2>
            <Paisley tone={ornamentTone} seed={title} />
          </div>
          <div className="text-block">
            <p>{description}</p>
            <Link className="button" href={buttonHref}>
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
