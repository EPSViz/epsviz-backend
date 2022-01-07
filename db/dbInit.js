const { knex } = require("./dbLoad");

const dbInit = async (_callback) => {
  // Create a table
  knex.schema
    .createTable("earnings", (table) => {
      table.string("ticker");
      table.string("EPSReportDate");
      table.float("consensusEPS");
      table.float("actualEPS");
      table.integer("lastUpdated");
      table.primary(["ticker", "EPSReportDate"]);
    })
    .then(() => {
      console.log("Done creating tables");

      _callback(true);
    })
    .catch((err) => {
      console.log(err);
      console.log("DB exists, skipping initialization");

      _callback(false);
    });
};

module.exports = { dbInit };
