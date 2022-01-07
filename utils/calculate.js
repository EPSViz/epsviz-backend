const R = require("r-integration");

const calculate = (ticker, keyword) => {
  let result = R.executeRCommand("max(1,2,3,4)");
  console.log(result);
  return result;
};

module.exports = { calculate };
