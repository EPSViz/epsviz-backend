function linearRegression(earnings, trends) {
  // Prepare data
  let x = earnings.map((e) => e.date);
  let y = earnings.map((e) => e.EPS);
  let n = x.length;

  // Calculate coefficients
  let xMean = mean(x);
  let yMean = mean(y);
  let xDiff = x.map((xi) => xi - xMean);
  let yDiff = y.map((yi) => yi - yMean);
  let xyDiff = xDiff.map((xi, i) => xi * yDiff[i]);
  let xDiffSquared = xDiff.map((xi) => xi * xi);
  let b1 = sum(xyDiff) / sum(xDiffSquared);
  let b0 = yMean - b1 * xMean;

  // Predict next earnings
  let predict = b0 + b1 * trends.date;

  // Calculate prediction interval
  let yPred = x.map((xi) => b0 + b1 * xi);
  let yDiffPred = y.map((yi, i) => yi - yPred[i]);
  let yDiffPredSquared = yDiffPred.map((yi) => yi * yi);
  let se = Math.sqrt(sum(yDiffPredSquared) / (n - 2));
  let delta = 2 * se;
  let lower = predict - delta;
  let upper = predict + delta;

  // Return prediction interval
  return [predict, lower, upper];
}

// Utility functions
function mean(arr) {
  return sum(arr) / arr.length;
}

function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

const rcalc3 = (earnings, trends) => {
  const predict = {};
  const resp = linearRegression(earnings, trends);
  predict.nextDate = resp[0];
  predict.consensusEPS = resp[1];
  predict.lower = resp[2];
  predict.fit = resp[3];
  predict.upper = resp[4];
  predict.p = resp[5];
  predict.r2 = resp[6];
  return predict;
};

module.exports = { rcalc3 };
