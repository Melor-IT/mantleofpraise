import en from '../i18n/en';
import fa from '../i18n/fa';
import nl from '../i18n/nl';

export const messages = { en, fa, nl };
export const locales = Object.keys(messages);
export const routes = ['', 'join-us', 'about-us', 'our-vision', 'ANBI-information'];
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mantleofpraise.nl').replace(/\/$/, '');
export const pathFor = (locale, slug = '') => `/${locale}${slug ? `/${slug}` : ''}`;
export const alternatesFor = (slug = '') => ({
  en: pathFor('en', slug),
  fa: pathFor('fa', slug),
  nl: pathFor('nl', slug),
  'x-default': pathFor('en', slug)
});
