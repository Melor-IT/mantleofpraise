import Link from 'next/link';

export default function ContentImageButton({
  title,
  description,
  image,
  buttonText,
  buttonHref
}) {
  return (
    <section className="primary about-us">
      <div className="page-content">
        <div
          className="botoje-white"
          style={image ? { backgroundImage: `url(${image})` } : undefined}
        ></div>
        <div className="text-block">
          <h2>{title}</h2>
        </div>
        <div className="text-block">
          <p>{description}</p>
          <Link className="button" href={buttonHref}>
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
