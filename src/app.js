// Config
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require("dotenv");
const express = require('express');
const cors = require('cors');
const path = require('path');
const expressSanitizer = require('express-sanitizer');

const { router: serverRoutes } = require('./api/server');
const errorHandler = require('./api/middleware/error');
const Database = require('./services/Database');

dotenv.config({ path: path.join(__dirname, '/config', '/config.env') });

// App architecture
const app = express();

const db = new Database();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
// All of our requests are intercepted and sanitized
// with this middleware (It avoids script tags inside our html body)
app.use(expressSanitizer());

app.use(cors());

app.use('/api/v1/', serverRoutes);

app.use(errorHandler);

module.exports = { app }