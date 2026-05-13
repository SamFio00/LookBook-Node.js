const express = require("express");
const router = express.Router();

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
    .get(getSwapById)
    .delete(deleteSwap);

router.patch("/:id/accept", acceptSwap);
router.patch("/:id/reject", rejectSwap);

module.exports = router;