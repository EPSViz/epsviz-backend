const { DB_CONNECTION } = require("../constants");

var knex;

knex = require("knex")({
  client: "pg",
  connection: DB_CONNECTION,
});

module.exports = { knex };
