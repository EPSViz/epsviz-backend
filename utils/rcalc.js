const { getVectorData } = require("./getVectorData.js");

const rcalc = (earnings, trends) => {
  if (earnings.length <= 5) {
    return false;
  }
  const vectorData = getVectorData(earnings);

  console.log("trends", trends);
  console.log("vectorData", vectorData);
  const dfTrends = trends["default"]["timelineData"];
  const trendsNrows = dfTrends.length;
  const latestTrendDate = dfTrends[trendsNrows - 1][2];
  const predictionDate = vectorData[3];

  if (vectorData[2] === "-") {
    return false;
  } else if (
    Math.floor(
      (new Date(latestTrendDate) - new Date(predictionDate)) /
        (1000 * 60 * 60 * 24)
    ) >= 30
  ) {
    return false;
  } else {
    return true;
  }
};

module.exports = { rcalc };
