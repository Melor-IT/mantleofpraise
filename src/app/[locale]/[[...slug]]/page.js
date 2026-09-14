import { notFound } from 'next/navigation';
import { locales, routes, messages, pathFor, alternatesFor } from '../../../lib/site';
import HomePage from '../../../site-pages/HomePage';
import JoinUsPage from '../../../site-pages/JoinUsPage';
import AboutUsPage from '../../../site-pages/AboutUsPage';
import OurVisionPage from '../../../site-pages/OurVisionPage';
import ANBIInformationPage from '../../../site-pages/ANBIInformationPage';

const pages = {
  '': HomePage,
  'join-us': JoinUsPage,
  'about-us': AboutUsPage,
  'our-vision': OurVisionPage,
  'ANBI-information': ANBIInformationPage
};
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
  'our-vision': '/images/ourvision-banner.jpg',
  'ANBI-information': '/images/ANBI-banner.jpg'
};
function routeOf(slug) {
  return slug?.length > 1 ? null : (slug?.[0] || '');
}
export function generateStaticParams() {
  return locales.flatMap((locale) => routes.map((route) => ({ locale, slug: route ? [route] : [] })));
}
export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const route = routeOf(slug);
  if (!locales.includes(locale) || route === null || !routes.includes(route)) return {};
  const label = messages[locale][pageLabels[route]] || 'Mantle of Praise';
  const title = route ? `${label} | Mantle of Praise` : label;
  const description = (messages[locale][descriptions[route]] || '').slice(0, 180);
  const path = pathFor(locale, route);
  return {
    title, description,
    alternates: { canonical: path, languages: alternatesFor(route) },
    openGraph: { title, description, url: path, siteName: 'Mantle of Praise', locale, type: 'website', images: [{ url: images[route] }] },
    twitter: { card: 'summary_large_image', title, description, images: [images[route]] }
  };
}
export default async function ContentPage({ params }) {
  const { locale, slug } = await params;
  const route = routeOf(slug);
  if (!locales.includes(locale) || route === null || !routes.includes(route)) notFound();
  const Page = pages[route];
  return <Page />;
}
