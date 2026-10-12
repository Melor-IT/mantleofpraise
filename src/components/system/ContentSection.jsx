export default function ContentSection({ title, description, items, className = 'primary' }) {
  return (
    <section className={`content-section ${className}`}>
      <div className="page-content">
        <div className="content-section__card content-card">
          <h2 className="section-title">{title}</h2>
          <div className="content-section__body">
            {description !== undefined && <p>{description}</p>}
            {items && (
              <ul className="content-section__list">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
