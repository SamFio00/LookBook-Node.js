const AppError = require("../utils/AppError");

const notFoundMiddleware = (req, res, next) => {
    next(new AppError("Route non trovata", 404));
};

module.exports = notFoundMiddleware;