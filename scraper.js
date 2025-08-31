const puppeteer = require("puppeteer");
require("dotenv").config();

async function scrapeGame() {
  let browser;
  try {
    // Puppeteer launch (Render compatible)
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    // Go to site
    await page.goto(process.env.GAME_URL, { waitUntil: "networkidle2" });

    // Login
    await page.type("input[placeholder='Username']", process.env.GAME_USER);
    await page.type("input[placeholder='Password']", process.env.GAME_PASS);
    await page.click("button.login-btn");

    // Wait for login to complete
    await page.waitForTimeout(5000);

    // Navigate to game page after login
    await page.goto(process.env.GAME_URL, { waitUntil: "networkidle2" });
    
    // Wait for results selector
    await page.waitForSelector(".result-class", { timeout: 10000 });

    // Scrape data
    const data = await page.evaluate(() => {
      const period = document.querySelector(".period-class")?.innerText || "N/A";
      const results = Array.from(document.querySelectorAll(".result-class"))
        .map(el => el.innerText)
        .slice(0, 10);

      return { period, numbers: results };
    });

    // Validate data
    if (!data.numbers || data.numbers.length === 0) {
      throw new Error("No numbers found on page. Check selectors or page layout.");
    }

    return data;

  } catch (err) {
    console.error("Scraper error:", err);
    throw err; // Let bot.js catch and notify
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { scrapeGame };
