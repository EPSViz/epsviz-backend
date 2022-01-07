require("dotenv").config();
const { dirname } = require("path");

const TORGUARD = process.env.TORGUARD || "torguard:torguard";

const DB_TYPE = process.env.DB_TYPE || "postgres";
const DB_CONNECTION =
  process.env.DB_CONNECTION ||
  "postgres://shield:shieldfarm@localhost:5432/shieldfarm";

const PORT = process.env.PORT || 3000;
const REDIS_URL = process.env.REDIS_URL || "redis://shield-cache:6379";

module.exports = {
  DB_TYPE,
  DB_CONNECTION,
  PORT,
  REDIS_URL,
};
