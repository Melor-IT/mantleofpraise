import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'fa', 'nl'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // Validate the locale
  const validLocale = locales.includes(locale) ? locale : defaultLocale;
  // console.log((await import(`../i18n/${validLocale}.js`)).default)

  // Load messages dynamically
  try {
    return {
      locale: validLocale,
      messages: (await import(`../i18n/${validLocale}.js`)).default,
    };
  } catch (error) {
    // Fallback to default locale
    return {
      locale: defaultLocale,
      messages: (await import(`../i18n/${defaultLocale}.js`)).default,
    };
  }
});
