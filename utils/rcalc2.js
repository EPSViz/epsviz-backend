var R = require("r-script");

const rcalc2 = async (earnings, trends, callback) => {
  R("/usr/src/app/utils/rscript2.R")
    .data({ earnings: earnings, trends: trends })
    .call(function (error, result) {
      if (error) {
        console.error("ex-async throws error", error.toString());
        return callback(err, null);
      }
      console.error("ex-async success result", result);
      return callback(null, result);
    });
};

module.exports = { rcalc2 };
