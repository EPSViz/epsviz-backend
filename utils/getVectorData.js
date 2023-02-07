function getVectorData(earnings) {
  let dfNrows = earnings.length;
  console.log("dfNrows", dfNrows);
  for (let i = 1; i < dfNrows - 1; i++) {
    if (earnings[i]["consensusEPS"]) {
      console.log("earnings", earnings[i]);
      let cutoffDate = earnings[i]["EPSReportDate"];
      let noQuarters = dfNrows - i + 2;
      let consensusAtPredictQuarter = earnings[i - 1]["consensusEPS"];
      let predictionDate = earnings[i - 1]["EPSReportDate"];
      return [
        cutoffDate,
        noQuarters,
        consensusAtPredictQuarter,
        predictionDate,
        i,
      ];
    }
  }
  return "error";
}

module.exports = { getVectorData };
