import BackgroundImage from './BackgroundImage';

export default function Banner({ title, subtitle, backgroundImage }) {
  return (
    <section className="banner">
      <BackgroundImage url={backgroundImage} />
      <div className="page-content">
        <h2>{subtitle}</h2>
        <h1>{title}</h1>
        <div className="botoje-white"></div>
      </div>
    </section>
  );
}
