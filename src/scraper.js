const puppeteer = require("puppeteer");
require("dotenv").config();

const BASE = process.env.MARKET_BASE_URL || "https://dkwin9.com";
const LOGIN_PATH = process.env.MARKET_LOGIN_PATH || "/login";
const GAME_PATH = process.env.MARKET_GAME_PATH || "/game";

const USERNAME = process.env.MARKET_USERNAME;
const PASSWORD = process.env.MARKET_PASSWORD;

if (!USERNAME || !PASSWORD) {
  console.error("❌ MARKET_USERNAME / MARKET_PASSWORD সেট করুন (.env)");
  process.exit(1);
}

// NOTE: Render/Railway-তে no-sandbox দরকার হতে পারে
const launchOpts = {
  headless: (process.env.PUPPETEER_HEADLESS || "true") === "true",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
  slowMo: Number(process.env.PUPPETEER_SLOWMO || 0)
};

// 👉 এখানে SELECTOR গুলো তোমার সাইট অনুযায়ী আপডেট করবে
const SELECTORS = {
  username: "#username",      // change if needed
  password: "#password",      // change if needed
  loginBtn: "#loginButton",   // change if needed
  // game rows: প্রতি রাউন্ডে period + number থাকে এমন row selector
  row: ".game-row",
  periodCell: ".period-cell",
  numberCell: ".number-cell"
};

async function scrapeLastRounds() {
  const browser = await puppeteer.launch(launchOpts);
  const page = await browser.newPage();

  // 1) Login
  await page.goto(`${BASE}${LOGIN_PATH}`, { waitUntil: "networkidle2" });

  // Wait + Type
  await page.waitForSelector(SELECTORS.username, { timeout: 15000 });
  await page.type(SELECTORS.username, USERNAME, { delay: 30 });

  await page.waitForSelector(SELECTORS.password, { timeout: 15000 });
  await page.type(SELECTORS.password, PASSWORD, { delay: 30 });

  await Promise.all([
    page.click(SELECTORS.loginBtn),
    page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 })
  ]);

  // 2) Go to game page
  await page.goto(`${BASE}${GAME_PATH}`, { waitUntil: "networkidle2", timeout: 60000 });

  // 3) Scrape rounds
  // 🔁 কখনো সাইটে টেবিল/কার্ড লোড হতে সময় নেয়—সেজন্য waitForSelector
  await page.waitForSelector(SELECTORS.row, { timeout: 30000 });

  const rounds = await page.evaluate((S) => {
    const rows = Array.from(document.querySelectorAll(S.row));
    return rows.map(row => {
      const periodEl = row.querySelector(S.periodCell);
      const numberEl = row.querySelector(S.numberCell);
      return {
        period: periodEl ? periodEl.textContent.trim() : null,
        number: numberEl ? numberEl.textContent.trim() : null
      };
    }).filter(r => r.period && r.number);
  }, SELECTORS);

  await browser.close();
  // কিছু সাইটে newest first থাকে—তুমি চাইলে sort/flip করতে পারো
  return rounds.slice(-10);
}

module.exports = { scrapeLastRounds };
