const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment-timezone");

const getEarnings = async (ticker) => {
  const { data } = await axios.get(
    `https://finance.yahoo.com/calendar/earnings?symbol=${ticker}`
  );

  selector = await cheerio.load(data);

  var rows = [];

  // date
  selector("tr.simpTblRow > td:nth-child(3)").each(function (i, elm) {
    var date = selector(this).text().substring(0, 12);

    date = moment(date, "MMM D, YYYY");

    rows.push({ EPSReportDate: moment(date).format("YYYY-MM-DD") });
  });

  // estimate
  selector("tr.simpTblRow > td:nth-child(4)").each(function (i, elm) {
    rows[i]["consensusEPS"] = selector(this).text();
  });

  // actual
  selector("tr.simpTblRow > td:nth-child(5)").each(function (i, elm) {
    var actual = selector(this).text();
    if (actual == "-") {
      rows[i]["actualEPS"] = null;
    } else {
      rows[i]["actualEPS"] = actual;
    }
  });

  return rows;
};

module.exports = { getEarnings };
