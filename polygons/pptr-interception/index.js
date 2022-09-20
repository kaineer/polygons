const puppeteer = require("puppeteer")
const { join } = require("path");

const screenshotPath = join(__dirname, "artifacts/screenshot.png");
const url = "file://" + join(__dirname, "project/index.html")
const dir = "file://" + join(__dirname, "project");

const makeCheck = async (page) => {
  await page.screenshot({
    path: screenshotPath,
  });
}

const run = async (fn) => {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1920,
      height: 1080
    },
    args: []
  });

  const page = await browser.newPage();

  page.setRequestInterception(true);

  // add interception
  page.on("request", (request) => {
    if (request.isInterceptResolutionHandled()) return;

    const url = request.url();

    if (!url.startsWith(dir)) {
      const path = url.slice("file://".length);
      const newUrl = dir + path;

      console.log({ newUrl });

      request.continue({
        url: newUrl
      });
    } else {
      request.continue();
    }
  });

  await page.goto(url);

  await fn(page);

  await page.close();

  return browser.close();
}

run(makeCheck).then(() => console.log("done"))
