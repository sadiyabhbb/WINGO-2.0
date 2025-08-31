require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { scrapeLastRounds } = require("./scraper");
const { predictNext } = require("./predict");
const { formatRoundsWithPeriod, formatSignal } = require("./format");

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN মিসিং (.env)");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 `/signal` লিখলে আমি সাইটে লগইন করে live rounds নিয়ে Small/Big সিগন্যাল দেবো।\n\n⚠️ নোট: প্রথমে .env এ market username/password সেট করতে হবে।",
    { parse_mode: "Markdown" }
  );
});

bot.onText(/\/signal/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    // scrape last rounds with period+number
    const rounds = await scrapeLastRounds();
    if (!rounds?.length) {
      await bot.sendMessage(chatId, "⚠️ রাউন্ড ডেটা পান নাই। Selector/URL ঠিক আছে কিনা দেখো।");
      return;
    }

    const numbers = rounds.map(r => r.number).filter(Boolean);
    const { signal } = predictNext(numbers);

    const text = formatRoundsWithPeriod(rounds) + formatSignal(signal);
    await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });

  } catch (err) {
    console.error("❌ /signal error:", err);
    await bot.sendMessage(chatId, "❌ ডেটা আনতে সমস্যা হয়েছে (login/selectors/captcha?).");
  }
});
