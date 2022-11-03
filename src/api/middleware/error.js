const ErrorResponse = require('../../util/ErrorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    
    res.status(err.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error"
    });
}

module.exports = errorHandler;