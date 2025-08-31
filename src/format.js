function formatRoundsWithPeriod(rounds) {
  // rounds: [{ period: '12345', number: '6' }, ...] (newest last or first—তুমি যেভাবে দাও)
  // আমরা শেষ 10টা ধরে দেখাই
  const last = rounds.slice(-10);
  const lines = last.map(r => `${r.period}: ${r.number}`);
  return "📊 Last Rounds (Period: Number)\n" + lines.join("\n");
}

function formatSignal(signal) {
  return `\n\n🔮 Next Signal → *${signal}*`;
}

module.exports = { formatRoundsWithPeriod, formatSignal };
