const googleTrends = require("google-trends-api");
const HttpsProxyAgent = require("https-proxy-agent");
const moment = require("moment");

const getTrends = async (keyword) => {
  // let proxyAgent = new HttpsProxyAgent("http://proxy.crawlera.com:8010");

  try {
    const trends = await googleTrends.interestOverTime({
      keyword: keyword,
      startTime: moment().subtract(1000, "days").toDate(),
      // agent: proxyAgent,
    });
    return JSON.parse(trends);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getTrends };
