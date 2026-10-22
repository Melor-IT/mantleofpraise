import en from '../../messages/en';
import fa from '../../messages/fa';
import nl from '../../messages/nl';

export const messages = { en, fa, nl };
export const locales = Object.keys(messages);
export const routes = ['', 'introduction', 'join-us', 'about-us', 'our-vision', 'ANBI-information'];
const canonicalUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mantleofpraise.nl');
if (
  canonicalUrl.protocol !== 'https:' ||
  canonicalUrl.username ||
  canonicalUrl.password ||
  canonicalUrl.pathname !== '/' ||
  canonicalUrl.search ||
  canonicalUrl.hash
) {
  throw new Error(
    'NEXT_PUBLIC_SITE_URL must be an HTTPS origin without credentials, path, query, or fragment.'
  );
}
export const siteUrl = canonicalUrl.origin;
export const pathFor = (locale, slug = '') =>
  locale === 'en' && !slug ? '/' : `/${locale}/${slug ? `${slug}/` : ''}`;
export const alternatesFor = (slug = '') => ({
  en: pathFor('en', slug),
  fa: pathFor('fa', slug),
  nl: pathFor('nl', slug),
  'x-default': pathFor('en', slug)
});

const pageLabels = {
  '': 'mantleOfPraise',
  introduction: 'introduction',
  'join-us': 'joinUs',
  'about-us': 'aboutUs',
  'our-vision': 'ourVision',
  'ANBI-information': 'ANBIInformation'
};

const descriptions = {
  '': 'homeDescription',
  introduction: 'introductionDescription',
  'join-us': 'joinUsDescription',
  'about-us': 'aboutUsDescription',
  'our-vision': 'visionDescription',
  'ANBI-information': 'anbiDescription'
};

const images = {
  '': '/images/home-banner.jpg',
  introduction: '/images/home-banner.jpg',
  'join-us': '/images/juneUs.png',
  'about-us': '/images/back1.jpg',
  'our-vision': '/images/ourvision-banner.png',
  'ANBI-information': '/images/ANBI-banner.jpg'
};

export function pageMetadata(locale, route = '') {
  if (!locales.includes(locale) || !routes.includes(route)) return {};

  const label = messages[locale][pageLabels[route]] || 'Mantle of Praise';
  const organizationName = locale === 'fa' ? 'ردای ستایش' : 'Mantle of Praise';
  const title = route ? `${label} | ${organizationName}` : label;
  const description = messages[locale][descriptions[route]] || '';
  const path = pathFor(locale, route);
  const image = images[route] || images[''];

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: alternatesFor(route)
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: organizationName,
      locale,
      type: 'website',
      images: [{ url: image }]
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] }
  };
}
