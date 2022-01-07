const express = require("express");
const cors = require("cors");
const { createClient } = require("redis");
const cron = require("node-cron");
const { getTrends } = require("./apis/getTrends");
const { getEarnings } = require("./apis/getEarnings");
const { calculate } = require("./utils/calculate");

const { PORT, DB_TYPE, DB_CONNECTION, REDIS_URL } = require("./constants");

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
    res.send("Welcome to shield-farm API!");
  });
  app.get("/test", (req, res) => {
    res.send(calculate("AAPL", ""));
  });
  app.listen(PORT, () => {
    console.log(`EPSViz listening at http://localhost:${PORT}`);
    cron.schedule("*/10 * * * *", () => {
      try {
        updateEarnings();
      } catch (err) {
        console.log(err);
      }
    });
  });

  app.get("/:keyword", async (req, res) => {
    const trends = await getTrends(req.params.keyword);
    res.send(trends);
  });

  app.get("/:ticker/:keyword", async (req, res) => {
    const companyEarnings = await getEarnings(req.params.ticker);
    const trends = await getTrends(req.params.keyword);

    // divide trends to match company earnings

    const response = {
      earnings: companyEarnings,
      trends: trends,
    };

    res.send(response);
  });

  app.get("/companies/:ticker", async (req, res) => {
    const companyEarnings = await getEarnings(req.params.ticker);
    res.send(companyEarnings);
  });
});
