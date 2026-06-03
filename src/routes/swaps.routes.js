const express = require("express");
const router = express.Router();
const validateObjectId = require("../middlewares/validateObjectId.middleware");

const { 
    getSwaps, 
    createSwap, 
    getSwapById,
    deleteSwap,
    acceptSwap, 
    rejectSwap 
} = require("../controllers/swaps.controller");

router.route("/")
    .get(getSwaps)
    .post(createSwap);

router.route("/:id")
    .get(validateObjectId, getSwapById)
    .delete(validateObjectId, deleteSwap);

router.patch("/:id/accept", validateObjectId, acceptSwap);
router.patch("/:id/reject", validateObjectId, rejectSwap);

module.exports = router;