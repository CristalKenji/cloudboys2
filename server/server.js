// Importing required modules
const cors = require('cors');
const express = require('express');
// parse env variables
require('dotenv').config();

const watchdog = require("./services/watchdog");




// Configuring port
const port = process.env.PORT || 9000;

const app = express();

// Configure middlewares
app.use(cors());
app.use(express.json());

// Defining route middleware
app.use('/api', require('./routes/api'));
app.use("/container", require("./routes/container"));
app.use("/user", require("./routes/user"));

watchdog.autoRefreshInfoLog();


// Listening to port
app.listen(port);
console.log(`Listening On http://localhost:${port}/api`);

module.exports = app;
