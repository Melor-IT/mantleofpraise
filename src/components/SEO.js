import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';

const DEFAULT_TITLE = 'Mantle of Praise';
const DEFAULT_DESCRIPTION =
  'Mantle of Praise is a Persian Christian worship community offering prayer, music, and fellowship for believers worldwide.';
const DEFAULT_IMAGE = '/images/home-banner.jpg';
const DEFAULT_KEYWORDS =
  'Mantle of Praise, Persian Christian worship, prayer meetings, church community, Christian events';

export default function SEO({ title, description, image, keywords }) {
  const location = useLocation();
  const { formatMessage } = useIntl();
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const pageTitle = title || formatMessage({ id: 'siteTitle', defaultMessage: DEFAULT_TITLE });
  const pageDescription = description || DEFAULT_DESCRIPTION;
  const pageKeywords = keywords || DEFAULT_KEYWORDS;
  const imageUrl = `${origin}${image || DEFAULT_IMAGE}`;
  const canonicalUrl = `${origin}${location.pathname}`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="robots" content="index,follow" />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={`${pageTitle} image`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}
