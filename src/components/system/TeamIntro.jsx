export default function TeamIntro({ title, description, image, imageAlt }) {
  return (
    <section className="our-team">
      <div className="page-content">
        <div className="team-intro__body content-card">
          <h2 className="section-title">{title}</h2>
          <p>{description}</p>
        </div>
        <div className="team-intro__image">
          <img src={image} alt={imageAlt} />
        </div>
      </div>
    </section>
  );
}
