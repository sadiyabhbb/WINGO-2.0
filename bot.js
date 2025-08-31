require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { scrapeGame } = require("./scraper");
const { predict } = require("./predict");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "👋 Send /signal to get next market prediction.");
});

bot.onText(/\/signal/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    bot.sendMessage(chatId, "⏳ Fetching market data...");
    const { period, numbers } = await scrapeGame();

    if (!numbers || numbers.length < 5) {
      return bot.sendMessage(chatId, "⚠️ Couldn't fetch enough results.");
    }

    let result = predict(numbers);

    bot.sendMessage(
      chatId,
      `🎯 Period: ${period}\n📊 Last Numbers: ${numbers.join(", ")}\n\n🔮 Next Signal → *${result.pred}*\n📈 Confidence → ${(result.confidence * 100).toFixed(1)}%`,
      { parse_mode: "Markdown" }
    );
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Error fetching market data.");
  }
});
