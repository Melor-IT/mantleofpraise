// 'use client';

const BackgroundImage = ({ url, className = '' }) => (
  <div
    className={`background ${className}`}
    style={{
      backgroundImage: `url(${url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}
  />
);

export default BackgroundImage;
