const { body } = require("express-validator");

const createProductValidator = [
    body("name")
        .notEmpty()
        .withMessage("Nome obbligatorio")
        .bail()
        .isString()
        .withMessage("Nome deve essere una stringa")
        .bail()
        .trim()
        .isLength({ min: 2 })
        .withMessage("Nome troppo corto")
];

const updateProductValidator = [
    body("name")
        .optional()
        .isString()
        .withMessage("Nome deve essere una stringa")
        .bail()
        .trim()
        .isLength({ min: 2 })
        .withMessage("Nome troppo corto")
];

module.exports = {
    createProductValidator,
    updateProductValidator
};