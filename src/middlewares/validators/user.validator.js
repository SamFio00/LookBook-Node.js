const { body } = require("express-validator");

const createUserValidator = [
    body("name")
        .notEmpty().withMessage("Il nome è obbligatorio")
        .isString().withMessage("Il nome deve essere una stringa")
        .trim(),

    body("surname")
        .notEmpty().withMessage("Il cognome è obbligatorio")
        .isString().withMessage("Il cognome deve essere una stringa")
        .trim(),

    body("email")
        .notEmpty().withMessage("L'email è obbligatoria")
        .isEmail().withMessage("Email non valida")
        .normalizeEmail()
];

const updateUserValidator = [
    body("name")
        .optional()
        .isString().withMessage("Il nome deve essere una stringa")
        .trim(),

    body("surname")
        .optional()
        .isString().withMessage("Il cognome deve essere una stringa")
        .trim(),

    body("email")
        .optional()
        .isEmail().withMessage("Email non valida")
        .normalizeEmail()
];

module.exports = {
    createUserValidator,
    updateUserValidator
};