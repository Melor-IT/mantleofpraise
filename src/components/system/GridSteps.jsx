import BackgroundImage from './BackgroundImage';
import Paisley from './Paisley';

export default function GridSteps({ id, title, description, backgroundImage, steps }) {
  return (
    <section
      className="secondary"
      id={id}
      style={id ? { scrollMarginTop: 'var(--header-offset)' } : undefined}
    >
      <BackgroundImage url={backgroundImage} className="mission" />
      <div className="page-content">
        <header className="missionus content-card">
          <div className="section-heading--ornament">
            <h2 className="section-title">{title}</h2>
            <Paisley seed={title} />
          </div>
          <p>{description}</p>
        </header>
        <div className="services">
          {steps.map((step) => (
            <div key={step.id}>
              <div
                className={`image-circle${step.imageClassName ? ` ${step.imageClassName}` : ''}`}
              >
                <img src={step.image} alt={step.imageAlt} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
