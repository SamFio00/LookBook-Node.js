const { body } = require("express-validator");

const createSwapValidator = [
    body("requesterUser")
        .notEmpty()
        .withMessage("Requester user obbligatorio")
        .isMongoId()
        .withMessage("Requester user non valido"),

    body("receiverUser")
        .notEmpty()
        .withMessage("Receiver user obbligatorio")
        .isMongoId()
        .withMessage("Receiver user non valido"),

    body("requesterProduct")
        .notEmpty()
        .withMessage("Requester product obbligatorio")
        .isMongoId()
        .withMessage("Requester product non valido"),

    body("receiverProduct")
        .notEmpty()
        .withMessage("Receiver product obbligatorio")
        .isMongoId()
        .withMessage("Receiver product non valido")
];

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

module.exports = {
    createSwapValidator,
    createSwapBusinessValidator
};