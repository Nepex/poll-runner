const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000

const server = require('http').Server(app);

server.listen(port, () => {
  console.log(`App running on port ${port}.`);
})

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// set headers
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, cache-control, expires, pragma");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");

  next();
});

// register routes
require('./api/controllers/routes')(app);
