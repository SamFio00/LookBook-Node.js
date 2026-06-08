const { body } = require("express-validator");

const createProductValidator = [
    body("name")
        .notEmpty()
        .withMessage("Nome obbligatorio")
        .isString()
        .withMessage("Nome deve essere una stringa")
        .trim()
];

const updateProductValidator = [
    body("name")
        .optional()
        .isString()
        .withMessage("Nome deve essere una stringa")
        .trim()
];

module.exports = {
    createProductValidator,
    updateProductValidator
};