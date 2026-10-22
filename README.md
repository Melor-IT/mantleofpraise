# Mantle of Praise

Next.js website with statically generated English, Persian, and Dutch pages.

## Development

```bash
npm install
npm run dev
```

Use Node.js 22.13 or newer. Open `http://localhost:3000` during development.
Run `npm run build` to generate the production export in `out`, then `npm start`
to preview it at `http://127.0.0.1:3000`. Set `PORT` to use a different local port.
The preview binds to the local machine and serves the generated security headers.
Run `npm test` for the security-header and static-preview regression tests.
After building, run `npm run test:browser` for the full browser checks. It requires
Chrome or Chromium; set `CHROME_PATH` if it is installed outside a standard location.
The browser checks intercept membership requests and never send a real registration.
If Chrome's sandbox cannot start in a restricted test environment, set
`BROWSER_TEST_NO_SANDBOX=1` for that isolated local test run. The default enables
the browser sandbox.

## Background images

Hero and section backgrounds use responsive WebP files in `public/images/optimized`.
The first background loads eagerly with high priority; later backgrounds load lazily.
After replacing a background original in `public/images`, run `npm run images:optimize`
to regenerate the WebP files and `src/data/background-images.json`, then rebuild.

## Donations

The header donation button opens a modal on the current page in all three languages.
Click outside the panel, press Escape, or use the close button to dismiss it.
Bank details are shared by the modal and footer through `src/data/donation.js`.
The QR code is generated locally at build time using [node-qrcode](https://github.com/soldair/node-qrcode).
Set `paymentUrl` in `src/data/donation.js` to the payment page URL. The QR code and
payment link appear when this URL is set. Rebuild after changing account or payment details.

## Partners

The Partners section appears above the footer only on the About Us page in each
language (`/en/about-us/`, `/fa/about-us/`, and `/nl/about-us/`). Add logos to
`public/images/partners`, then add entries to `src/data/partners.js` with a unique
`id`, `name`, `logo` path (for example `/images/partners/example.svg`), and an optional
`href`. The list has no item limit and wraps on smaller screens. An empty list hides
the section. Rebuild the static export after changing the list.

The logo assets come from [Kerk Licht van de Wereld](https://lichtwereld.com/images/licht-wereld-logo.png),
[eHerkenning](https://www.eherkenning.nl/themes/custom/eherkenning/logo.svg),
[Belastingdienst ANBI Loket](https://anbi.belastingdienst.nl/),
[Filadelfia Oase Ministries](https://filadelfia-oase.nl/wp-content/uploads/2023/06/flaticon.jpg),
the [ANBI logo displayed on Filadelfia Oase](https://filadelfia-oase.nl/wp-content/uploads/2023/08/ANBI_FC.png),
[Iranian Church](https://iranian.church/assets/logo-DLQQg2Xz.png), and
[Gemeente Almere](https://www.almere.nl/_assets/f20fb53eac3716ad4f374a5272077327/Images/logo-almere-turquoise.svg).

## Annual financial reports

The existing ANBI page includes `AnnualFinancialReports` below the policy content
in English, Dutch, and Persian. The section shows an empty state until approved
reports are added; no sample reports or placeholder years are published.

To publish a report, upload its approved PDF to
`public/pdf/annual-financial-reports/` and add an entry to
`src/data/financialReports.js`:

```js
{
  year: 2025,
  pdfUrl: '/pdf/annual-financial-reports/2025.pdf',
  title: { id: 'annualFinancialReportTitle' },
  approved: true
}
```

Use the actual financial year and filename. The title uses the translated
`annualFinancialReportTitle` template from `messages/en.js`, `messages/nl.js`, and
`messages/fa.js`. Rebuild and deploy the complete static export. Reports are sorted
newest first. Unapproved entries are hidden, and the build rejects approved entries
with missing files, invalid PDF signatures, duplicate years, or nonlocal URLs.
Only place files approved for public release in `public/`: that entire directory
is publicly accessible, including files not listed in the report data.

Each year opens the reusable `FinancialReportModal` on the current page. Native
dialog behavior keeps focus inside the modal and supports Escape; the close button
and backdrop also dismiss it and restore focus and page scrolling. A locally hosted
PDF.js viewer loads only when opened, with page navigation, zoom, selectable text,
and PDF annotations. Rendering stays within the page so keyboard events, including
Escape after clicking inside the PDF, remain under the modal's control. Download
and new-tab links remain available below the viewer if previewing fails.

`npm run dev` and `npm run build` automatically prepare versioned PDF.js worker,
font, character-map, and image-decoding assets in the ignored `public/pdf-viewer`
directory. Deploy the complete export and generated `out/_headers` together. The
CSP permits the local worker and WebAssembly used for PDF image decoding; inline
JavaScript restrictions and the existing frame restrictions remain in place.

Run `npm run test:reports-browser` to exercise populated report modals in all three
languages at mobile, tablet, landscape, and desktop sizes. This builds a temporary
copy with clearly marked PDF viewer test documents, then deletes it. The real
report list, public files, and production export are never changed by the test.
It uses the same Chrome setup as `npm run test:browser`, which also verifies the
current report list and empty state.

## Languages and SEO

The separate introduction page is available at `/en/introduction/`,
`/fa/introduction/`, and `/nl/introduction/`, with a menu link in all three languages.
It uses the existing Hero, ContentSection, GridSteps, and ContentImageButton
components and the site's established styles. The complete Persian content and
English and Dutch translations are in `src/data/introduction.js`. All versions
cover the mission, vision, six service areas, values, local-church relationship,
membership requirements, and three application steps. The historic creeds and
four-week response period after a complete application are preserved.

Membership buttons link to the existing form in the selected language at
`/<locale>/join-us/#membership-form`. Language switching stays on the introduction
page. All three pages have localized metadata, language alternates, and sitemap
entries. Home pages retain their layout and link to the introduction page from
the About section. No organization or contact data has been added.

Additional illustrative photographs on the introduction page are stored locally:
[open Bible by Sixteen Miles Out](https://unsplash.com/photos/2wsZALRFtuc)
(`public/images/open-bible.jpg`) and
[community service by Joel Muniz](https://unsplash.com/photos/3k3l2brxmwQ)
(`public/images/community-service.jpg`), from Unsplash. These illustrate the
service themes and do not document the organization's own events.

The English home page is served directly at `/`, with Persian and Dutch home pages at `/fa` and `/nl`. Other pages have separate URLs under `/en`, `/fa`, or `/nl`. Legacy `/en` and localized `/Home` URLs redirect to the corresponding home page. Pages have localized titles and descriptions, canonical URLs, language alternates, and social previews. `/sitemap.xml` and `/robots.txt` are generated by Next.js.

The default canonical origin is `https://mantleofpraise.nl`. For another deployment domain, set `NEXT_PUBLIC_SITE_URL` to its full HTTPS origin before building. Submit the deployed sitemap in Google Search Console after launch.

The membership form submits to the existing external `contact.php` endpoint. That endpoint must
remain available and allow requests from the deployed site. The client validates required fields
and field lengths, trims text, prevents concurrent submissions, and aborts after 15 seconds.
Failed submissions retain the entered values. A timeout may occur after the server has received
the request, so the message asks visitors to contact the organization before resubmitting.
Requests omit cookies and referrers and reject redirects to avoid forwarding personal data.
These client safeguards do not replace validation and abuse prevention on the PHP server.

## Deployment checks

- Netlify builds the site with Next.js and publishes the static `out` directory. Redirects are configured in `netlify.toml`. The postbuild script generates response headers in `out/_headers`, including a Content Security Policy that permits the exact exported inline scripts by SHA-256 hash. Deploy the entire export and its headers together; changing HTML or injecting scripts after the build can invalidate the hashes. Other hosts must apply these response headers themselves.
- Postbuild also provides dot-separated aliases for Next.js segment payloads so client navigation and prefetching work on static hosts without additional rewrites.
- Serve the canonical domain over HTTPS. Redirect other hostnames, including `www` if configured, to the chosen canonical hostname.
- After deployment, verify `/`, `/fa`, `/nl`, `/sitemap.xml`, and `/robots.txt` on the public domain. Submit the sitemap and inspect sample URLs for all three languages in Google Search Console. Indexing is determined by Google and cannot be guaranteed by code alone.
- The registration form sends personal data directly to `www.ewcms.org`. Its server-side validation, rate limiting, retention, and CORS policy must be reviewed on that service. The current privacy checkbox has no linked policy document; publish and link the applicable policy before collecting registrations.
