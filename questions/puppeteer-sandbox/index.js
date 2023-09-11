const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const factory = (value) => ([(_, value) => {
    document.body.innerHTML = value;
  }, value]);

  await page.$eval("body", ...factory("Hello, factory"));
  const html = await page.$eval("body", (el) => el.outerHTML);
  console.log({ html });

  // other actions...
  await browser.close();
})();
