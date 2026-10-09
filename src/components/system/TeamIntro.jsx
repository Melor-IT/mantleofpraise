export default function TeamIntro({ title, description, image, imageAlt }) {
  return (
    <section className="our-team">
      <div className="page-content">
        <div className="circle">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="image-big">
          <img src={image} alt={imageAlt} />
        </div>
      </div>
    </section>
  );
}
