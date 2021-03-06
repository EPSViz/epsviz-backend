const express = require("express");
const cors = require("cors");
// const { createClient } = require("redis");
const cron = require("node-cron");
const { getTrends } = require("./apis/getTrends");
const { getEarnings } = require("./apis/getEarnings");
const { calculate } = require("./utils/calculate");
const { rcalc } = require("./utils/rcalc");
const { rcalc2 } = require("./utils/rcalc2");
const { rcalc3 } = require("./utils/rcalc3");
var R = require("r-script");

const { PORT, DB_TYPE, DB_CONNECTION, REDIS_URL } = require("./constants");
const { dbInit } = require("./db/dbInit");

const app = express();

// const client = createClient({ url: REDIS_URL });

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

// client.connect().then(() => {
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

  // Handle non existent earnings tickers
  if (companyEarnings.length === 0) {
    res.send({ result: "No earnings data found for this ticker" });
  }

  rcalc(companyEarnings, trends, function (error, result) {
    const predictionReady = result;

    rcalc2(companyEarnings, trends, function (error, result) {
      const data = result;

      rcalc3(companyEarnings, trends, function (error, resp) {
        const predict = {};
        const result = resp[0];
        predict.nextDate = result[0];
        predict.consensusEPS = result[1];
        predict.lower = result[2];
        predict.fit = result[3];
        predict.upper = result[4];
        predict.p = result[5];
        predict.r2 = result[6];

        console.log(data);
        console.log(predict);

        return res.send({
          ready: predictionReady,
          data: data,
          predict: predict,
        });
      });
    });

    if (error) {
      console.log(error);
      return res.status(500).send(error);
    } else {
      console.log(result);
    }
    if (error) {
      console.log(error);
    }

    if (result) {
      console.log(result);
    }

    // console.log(result);
    // return res.send(result);
  });

  // // divide trends to match company earnings

  // const response = {
  //   earnings: companyEarnings,
  //   trends: trends,
  // };

  // res.send(response);
});

app.listen(PORT, () => {
  // dbInit(async function (newInit) {
  console.log("Done initialising DB");
  console.log(`EPSViz listening at http://localhost:${PORT}`);

  // cron.schedule("*/10 * * * *", () => {
  //   try {
  //     updateEarnings();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });
  // });
});
// });
