const express = require("express");
const router = express.Router();

const validateObjectId = require("../middlewares/validateObjectId.middleware");

const {
    createSwapValidator,
    createSwapBusinessValidator,
    updateSwapValidator
} = require("../middlewares/validators/swap.validator");

const validateRequest = require("../middlewares/validateRequest.middleware");

const {
    getSwaps,
    createSwap,
    getSwapById,
    updateSwap,
    deleteSwap,
    acceptSwap,
    rejectSwap
} = require("../controllers/swaps.controller");

router.route("/")
    .get(getSwaps)
    .post(
        createSwapValidator,
        createSwapBusinessValidator,
        validateRequest,
        createSwap
    );

router.route("/:id")
    .get(
        validateObjectId,
        getSwapById
    )
    .put(
        validateObjectId,
        updateSwapValidator,
        validateRequest,
        updateSwap
    )
    .delete(
        validateObjectId,
        deleteSwap
    );

router.patch(
    "/:id/accept",
    validateObjectId,
    acceptSwap
);

router.patch(
    "/:id/reject",
    validateObjectId,
    rejectSwap
);

module.exports = router;