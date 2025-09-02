const BackgroundImage = ({ url, className = "" }) => (
  <div
    className={`background ${className}`}
    style={{
      backgroundImage: `url(${url})`,
    }}
  />
);

export default BackgroundImage;
