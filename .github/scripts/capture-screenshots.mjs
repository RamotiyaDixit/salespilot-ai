import fs from "node:fs";
import { chromium } from "playwright";
const waitForUrl = async (url) => {
  let lastError;
  for (let i=0; i<60; i++) {
    try { const response = await fetch(url); if (response.ok) return; }
    catch (error) { lastError = error; }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  throw new Error("Timed out waiting for " + url + ": " + String(lastError || "no successful response"));
};
await waitForUrl("http://127.0.0.1:4000/health");
await waitForUrl("http://127.0.0.1:3000");
await waitForUrl("http://127.0.0.1:8081");
fs.mkdirSync("docs/screenshots", {recursive:true});
const browser = await chromium.launch({headless:true,args:["--no-sandbox"]});
try {
  const desktop = await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  await desktop.goto("http://127.0.0.1:3000",{waitUntil:"networkidle",timeout:90000});
  await desktop.locator(".metric-grid").waitFor({state:"visible",timeout:60000});
  await desktop.waitForTimeout(1200);
  await desktop.screenshot({path:"docs/screenshots/web-dashboard.png",fullPage:true,animations:"disabled"});
  const mobile = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  await mobile.goto("http://127.0.0.1:8081",{waitUntil:"networkidle",timeout:90000});
  await mobile.getByText("Your performance",{exact:true}).waitFor({state:"visible",timeout:60000});
  await mobile.waitForTimeout(1200);
  await mobile.screenshot({path:"docs/screenshots/mobile-app.png",fullPage:true,animations:"disabled"});
  console.log("Captured web dashboard and Expo mobile app screenshots.");
} finally {
  await browser.close();
}
