import en from '../../messages/en.js';
import fa from '../../messages/fa.js';
import nl from '../../messages/nl.js';

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

const socialLocales = { en: 'en_US', fa: 'fa_IR', nl: 'nl_NL' };

export function pageMetadata(locale, route = '') {
  if (!locales.includes(locale) || !routes.includes(route)) return {};

  const label = messages[locale][pageLabels[route]] || 'Mantle of Praise';
  const organizationName = locale === 'fa' ? 'ردای ستایش' : 'Mantle of Praise';
  const title = route ? `${label} | ${organizationName}` : messages[locale].homeTitle;
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
      locale: socialLocales[locale],
      alternateLocale: locales
        .filter((language) => language !== locale)
        .map((language) => socialLocales[language]),
      type: 'website',
      images: [{ url: image, alt: label }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: image, alt: label }]
    }
  };
}

export function organizationStructuredData(locale) {
  if (!locales.includes(locale)) throw new Error('Unsupported structured-data language.');
  const organizationId = `${siteUrl}/#organization`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: messages[locale].mantleOfPraise,
        legalName: 'Stichting Mantle of Praise',
        alternateName: locale === 'fa' ? 'Mantle of Praise' : 'ردای ستایش',
        url: `${siteUrl}/`,
        logo: `${siteUrl}/images/logo-mini.png`,
        email: 'info@mantleofpraise.nl',
        sameAs: ['https://www.instagram.com/mantle.of.praise/']
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: messages[locale].mantleOfPraise,
        inLanguage: locales,
        publisher: { '@id': organizationId }
      }
    ]
  };
}

export const serializeStructuredData = (data) => JSON.stringify(data).replace(/</g, '\\u003c');
