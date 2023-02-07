import express, { Express, Request, Response } from "express";
import cors from "cors";
import cron from "node-cron";
import { processData } from "./utils/predict";
import { getTrends } from "./apis/getTrends";
import { getEarnings } from "./apis/getEarnings";
// import { rcalc } from "./utils/rcalc";
// import { rcalc2 } from "./utils/rcalc2";
// import { rcalc3 } from "./utils/rcalc3";
// import { PORT, DB_TYPE, DB_CONNECTION, REDIS_URL } from "./constants";
// import { dbInit } from "./db/dbInit";

const PORT = 3000;

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));

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

  if (trends === null) {
    return res.send("No trends data");
  }
  const output = processData(companyEarnings, trends.default.timelineData);

  return res.send(output);
});

app.listen(PORT, () => {
  // dbInit(async function () {
  console.log("Done initialising DB");
  console.log(`EPSViz listening at http://localhost:${PORT}`);
  // });
});
