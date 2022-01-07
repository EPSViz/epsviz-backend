const express = require("express");
const cors = require("cors");
const { createClient } = require("redis");
const cron = require("node-cron");
const { getTrends } = require("./apis/getTrends");
const { getEarnings } = require("./apis/getEarnings");
const { calculate } = require("./utils/calculate");
const { rcalc } = require("./utils/rcalc");
var R = require("r-script");

const { PORT, DB_TYPE, DB_CONNECTION, REDIS_URL } = require("./constants");
const { dbInit } = require("./db/dbInit");

const app = express();

const client = createClient({ url: REDIS_URL });

app.use(express.json());

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(
  cors({
    origin: "*",
  })
);

client.connect().then(() => {
  app.get("/", (req, res) => {
    res.send("Welcome to EPSViz API!");
  });
  app.get("/test", async (req, res) => {
    res.send(JSON.stringify(await getEarnings("AAPL")));
  });

  app.get("/trends/:keyword", async (req, res) => {
    const trends = await getTrends(req.params.keyword);
    res.send(trends);
  });

  app.get("/companies/:ticker", async (req, res) => {
    const companyEarnings = await getEarnings(req.params.ticker);
    res.send(companyEarnings);
  });

  app.get("/api/:ticker/:keyword", async (req, res) => {
    const companyEarnings = await getEarnings(req.params.ticker);
    const trends = await getTrends(req.params.keyword);

    rcalc(companyEarnings, trends, function (error, result) {
      if (error) {
        return res.status(500).send(error);
      }
      return res.status(200).send(result);
    });

    // // divide trends to match company earnings

    // const response = {
    //   earnings: companyEarnings,
    //   trends: trends,
    // };

    // res.send(response);
  });

  app.listen(PORT, () => {
    dbInit(async function (newInit) {
      console.log("Done initialising DB");
      console.log(`EPSViz listening at http://localhost:${PORT}`);

      // cron.schedule("*/10 * * * *", () => {
      //   try {
      //     updateEarnings();
      //   } catch (err) {
      //     console.log(err);
      //   }
      // });
    });
  });
});
