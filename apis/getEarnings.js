const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment-timezone");
// const { knex } = require("../db/dbLoad");

const getEarnings = async (ticker) => {
  const now = Math.round(Date.now() / 1000);

  // var storedEarnings = await knex("earnings")
  //   .where("ticker", ticker)
  //   .andWhere("lastUpdated", ">", now - 60 * 60 * 24);

  // if (storedEarnings.length == 0) {
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
    var consensus = selector(this).text();

    if (consensus == "-") {
      rows[i]["consensusEPS"] = null;
    } else {
      rows[i]["consensusEPS"] = consensus;
    }
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

  // for (var i = 0; i < rows.length; i++) {
  //   rows[i]["ticker"] = ticker;
  //   rows[i]["lastUpdated"] = now;

  //   console.log(rows[i]);

  //   await knex("earnings")
  //     .insert(rows[i])
  //     .onConflict(["EPSReportDate", "ticker"])
  //     .merge();
  // }
  // } else {
  //   rows = storedEarnings;
  // }

  return rows;
};

module.exports = { getEarnings };
