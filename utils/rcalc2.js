const { getVectorData } = require("./getVectorData.js");

const monthAbbreviations = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const convertMonthToNumber = (month) => {
  return monthAbbreviations.indexOf(month.slice(0, 3)) + 1;
};

const rcalc2 = (earnings, trends) => {
  const vectorData = getVectorData(earnings);

  const dfTrends = trends["default"]["timelineData"];
  console.log("vd", vectorData);
  const predictionMonth = new Date(vectorData[3]);
  console.log("predictionMonth", predictionMonth);
  const predictionMonthInt = predictionMonth.getMonth() + 1;
  let sentimentMonth;
  if (predictionMonthInt === 1) {
    sentimentMonth = 12;
  } else {
    sentimentMonth = predictionMonthInt - 1;
  }
  let currRow = -10;
  let currMonthInt = -10;
  for (let i = dfTrends.length - 1; i >= 0; i--) {
    console.log("dftrends[i]", dfTrends[i]);
    const currMonth = dfTrends[i]["formattedAxisTime"].substring(0, 3);
    currMonthInt = convertMonthToNumber(currMonth);
    console.log("currMonthInt", currMonthInt);
    console.log("sentimentMonth", sentimentMonth);
    if (sentimentMonth === currMonthInt) {
      currRow = i;
      break;
    }
  }
  let totalSentiment = 0;
  let counter = 0;
  while (counter < 2) {
    totalSentiment += parseInt(dfTrends[currRow][5]);
    currRow--;
    const currMonth2 = dfTrends[currRow]["formattedAxisTime"].substring(0, 3);
    const currMonth2Int = convertMonthToNumber(currMonth2);
    if (currMonthInt !== currMonth2Int) {
      counter++;
    }
    currMonthInt = currMonth2Int;
  }
  return totalSentiment;
};
module.exports = { rcalc2 };
