const puppeteer = require("puppeteer");
require("dotenv").config();

async function scrapeGame() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // go to site
  await page.goto(process.env.GAME_URL, { waitUntil: "networkidle2" });

  // login
  await page.type("input[placeholder='Username']", process.env.GAME_USER);
  await page.type("input[placeholder='Password']", process.env.GAME_PASS);
  await page.click("button.login-btn");

  await page.waitForTimeout(5000); // wait after login

  // navigate game page
  await page.goto(process.env.GAME_URL, { waitUntil: "networkidle2" });
  await page.waitForTimeout(5000);

  // grab period + last results
  const data = await page.evaluate(() => {
    const period = document.querySelector(".period-class")?.innerText || "N/A";
    const numbers = Array.from(document.querySelectorAll(".result-class"))
      .map(el => el.innerText)
      .slice(0, 10);
    return { period, numbers };
  });

  await browser.close();
  return data;
}

module.exports = { scrapeGame };
