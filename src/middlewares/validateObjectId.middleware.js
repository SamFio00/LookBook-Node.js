const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

const validateObjectId = (req, res, next) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new AppError("ID non valido", 400));
    }

    next();
};

module.exports = validateObjectId;