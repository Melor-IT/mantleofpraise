export default function ContentSection({
  title,
  description,
  paragraphs,
  items,
  ordered = false,
  className = 'primary'
}) {
  const List = ordered ? 'ol' : 'ul';
  return (
    <section className={`content-section ${className}`}>
      <div className="page-content">
        <div className="content-section__card content-card">
          <h2 className="section-title">{title}</h2>
          <div className="content-section__body">
            {description !== undefined && <p>{description}</p>}
            {paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {items && (
              <List className="content-section__list">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </List>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
