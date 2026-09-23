import en from '../../messages/en';
import fa from '../../messages/fa';
import nl from '../../messages/nl';

export const messages = { en, fa, nl };
export const locales = Object.keys(messages);
export const routes = ['', 'join-us', 'about-us', 'our-vision', 'ANBI-information'];
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mantleofpraise.nl').replace(
  /\/$/,
  ''
);
export const pathFor = (locale, slug = '') => `/${locale}${slug ? `/${slug}` : ''}`;
export const alternatesFor = (slug = '') => ({
  en: pathFor('en', slug),
  fa: pathFor('fa', slug),
  nl: pathFor('nl', slug),
  'x-default': pathFor('en', slug)
});

const pageLabels = {
  '': 'mantleOfPraise',
  'join-us': 'joinUs',
  'about-us': 'aboutUs',
  'our-vision': 'ourVision',
  'ANBI-information': 'ANBIInformation'
};

const descriptions = {
  '': 'ourMissionText',
  'join-us': 'joinUsText',
  'about-us': 'aboutUsSectionText',
  'our-vision': 'visionText',
  'ANBI-information': 'policyGoals1'
};

const images = {
  '': '/images/home-banner.jpg',
  'join-us': '/images/juneUs.png',
  'about-us': '/images/back1.jpg',
  'our-vision': '/images/ourvision-banner.png',
  'ANBI-information': '/images/ANBI-banner.jpg'
};

export function pageMetadata(locale, route = '') {
  if (!locales.includes(locale) || !routes.includes(route)) return {};

  const label = messages[locale][pageLabels[route]] || 'Mantle of Praise';
  const title = route ? `${label} | Mantle of Praise` : label;
  const description = (messages[locale][descriptions[route]] || '').slice(0, 180);
  const path = pathFor(locale, route);

  return {
    title,
    description,
    alternates: { canonical: path, languages: alternatesFor(route) },
    openGraph: {
      title,
      description,
      url: path,
      siteName: 'Mantle of Praise',
      locale,
      type: 'website',
      images: [{ url: images[route] }]
    },
    twitter: { card: 'summary_large_image', title, description, images: [images[route]] }
  };
}
