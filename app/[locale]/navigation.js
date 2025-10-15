import { notFound } from 'next/navigation';

export async function getMessages(locale) {
  try {
    return (await import(`../i18n/${locale}.js`)).default;
  } catch (error) {
    notFound();
  }
}
