var R = require("r-script");

const rcalc = async (earnings, trends, callback) => {
  R("/usr/src/app/utils/rscript.R")
    .data({ earnings: earnings, trends: trends })
    .call(function (error, result) {
      if (error) {
        console.error("ex-async throws error", error);
        return callback(err, null);
      }
      console.error("ex-async success result", result);
      return callback(null, result);
    });
};

module.exports = { rcalc };
