import Paisley from './Paisley';

export default function ContentSection({
  title,
  description,
  paragraphs,
  items,
  ordered = false,
  ornament = true,
  ornamentTone,
  className = 'primary'
}) {
  const List = ordered ? 'ol' : 'ul';
  return (
    <section className={`content-section ${className}`}>
      <div className="page-content">
        <div className="content-section__card content-card">
          <div className={ornament ? 'section-heading--ornament' : undefined}>
            <h2 className="section-title">{title}</h2>
            {ornament && <Paisley tone={ornamentTone} seed={title} />}
          </div>
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
