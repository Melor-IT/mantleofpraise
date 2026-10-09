# Security and technical review

Reviewed on 2026-10-09. Scope: the application source, static assets, dependency tree,
build output, and deployment configuration in this repository. This is a source and
functional review, not a penetration test or a guarantee that no vulnerability exists.

## Changes

- Updated Next.js from 16.3.6 to 16.4.0 and react-intl from 12.1.2 to 12.1.4.
  Updated vulnerable transitive dependencies sharp and source-map-js. The initial
  npm audit reported three high-severity vulnerable packages; the updated tree reports zero.
- Replaced unrestricted inline script execution in the production CSP with SHA-256
  hashes computed from the finished export. Existing restrictions on frames, objects,
  network destinations, permissions, and MIME sniffing remain in the generated headers.
  Inline styles remain allowed because the components use dynamic style attributes.
- Fixed static-export segment payload filenames. Browser prefetch requests previously
  returned 404 because Next's dot-separated URLs did not match nested exported files.
  Postbuild creates compatible aliases without changing the payloads.
- Hardened membership submissions with required-field and length checks, trimmed
  values, a synchronous duplicate-submit guard, a 15-second timeout, unmount cancellation,
  and preservation of values on failure. Requests omit cookies/referrers and reject redirects.
  The timeout message explains that visitors should contact the organization before retrying.
- Matched the mobile menu resize threshold to CSS, added dismissal and keyboard focus
  behavior, made the language selector keyboard accessible, and allowed the mobile menu
  to scroll in short viewports. Long Dutch headings now wrap on narrow screens.
- Fixed `npm start` to preview the static export instead of using unsupported `next start`.
  The preview binds to loopback, applies the generated CSP, rejects unsupported methods,
  and prevents serving dotfiles, configuration files, and files outside the export.
- Aligned navigation, canonical URLs, and sitemap entries with trailing-slash hosting.
  Invalid canonical-domain environment settings now fail the build explicitly.

## Validation

- Production build and postbuild completed successfully on Node.js 22.23.3,
  matching the configured Netlify major version. Local Node.js 25.8.1 also passed.
- `npm audit` and `npm audit --omit=dev`: zero known vulnerabilities.
- `npm outdated`: no outdated declared direct dependencies at review time.
- `npm test`: security-header, static-file containment, and segment-export regression checks.
- Browser checks cover 16 page URLs in English, Persian, and Dutch at five widths
  (320, 375, 600, 900, and 1440 pixels): 80 combinations. They check language/direction,
  headings, layout overflow, local resources, partners, donation opening/closing,
  JavaScript exceptions, and failed internal requests under the generated CSP.
- Keyboard navigation, language switching, a short mobile viewport, and actual CSP
  rejection of injected script nodes and inline event handlers were checked.
- Donation behavior passed 32 additional page/viewport cases under the final CSP,
  including backdrop, Escape and close-button dismissal, preserved URL/scroll position,
  focus restoration and containment, and clipboard copying of the IBAN.
- Eleven mocked membership cases cover whitespace validation, success and server errors
  in each language, network failure, and timeout. Concurrent submission is checked.
  No real registration or payment was submitted.
- The exported payment QR images decoded to the supplied ING request URL. Sitemap
  entries are unique and point to the 15 canonical pages. No public source maps or
  environment files were found in the export. No credentials or dangerous HTML execution
  sinks were found in the inspected application and configuration files.

To repeat: `npm run build`, `npm test`, `npm run test:browser`, and `npm audit`.
Browser checks require Chrome/Chromium and block Google Fonts for repeatable offline
layout checks. Set `CHROME_PATH` if automatic browser discovery fails.
This restricted Windows environment required `BROWSER_TEST_NO_SANDBOX=1` for the
isolated Chrome test process. Browser tests use the sandbox by default elsewhere.

## External and deployment limits

- The PHP membership backend is hosted at `www.ewcms.org` and its source is absent here.
  A read-only HEAD request returned HTTP 400 with JSON content type and
  `Access-Control-Allow-Origin: *`. This does not prove its validation, injection defenses,
  abuse prevention, mail handling, retention, or storage security. Those controls require
  a separate backend review; browser validation cannot enforce them.
- The privacy checkbox has no linked privacy policy. The organization must provide
  the applicable policy so it can be linked before collecting registrations.
- Partner destinations and Instagram returned HTTP 200 during read-only checks.
  The ING request timed out during a HEAD check, so live payment availability was not
  confirmed. The QR contents are correct; no payment was attempted.
- These changes are local. The existing live site still serves its previous CSP until
  the new build is deployed. Verify the actual response headers, redirects, form CORS,
  and payment destination after publication. Deploy HTML and `_headers` together and
  avoid postbuild HTML transformations or script injection that would change script hashes.
- Google Fonts remains an external font dependency. Several source images are between
  1.8 and 2.7 MB; further asset optimization could improve loading on slow connections.

## References

- [Next.js image optimization security advisory](https://github.com/vercel/next.js/security/advisories/GHSA-cjq9-62q9-8jv4)
- [sharp librsvg security advisory](https://github.com/lovell/sharp/security/advisories/GHSA-wq5f-xc86-pv6w)
- [Next.js static-export segment path issue](https://github.com/vercel/next.js/issues/85374)
- [Netlify custom response headers](https://docs.netlify.com/manage/routing/headers/)
- [CSP script hashes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src)
