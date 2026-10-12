import BackgroundImage from './BackgroundImage';

export default function GridSteps({ title, description, backgroundImage, steps }) {
  return (
    <section className="secondary">
      <BackgroundImage url={backgroundImage} className="mission" />
      <div className="page-content">
        <header className="missionus content-card">
          <h2 className="section-title">{title}</h2>
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
