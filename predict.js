function numToLabel(n) {
  return n <= 4 ? "Small" : "Big";
}

function predict(nums) {
  let labels = nums.map(n => numToLabel(parseInt(n)));
  let smallCount = labels.filter(x => x === "Small").length;
  let bigCount = labels.filter(x => x === "Big").length;

  let probSmall = smallCount / labels.length;
  let probBig = bigCount / labels.length;

  let pred = probSmall > probBig ? "Small" : "Big";
  let confidence = Math.max(probSmall, probBig);

  return { pred, confidence };
}

module.exports = { predict };
