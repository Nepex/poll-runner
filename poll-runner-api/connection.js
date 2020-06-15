const Pool = require('pg').Pool

module.exports = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'poll-runner',
  password: 'root',
  port: 5432,
});