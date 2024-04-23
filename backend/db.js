const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "2121",
  host: "172.27.208.1",
  port: 5432, // default Postgres port
  database: "postgres",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
