# Small/Big Puppeteer Bot

Puppeteer দিয়ে ওয়েবসাইটে লগইন করে live rounds scrape করে Small/Big signal দেয়—Telegram bot কমান্ড: `/signal`.

## Setup
1. Clone repo
2. `cp .env.example .env` — টোকেন ও মার্কেট ক্রেডেনশিয়াল বসাও
3. `npm install`
4. `npm start`

## Env
- TELEGRAM_BOT_TOKEN
- MARKET_BASE_URL (default: https://dkwin9.com)
- MARKET_LOGIN_PATH (default: /login)
- MARKET_GAME_PATH  (default: /game)
- MARKET_USERNAME / MARKET_PASSWORD

## Deploy (Render)
- Build Command: `npm install`
- Start Command: `npm start`
- Add env vars in Render dashboard.

## Important
- Login form selectors ও game table selectors সাইট অনুযায়ী আপডেট করো:
  - username: `#username`
  - password: `#password`
  - loginBtn: `#loginButton`
  - row: `.game-row`
  - periodCell: `.period-cell`
  - numberCell: `.number-cell`
- যদি captcha/2FA থাকে, automation বাধা পেতে পারে।
- Terms of Service follow করো।
