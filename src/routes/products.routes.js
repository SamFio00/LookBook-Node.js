
const express = require("express");
const router = express.Router();

const { 
    getProducts, 
    createProduct, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} = require("../controllers/products.controller");

// GET
router.get("/", getProducts);

// POST
router.post("/", createProduct);

// GET by id
router.get("/:id", getProductById);

// PUT
router.put("/:id", updateProduct);

// DELETE
router.delete("/:id", deleteProduct);

module.exports = router;