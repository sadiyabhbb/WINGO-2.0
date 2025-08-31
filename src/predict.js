// Small/Big helper + simple heuristic
function numToLabel(n) {
  const x = Number(n);
  if (Number.isNaN(x)) return null;
  return x <= 4 ? "Small" : "Big";
}

function predictNext(nums) {
  const labels = nums
    .map(n => numToLabel(n))
    .filter(Boolean);

  if (labels.length === 0) return { signal: "Unknown", small: 0, big: 0 };

  const small = labels.filter(l => l === "Small").length;
  const big = labels.filter(l => l === "Big").length;

  // simple anti-streak tweak
  const last = labels[labels.length - 1];
  const secondLast = labels[labels.length - 2];
  let scoreSmall = small;
  let scoreBig = big;
  if (last && secondLast && last === secondLast) {
    if (last === "Small") scoreSmall *= 0.8;
    if (last === "Big") scoreBig *= 0.8;
  }

  const signal = scoreSmall >= scoreBig ? "Small" : "Big";
  return { signal, small, big };
}

module.exports = { numToLabel, predictNext };
