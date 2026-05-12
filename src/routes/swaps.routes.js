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

// GET
router.get("/", getSwaps);

// POST
router.post("/", createSwap);

// GET by id
router.get("/:id", getSwapById);

// DELETE
router.delete("/:id", deleteSwap);

// PATCH
router.patch("/:id/accept", acceptSwap);
router.patch("/:id/reject", rejectSwap);

module.exports = router;