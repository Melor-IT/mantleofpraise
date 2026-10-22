const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawn } = require('node:child_process');
const chromePath =
  process.env.CHROME_PATH ||
  [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  ].find((file) => fs.existsSync(file));
if (!chromePath) throw new Error('Install Chrome/Chromium or set CHROME_PATH to its executable.');
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mantle-browser-check-'));
const eventHandlers = new Map();
const browser = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--disable-software-rasterizer',
    ...(process.env.BROWSER_TEST_NO_SANDBOX === '1'
      ? ['--no-sandbox', '--disable-gpu-sandbox']
      : []),
    '--disable-background-networking',
    '--disable-extensions',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-debugging-pipe',
    '--user-data-dir=' + path.join(tempDir, 'audit-browser-profile')
  ],
  { stdio: ['ignore', 'ignore', 'pipe', 'pipe', 'pipe'], windowsHide: true }
);
let nextId = 0,
  buffer = '',
  stderr = '';
const pending = new Map();
browser.stderr.on('data', (chunk) => {
  stderr = (stderr + chunk).slice(-1000);
});
browser.stdio[4].on('data', (chunk) => {
  buffer += chunk.toString();
  let boundary;
  while ((boundary = buffer.indexOf('\0')) !== -1) {
    const line = buffer.slice(0, boundary);
    buffer = buffer.slice(boundary + 1);
    if (!line) continue;
    const response = JSON.parse(line),
      waiter = pending.get(response.id);
    if (response.method) eventHandlers.get(response.method)?.(response);
    if (!waiter) continue;
    pending.delete(response.id);
    clearTimeout(waiter.timeout);
    response.error
      ? waiter.reject(new Error(JSON.stringify(response.error)))
      : waiter.resolve(response.result);
  }
});
function fail(error) {
  for (const waiter of pending.values()) {
    clearTimeout(waiter.timeout);
    waiter.reject(error);
  }
  pending.clear();
}
browser.on('error', fail);
browser.on('exit', (code) => fail(new Error('Browser exited ' + code + ': ' + stderr)));
function send(method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    const timeout = setTimeout(() => {
      pending.delete(id);
      reject(new Error('Timed out: ' + method));
    }, 20000);
    pending.set(id, { resolve, reject, timeout });
    browser.stdio[3].write(
      JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }) + '\0'
    );
  });
}

const assert = require('node:assert/strict');
const { createPreviewServer } = require(path.join(process.cwd(), 'scripts/preview.cjs'));
const server = createPreviewServer(path.resolve('out'));
(async () => {
  const { partners } = await import('../src/data/partners.js');
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  await send('Browser.getVersion');
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Page.enable', {}, sessionId);
  await send('Network.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);
  await send(
    'Network.setBlockedURLs',
    { urls: ['*fonts.googleapis.com*', '*fonts.gstatic.com*'] },
    sessionId
  );
  const exceptions = [],
    badResponses = [];
  let backgroundError;
  eventHandlers.set('Runtime.exceptionThrown', (event) =>
    exceptions.push(event.params.exceptionDetails)
  );
  eventHandlers.set('Network.responseReceived', (event) => {
    if (event.params.response.status >= 400 && event.params.response.url.startsWith(origin))
      badResponses.push({ url: event.params.response.url, status: event.params.response.status });
  });
  async function evaluate(expression) {
    const result = await send(
      'Runtime.evaluate',
      { expression, returnByValue: true, awaitPromise: true },
      sessionId
    );
    if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  async function pause(ms = 80) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function key(name, code) {
    await send(
      'Input.dispatchKeyEvent',
      {
        type: 'keyDown',
        key: name,
        code: name,
        windowsVirtualKeyCode: code,
        ...(name === 'Enter' ? { text: '\r', unmodifiedText: '\r' } : {})
      },
      sessionId
    );
    await send(
      'Input.dispatchKeyEvent',
      { type: 'keyUp', key: name, code: name, windowsVirtualKeyCode: code },
      sessionId
    );
  }
  async function navigate(url, width = 1440, height = 900) {
    await send(
      'Emulation.setDeviceMetricsOverride',
      { width, height, deviceScaleFactor: 1, mobile: false },
      sessionId
    );
    await send('Page.navigate', { url: origin + url }, sessionId);
    await pause(150);
    await evaluate(
      "new Promise((resolve,reject)=>{let n=0;let t=setInterval(()=>{if(document.readyState==='complete'&&document.querySelector('.donation-button')){clearInterval(t);resolve(true)}else if(n++>120){clearInterval(t);reject(Error('load timeout'))}},25)})"
    );
    await pause(100);
  }
  const { getAnnualFinancialReports } = await import('../src/lib/financialReports.js');
  const reports = await getAnnualFinancialReports();
  const reportLabels = {
    en: '6. Annual Financial Reports',
    nl: '6. Jaarrekeningen',
    fa: '۶. گزارش‌های مالی سالانه'
  };
  let reportCases = 0;
  for (const locale of ['en', 'nl', 'fa']) {
    for (const [width, height] of [
      [320, 640],
      [375, 812],
      [768, 500],
      [1440, 900]
    ]) {
      await navigate('/' + locale + '/ANBI-information/', width, height);
      const section = await evaluate(`(() => {
        const section = document.querySelector('.annual-financial-reports');
        return {
          title: section.querySelector('h2').textContent.trim(),
          years: [...section.querySelectorAll('.annual-financial-reports__year bdi')].map(e => Number(e.textContent)),
          last: section === section.parentElement.lastElementChild,
          empty: !!section.querySelector('.annual-financial-reports__empty'),
          viewers: section.querySelectorAll('.financial-report-viewer').length
        };
      })()`);
      assert.equal(section.title, reportLabels[locale]);
      assert.deepEqual(
        section.years,
        reports.map((report) => report.year)
      );
      assert(section.last, 'Reports must follow all existing ANBI content');
      assert.equal(section.empty, reports.length === 0);
      assert.equal(section.viewers, 0, 'PDFs must not load before opening a report');
      for (let index = 0; index < reports.length; index++) {
        const report = reports[index];
        await evaluate(
          `window.reportButton = document.querySelectorAll('.annual-financial-reports__year')[${index}]; reportButton.scrollIntoView({block:'center'}); reportButton.focus();`
        );
        const previousScroll = await evaluate('scrollY');
        const previousUrl = await evaluate('location.href');
        await key('Enter', 13);
        await pause();
        assert(
          await evaluate("!!document.querySelector('.financial-report-modal[open]')"),
          'Report did not open: ' +
            JSON.stringify(
              await evaluate(`({
            active: document.activeElement.outerHTML,
            button: reportButton.outerHTML,
            connected: reportButton.isConnected,
            dialogs: [...document.querySelectorAll('.financial-report-modal')].map(e => e.open)
          })`)
            )
        );
        await evaluate(`new Promise((resolve, reject) => {
          let attempts = 0;
          const timer = setInterval(() => {
            const canvas = document.querySelector('.financial-report-modal[open] canvas');
            if (canvas?.width > 0 && document.querySelector('.react-pdf__Page__textContent span')) {
              clearInterval(timer); resolve(true);
            } else if (++attempts > 200) {
              clearInterval(timer); reject(Error('PDF did not render: ' + document.querySelector('.financial-report-modal[open]').textContent));
            }
          }, 50);
        })`);
        const modal = await evaluate(`(() => {
          const dialog = document.querySelector('.financial-report-modal[open]');
          const rect = dialog.getBoundingClientRect();
          return {
            title: dialog.querySelector('h2').textContent,
            viewerTitle: dialog.querySelector('[role="region"]').getAttribute('aria-label'),
            closeFocus: document.activeElement === dialog.querySelector('button'),
            locked: document.body.style.overflow === 'hidden' && document.body.style.position === 'fixed',
            direction: getComputedStyle(dialog).direction,
            download: dialog.querySelector('a[download]').getAttribute('href'),
            fallback: dialog.querySelector('.financial-report-modal__actions a[target="_blank"]').getAttribute('href'),
            fits: rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0 && rect.bottom <= innerHeight,
            noOverflow: dialog.scrollWidth <= dialog.clientWidth + 1
          };
        })()`);
        assert.equal(modal.viewerTitle, modal.title);
        assert(modal.title.includes(String(report.year)));
        assert.equal(modal.download, report.pdfUrl);
        assert.equal(modal.fallback, report.pdfUrl);
        assert.equal(modal.direction, locale === 'fa' ? 'rtl' : 'ltr');
        assert(
          modal.closeFocus && modal.locked && modal.fits && modal.noOverflow,
          JSON.stringify(modal)
        );
        assert.equal(await evaluate('location.href'), previousUrl);
        const pdfResponse = await fetch(origin + report.pdfUrl);
        assert.equal(pdfResponse.status, 200);
        assert.equal(pdfResponse.headers.get('content-type'), 'application/pdf');
        assert.equal(pdfResponse.headers.get('x-frame-options'), 'DENY');
        if (process.env.BROWSER_SCREENSHOT_DIR && index === 0) {
          await pause(500);
          const screenshot = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
          fs.mkdirSync(process.env.BROWSER_SCREENSHOT_DIR, { recursive: true });
          fs.writeFileSync(
            path.join(process.env.BROWSER_SCREENSHOT_DIR, `report-${locale}-${width}.png`),
            Buffer.from(screenshot.data, 'base64')
          );
        }
        if (
          await evaluate(
            "!document.querySelector('.financial-report-viewer__toolbar > button:nth-of-type(2)').disabled"
          )
        ) {
          await evaluate(
            "document.querySelector('.financial-report-viewer__toolbar > button:nth-of-type(2)').click()"
          );
          await pause();
          assert.equal(
            await evaluate("document.querySelector('.react-pdf__Page').dataset.pageNumber"),
            '2'
          );
          await evaluate(
            "document.querySelector('.financial-report-viewer__toolbar > button:first-of-type').click()"
          );
          await pause();
          assert.equal(
            await evaluate("document.querySelector('.react-pdf__Page').dataset.pageNumber"),
            '1'
          );
        }
        const pageWidth = await evaluate(
          "document.querySelector('.react-pdf__Page').getBoundingClientRect().width"
        );
        await evaluate(
          "document.querySelector('.financial-report-viewer__zoom button:last-child').click()"
        );
        await pause();
        assert(
          (await evaluate(
            "document.querySelector('.react-pdf__Page').getBoundingClientRect().width"
          )) > pageWidth
        );
        await evaluate(
          "document.querySelector('.financial-report-viewer__zoom button:first-child').click(); document.querySelector('.financial-report-modal[open] .financial-report-modal__close').focus()"
        );
        await pause();
        for (let tab = 0; tab < 8; tab++) {
          await key('Tab', 9);
          await pause();
          assert(
            await evaluate(
              "document.querySelector('.financial-report-modal[open]').contains(document.activeElement)"
            ),
            'Focus escaped the report dialog: ' +
              JSON.stringify(
                await evaluate(`({
              tab: ${tab}, tag: document.activeElement.tagName, className: document.activeElement.className,
              documentFocused: document.hasFocus()
            })`)
              )
          );
        }
        // Escape must dismiss the modal even after the PDF receives focus.
        const pdfPoint = await evaluate(`(() => {
          const viewport = document.querySelector('.financial-report-viewer__viewport');
          viewport.focus();
          const rect = viewport.getBoundingClientRect();
          return { x: rect.left + rect.width * 0.65, y: rect.top + rect.height * 0.5 };
        })()`);
        await send(
          'Input.dispatchMouseEvent',
          { type: 'mousePressed', ...pdfPoint, button: 'left', clickCount: 1 },
          sessionId
        );
        await send(
          'Input.dispatchMouseEvent',
          { type: 'mouseReleased', ...pdfPoint, button: 'left', clickCount: 1 },
          sessionId
        );
        await key('Escape', 27);
        await pause();
        assert(!(await evaluate("!!document.querySelector('.financial-report-modal[open]')")));
        assert(await evaluate('document.activeElement === reportButton'));
        assert.equal(await evaluate('document.body.style.overflow'), '');
        assert(Math.abs((await evaluate('scrollY')) - previousScroll) <= 1);
        await evaluate('reportButton.click()');
        await pause();
        await evaluate(
          "document.querySelector('.financial-report-modal[open] .financial-report-modal__close').click()"
        );
        await pause();
        assert(!(await evaluate("!!document.querySelector('.financial-report-modal[open]')")));
        await evaluate('reportButton.click()');
        await pause();
        await send(
          'Input.dispatchMouseEvent',
          { type: 'mousePressed', x: 1, y: 1, button: 'left', clickCount: 1 },
          sessionId
        );
        await send(
          'Input.dispatchMouseEvent',
          { type: 'mouseReleased', x: 1, y: 1, button: 'left', clickCount: 1 },
          sessionId
        );
        await pause();
        assert(
          !(await evaluate("!!document.querySelector('.financial-report-modal[open]')")),
          'Backdrop did not close the dialog'
        );
        assert(await evaluate('document.activeElement === reportButton'));
        assert.equal(await evaluate('location.href'), previousUrl);
      }
      reportCases++;
    }
  }
  assert.equal(exceptions.length, 0, JSON.stringify(exceptions));
  assert.equal(badResponses.length, 0, JSON.stringify(badResponses));
  console.log(JSON.stringify({ annualReportCases: reportCases, approvedReports: reports.length }));
  if (process.env.REPORTS_ONLY === '1' && reports.length) {
    await navigate('/en/ANBI-information/');
    await send(
      'Network.setBlockedURLs',
      { urls: ['*fonts.googleapis.com*', '*fonts.gstatic.com*', '*' + reports[0].pdfUrl] },
      sessionId
    );
    await evaluate("document.querySelector('.annual-financial-reports__year').click()");
    await evaluate(`new Promise((resolve, reject) => {
      let attempts = 0;
      const timer = setInterval(() => {
        if(document.querySelector('.financial-report-modal[open] [role="alert"]')) { clearInterval(timer); resolve(true); }
        else if(++attempts > 200) { clearInterval(timer); reject(Error('Missing PDF error fallback')); }
      }, 50);
    })`);
    assert(
      await evaluate(
        "!!document.querySelector('.financial-report-modal[open] a[download]') && !!document.querySelector('.financial-report-modal__actions a[target=\"_blank\"]')"
      )
    );
    await key('Escape', 27);
    await pause();
    assert(!(await evaluate("!!document.querySelector('.financial-report-modal[open]')")));
    console.log(JSON.stringify({ pdfFailureFallbackPassed: true }));
  }
  if (process.env.REPORTS_ONLY === '1') return;
  for (const locale of ['en', 'fa', 'nl']) {
    for (const width of [375, 1440]) {
      await navigate('/' + locale + '/ANBI-information/', width);
      if (width <= 600) {
        await evaluate("document.querySelector('.hamburger').click()");
        await pause();
      }
      const selector = width <= 600 ? '.mobile-menu' : '.nav-menu';
      for (const slug of ['ANBI-information/', 'anbi-information/', 'anbi-information']) {
        await evaluate(
          'history.replaceState(null, "", ' + JSON.stringify('/' + locale + '/' + slug) + ')'
        );
        await pause(250);
        const activeLinks = await evaluate(
          `([...document.querySelectorAll('${selector} a.active')].map(a => ({href:a.getAttribute('href'),current:a.getAttribute('aria-current'),underline:getComputedStyle(a,'::after').opacity})))`
        );
        assert.equal(
          activeLinks.length,
          1,
          'Expected one active menu link: ' + locale + '/' + slug
        );
        assert.equal(activeLinks[0].href, '/' + locale + '/ANBI-information/');
        assert.equal(activeLinks[0].current, 'page');
        if (width > 600) assert.equal(activeLinks[0].underline, '1', 'ANBI underline is hidden');
      }
    }
  }
  console.log(JSON.stringify({ anbiActiveNavigationPassed: true }));
  const urls = ['/'];
  for (const locale of ['en', 'fa', 'nl'])
    for (const route of [
      '',
      'introduction',
      'about-us',
      'join-us',
      'our-vision',
      'ANBI-information'
    ])
      urls.push('/' + locale + '/' + (route ? route + '/' : ''));
  let cases = 0;
  for (const url of urls)
    for (const width of [320, 375, 600, 900, 1440]) {
      await navigate(url, width);
      const heroImage = await evaluate(
        "(async()=>{const image=document.querySelector('main section:first-child > .background > img');if(!image)return null;await image.decode();const style=getComputedStyle(image);return{src:image.currentSrc,width:image.naturalWidth,priority:image.fetchPriority,loading:image.loading,fit:style.objectFit}})()"
      );
      assert(heroImage?.width > 0, 'Hero image did not load: ' + url);
      assert(heroImage.src.includes('/images/optimized/') && heroImage.src.endsWith('.webp'));
      assert.equal(heroImage.priority, 'high');
      assert.equal(heroImage.loading, 'eager');
      assert.equal(heroImage.fit, 'cover');
      const locale = url === '/' ? 'en' : url.split('/')[1];
      const result = await evaluate(
        "(()=>({lang:document.documentElement.lang,dir:document.querySelector('.app').dir,h1:document.querySelectorAll('main h1').length,overflow:document.documentElement.scrollWidth>innerWidth+1,languages:[...document.querySelectorAll('.language-menu button')].map(e=>e.textContent.trim().toLowerCase()),partners:document.querySelectorAll('.partners-grid li').length,links:[...document.querySelectorAll('a[href],img[src]')].map(e=>e.href||e.src).filter(v=>v.startsWith(location.origin)),headers:document.querySelectorAll('.app-header').length}))()"
      );
      assert.equal(result.lang, locale);
      assert.equal(result.dir, locale === 'fa' ? 'rtl' : 'ltr');
      assert.equal(result.h1, 1);
      assert.equal(result.headers, 1);
      assert(!result.overflow, JSON.stringify({ url, width, result }));
      assert.equal(result.partners, url.includes('/about-us/') ? partners.length : 0);
      assert.equal(result.languages.length, 2);
      assert(!result.languages.includes(locale));
      for (const href of result.links) {
        let file = path.join(process.cwd(), 'out', decodeURIComponent(new URL(href).pathname));
        if (fs.existsSync(file) && fs.statSync(file).isDirectory())
          file = path.join(file, 'index.html');
        assert(fs.existsSync(file), 'Missing local resource ' + href);
      }
      const selector =
        width <= 600 ? '.mobile-menu .donation-button' : '.header-actions .donation-button';
      if (width <= 600) {
        await evaluate("document.querySelector('.hamburger').click()");
        await pause();
      }
      await evaluate('document.querySelector(' + JSON.stringify(selector) + ').click()');
      await pause(100);
      assert(
        await evaluate("document.querySelector('.donation-dialog').open"),
        'Hydration failed under CSP: ' + url
      );
      await key('Escape', 27);
      await pause();
      assert(!(await evaluate("document.querySelector('.donation-dialog').open")));
      cases++;
      if (cases % 10 === 0) console.log(JSON.stringify({ checkedPages: cases }));
    }
  console.log(
    JSON.stringify({
      responsivePages: cases,
      exceptions: exceptions.length,
      badResponses: badResponses.length
    })
  );
  assert.equal(exceptions.length, 0, JSON.stringify(exceptions));
  assert.equal(badResponses.length, 0, JSON.stringify(badResponses));
  await navigate('/en/about-us/', 1440);
  await evaluate("document.querySelector('.language-trigger').focus()");
  await key('ArrowDown', 40);
  await pause();
  assert(await evaluate("document.activeElement.matches('[role=menuitem]')"));
  await key('ArrowDown', 40);
  assert.equal(await evaluate('document.activeElement.textContent.trim()'), 'NL');
  await key('Home', 36);
  assert.equal(await evaluate('document.activeElement.textContent.trim()'), 'FA');
  await key('End', 35);
  assert.equal(await evaluate('document.activeElement.textContent.trim()'), 'NL');
  await key('Escape', 27);
  assert(await evaluate("document.activeElement.matches('.language-trigger')"));
  await evaluate("document.querySelector('.language-trigger').click()");
  await pause();
  await evaluate("document.querySelector('.language-menu button').click()");
  await pause(350);
  assert.equal(await evaluate('location.pathname'), '/fa/about-us/');
  assert.equal(await evaluate('document.documentElement.lang'), 'fa');
  await navigate('/', 375);
  await evaluate("document.querySelector('.hamburger').click()");
  await send(
    'Emulation.setDeviceMetricsOverride',
    { width: 560, height: 900, deviceScaleFactor: 1, mobile: false },
    sessionId
  );
  await pause();
  assert(
    await evaluate("document.querySelector('.hamburger').getAttribute('aria-expanded')==='true'"),
    'Mobile menu closed at 560px'
  );
  await evaluate("document.querySelector('.mobile-menu a').focus()");
  await key('Escape', 27);
  await pause();
  assert(await evaluate("document.activeElement.matches('.hamburger')"));
  assert(
    await evaluate("document.querySelector('.hamburger').getAttribute('aria-expanded')==='false'")
  );
  await navigate('/', 375, 390);
  await evaluate("document.querySelector('.hamburger').click()");
  await pause();
  const menu = await evaluate(
    "(()=>{const e=document.querySelector('.mobile-menu'),s=getComputedStyle(e);return{bottom:e.getBoundingClientRect().bottom,scroll:s.overflowY,height:innerHeight}})()"
  );
  console.log(JSON.stringify({ shortViewportMenu: menu }));
  assert(menu.bottom <= menu.height && menu.scroll === 'auto');
  await navigate('/', 1440);
  await evaluate(
    "(()=>{const s=document.createElement('script');s.textContent='window.__injected=true';document.body.append(s);const b=document.createElement('button');b.setAttribute('onclick','window.__handlerInjected=true');document.body.append(b);b.click();})()"
  );
  assert.equal(
    await evaluate('!!window.__injected||!!window.__handlerInjected'),
    false,
    'CSP allowed injected JavaScript'
  );
  console.log(JSON.stringify({ keyboardAndLanguageSwitchPassed: true, cspInjectionBlocked: true }));
  let mode = 'success',
    requests = [];
  eventHandlers.set('Fetch.requestPaused', async (event) => {
    const { requestId, request } = event.params;
    try {
      if (request.method === 'OPTIONS') {
        await send(
          'Fetch.fulfillRequest',
          {
            requestId,
            responseCode: 204,
            responseHeaders: [
              { name: 'Access-Control-Allow-Origin', value: origin },
              { name: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
              { name: 'Access-Control-Allow-Headers', value: 'content-type' }
            ]
          },
          sessionId
        );
        return;
      }
      requests.push({
        method: request.method,
        body: JSON.parse(request.postData),
        headers: request.headers
      });
      if (mode === 'hang') return;
      await pause(100);
      if (mode === 'network')
        await send('Fetch.failRequest', { requestId, errorReason: 'Failed' }, sessionId);
      else
        await send(
          'Fetch.fulfillRequest',
          {
            requestId,
            responseCode: mode === 'success' ? 200 : 500,
            responseHeaders: [
              { name: 'Access-Control-Allow-Origin', value: origin },
              { name: 'Content-Type', value: 'application/json' }
            ],
            body: Buffer.from(JSON.stringify({ success: mode === 'success' })).toString('base64')
          },
          sessionId
        );
    } catch (error) {
      backgroundError = error;
    }
  });
  await send(
    'Fetch.enable',
    { patterns: [{ urlPattern: '*www.ewcms.org*', requestStage: 'Request' }] },
    sessionId
  );
  async function fillForm(whitespace = false) {
    await evaluate(
      "(()=>{const values={firstName:'  Test  ',lastName:' Example ',email:'test@example.com',phone:'+31612345678',city:'Almere',church:'Test church',pastor:'Test pastor',gifts:' Testing '};for(const [name,value]of Object.entries(values)){const e=document.querySelector('[name='+name+']');Object.getOwnPropertyDescriptor(e.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype,'value').set.call(e,value);e.dispatchEvent(new Event('input',{bubbles:true}));}for(const name of ['agreeTerms','agreePrivacy']){const e=document.querySelector('[name='+name+']');if(!e.checked)e.click();}})()"
    );
    if (whitespace)
      await evaluate(
        "(()=>{const e=document.querySelector('[name=firstName]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,'   ');e.dispatchEvent(new Event('input',{bubbles:true}));})()"
      );
  }
  async function submit() {
    await evaluate(
      "document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))"
    );
  }
  let formCases = 0;
  for (const locale of ['en', 'fa', 'nl']) {
    await navigate('/' + locale + '/join-us/');
    mode = 'success';
    requests = [];
    await fillForm(true);
    await submit();
    await pause(150);
    assert.equal(requests.length, 0);
    assert(await evaluate("document.querySelector('.form-status').classList.contains('error')"));
    await fillForm();
    await submit();
    await submit();
    await pause(50);
    assert(await evaluate("document.querySelector('[name=firstName]').disabled"));
    await pause(500);
    assert.equal(requests.length, 1);
    assert.equal(requests[0].body.firstName, 'Test');
    assert.equal(requests[0].body.gifts, 'Testing');
    assert.equal(requests[0].method, 'POST');
    assert(
      !Object.keys(requests[0].headers).some((k) => ['cookie', 'referer'].includes(k.toLowerCase()))
    );
    assert(await evaluate("document.querySelector('.form-status').classList.contains('success')"));
    assert.equal(await evaluate("document.querySelector('[name=firstName]').value"), '');
    assert(!(await evaluate("document.querySelector('button[type=submit]').disabled")));
    mode = 'failure';
    requests = [];
    await fillForm();
    await submit();
    await pause(500);
    assert.equal(requests.length, 1);
    assert(await evaluate("document.querySelector('.form-status').classList.contains('error')"));
    assert.equal(await evaluate("document.querySelector('[name=firstName]').value"), '  Test  ');
    assert(!(await evaluate("document.querySelector('button[type=submit]').disabled")));
    formCases += 3;
  }
  await navigate('/en/join-us/');
  mode = 'network';
  requests = [];
  await fillForm();
  await submit();
  await pause(500);
  assert.equal(requests.length, 1);
  assert(await evaluate("document.querySelector('.form-status').classList.contains('error')"));
  formCases++;
  await navigate('/fa/join-us/');
  mode = 'hang';
  requests = [];
  await fillForm();
  await submit();
  await pause(15500);
  assert.equal(requests.length, 1);
  assert(await evaluate("document.querySelector('.form-status').classList.contains('error')"));
  assert(!(await evaluate("document.querySelector('button[type=submit]').disabled")));
  assert.equal(await evaluate("document.querySelector('[name=firstName]').value"), '  Test  ');
  formCases++;
  assert(!backgroundError, backgroundError?.message);
  console.log(
    JSON.stringify({ mockedFormCases: formCases, noRealPostRequests: true, timeoutPassed: true })
  );
})()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const exited =
      browser.exitCode === null && browser.signalCode === null
        ? new Promise((resolve) => browser.once('exit', resolve))
        : Promise.resolve();
    browser.kill();
    await new Promise((resolve) => server.close(resolve));
    await exited;
    if (
      path.dirname(tempDir) !== path.resolve(os.tmpdir()) ||
      !path.basename(tempDir).startsWith('mantle-browser-check-')
    )
      throw new Error('Unexpected browser test directory');
    fs.rmSync(tempDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  });
