// Config
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require("dotenv");
const express = require('express');
const cors = require('cors')

dotenv.config({ path: "./config/config.env" });

// App architecture
const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(cors());

app.use('/api/v1/', (req, res, next) => {
    res.status(200).json({
        success: true,
        data: {
            route: 'getBlog'
        }
    });
});

module.exports = { app }