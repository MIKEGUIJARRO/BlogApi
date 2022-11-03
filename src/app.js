// Config
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require("dotenv");
const express = require('express');
const cors = require('cors')

const { router: serverRoutes } = require('./api/server');
const errorHandler = require('./api/middleware/error');

dotenv.config({ path: "./config/config.env" });

// App architecture
const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(cors());

app.use('/api/v1/', serverRoutes);

app.use(errorHandler);

module.exports = { app }