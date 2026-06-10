const { body } = require("express-validator");

// CREATE
const createSwapValidator = [
    body("requesterUser")
        .notEmpty().withMessage("Requester user obbligatorio")
        .bail()
        .isMongoId().withMessage("Requester user non valido"),

    body("receiverUser")
        .notEmpty().withMessage("Receiver user obbligatorio")
        .bail()
        .isMongoId().withMessage("Receiver user non valido"),

    body("requesterProduct")
        .notEmpty().withMessage("Requester product obbligatorio")
        .bail()
        .isMongoId().withMessage("Requester product non valido"),

    body("receiverProduct")
        .notEmpty().withMessage("Receiver product obbligatorio")
        .bail()
        .isMongoId().withMessage("Receiver product non valido"),
];

// BUSINESS RULES CREATE
const createSwapBusinessValidator = [
    body().custom((value) => {

        if (value.requesterUser === value.receiverUser) {
            throw new Error("Gli utenti devono essere diversi");
        }

        if (value.requesterProduct === value.receiverProduct) {
            throw new Error("I prodotti devono essere diversi");
        }

        return true;
    })
];

// UPDATE
const updateSwapValidator = [
    body().custom((value) => {

        if (!value || Object.keys(value).length === 0) {
            throw new Error("Nessun dato da aggiornare");
        }

        const allowedFields = [
            "receiverUser",
            "requesterProduct",
            "receiverProduct"
        ];

        const keys = Object.keys(value);

        const isValid = keys.every(k => allowedFields.includes(k));

        if (!isValid) {
            throw new Error("Campo non modificabile");
        }

        return true;
    }),

    body("receiverUser")
        .optional()
        .isMongoId()
        .withMessage("Receiver user non valido"),

    body("requesterProduct")
        .optional()
        .isMongoId()
        .withMessage("Requester product non valido"),

    body("receiverProduct")
        .optional()
        .isMongoId()
        .withMessage("Receiver product non valido")
];

module.exports = {
    createSwapValidator,
    createSwapBusinessValidator,
    updateSwapValidator
};