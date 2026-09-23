import { locales, routes, siteUrl, pathFor, alternatesFor } from '../lib/site';

export const dynamic = 'force-static';

export default function sitemap() {
  return routes.flatMap((slug) =>
    locales.map((locale) => ({
      url: `${siteUrl}${pathFor(locale, slug)}`,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(alternatesFor(slug)).map(([key, path]) => [key, `${siteUrl}${path}`])
        )
      }
    }))
  );
}
