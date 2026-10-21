import backgroundImages from '../../data/background-images.json';

const BackgroundImage = ({ url, className = '', priority = false }) => {
  const image = backgroundImages[url];

  return (
    <picture className={`background ${className}`} aria-hidden="true">
      {image && <source type="image/webp" srcSet={image.srcSet} sizes="100vw" />}
      <img
        src={url}
        alt=""
        width={image?.width}
        height={image?.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </picture>
  );
};

export default BackgroundImage;
