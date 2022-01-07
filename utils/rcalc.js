const R = require("r-integration");

const rcalc = (data) => {
  let result = R.callMethod("./rscript.R", "x", data);
  console.log(result);
  return result;
};

module.exports = { rcalc };