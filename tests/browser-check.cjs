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
      { type: 'keyDown', key: name, code: name, windowsVirtualKeyCode: code },
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
  const urls = ['/'];
  for (const locale of ['en', 'fa', 'nl'])
    for (const route of ['', 'about-us', 'join-us', 'our-vision', 'ANBI-information'])
      urls.push('/' + locale + '/' + (route ? route + '/' : ''));
  let cases = 0;
  for (const url of urls)
    for (const width of [320, 375, 600, 900, 1440]) {
      await navigate(url, width);
      const locale = url === '/' ? 'en' : url.split('/')[1];
      const result = await evaluate(
        "(()=>({lang:document.documentElement.lang,dir:document.querySelector('.app').dir,h1:document.querySelectorAll('main h1').length,overflow:document.documentElement.scrollWidth>innerWidth+1,languages:[...document.querySelectorAll('.language-menu button')].map(e=>e.textContent.trim().toLowerCase()),partners:document.querySelectorAll('.partners-grid li').length,links:[...document.querySelectorAll('a[href],img[src]')].map(e=>e.href||e.src).filter(v=>v.startsWith(location.origin)),headers:document.querySelectorAll('.app-header').length}))()"
      );
      assert.equal(result.lang, locale);
      assert.equal(result.dir, locale === 'fa' ? 'rtl' : 'ltr');
      assert.equal(result.h1, 1);
      assert.equal(result.headers, 1);
      assert(!result.overflow, JSON.stringify({ url, width, result }));
      assert.equal(result.partners, 5);
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
