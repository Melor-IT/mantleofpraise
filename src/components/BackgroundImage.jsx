const BackgroundImage = ({ url, className = '' }) => (
  <div
    className={`background ${className}`}
    aria-hidden="true"
    style={{
      backgroundImage: `url(${url})`
    }}
  />
);

export default BackgroundImage;
