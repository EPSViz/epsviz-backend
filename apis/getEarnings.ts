import axios from "axios";
import cheerio from "cheerio";
import moment from "moment-timezone";

async function getEarnings(ticker: string) {
  const now = Math.round(Date.now() / 1000);

  const { data } = await axios.get(
    `https://finance.yahoo.com/calendar/earnings?symbol=${ticker}
`
  );

  const selector = cheerio.load(data);

  const rows: any[] = [];

  selector("tr.simpTblRow > td:nth-child(3)").each(function (
    i: number,
    elm: any
  ) {
    let date = selector(this).text().substring(0, 12);
    const newdate = moment(date, "MMM D, YYYY");

    rows.push({ EPSReportDate: moment(newdate).format("YYYY-MM-DD") });
  });

  selector("tr.simpTblRow > td:nth-child(4)").each(function (
    i: number,
    elm: any
  ) {
    const consensus = selector(this).text();
    if (consensus === "-") {
      rows[i]["consensusEPS"] = null;
    } else {
      rows[i]["consensusEPS"] = consensus;
    }
  });

  selector("tr.simpTblRow > td:nth-child(5)").each(function (
    i: number,
    elm: any
  ) {
    const actual = selector(this).text();
    if (actual === "-") {
      rows[i]["actualEPS"] = null;
    } else {
      rows[i]["actualEPS"] = actual;
    }
  });

  return rows;
}

export { getEarnings };
