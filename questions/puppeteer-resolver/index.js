(async () => {
  const PCR = require("puppeteer-chromium-resolver");
  const option = {
    revision: "",
    detectionPath: "",
    folderName: ".chromium-browser-snapshots",
    defaultHosts: ["https://storage.googleapis.com", "https://npm.taobao.org/mirrors"],
    hosts: [],
    cacheRevisions: 2,
    retry: 3,
    silent: false
  };
  const stats = await PCR(option);
  const browser = await stats.puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"],
    executablePath: stats.executablePath
  }).catch(function(error) {
    console.log(error);
  });
  const page = await browser.newPage();
  await page.goto("https://www.npmjs.com/package/puppeteer-chromium-resolver");
  await browser.close();
})();
