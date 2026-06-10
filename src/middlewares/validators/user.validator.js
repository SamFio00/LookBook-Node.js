const { body } = require("express-validator");

const createUserValidator = [
    body("name")
        .notEmpty().withMessage("Il nome è obbligatorio")
        .bail()
        .isString().withMessage("Il nome deve essere una stringa")
        .bail()
        .trim()
        .isLength({ min: 2 })
        .withMessage("Nome troppo corto"),

    body("surname")
        .notEmpty().withMessage("Il cognome è obbligatorio")
        .bail()
        .isString().withMessage("Il cognome deve essere una stringa")
        .bail()
        .trim()
        .isLength({ min: 2 })
        .withMessage("Cognome troppo corto"),

    body("email")
        .notEmpty().withMessage("L'email è obbligatoria")
        .bail()
        .isEmail().withMessage("Email non valida")
        .bail()
        .normalizeEmail()
];

const updateUserValidator = [
    body("name")
        .optional()
        .isString().withMessage("Il nome deve essere una stringa")
        .bail()
        .trim()
        .notEmpty().withMessage("Il nome non può essere vuoto")
        .bail()
        .isLength({ min: 2 })
        .withMessage("Nome troppo corto"),

    body("surname")
        .optional()
        .isString().withMessage("Il cognome deve essere una stringa")
        .bail()
        .trim()
        .notEmpty().withMessage("Il cognome non può essere vuoto")
        .bail()
        .isLength({ min: 2 })
        .withMessage("Cognome troppo corto"),

    body("email")
        .optional()
        .isEmail().withMessage("Email non valida")
        .bail()
        .normalizeEmail()
];

module.exports = {
    createUserValidator,
    updateUserValidator
};