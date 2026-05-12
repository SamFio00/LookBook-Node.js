const express = require("express");
const router = express.Router();

const { 
    getProducts, 
    createProduct, 
    getProductById, 
    updateProduct,
    addProductImage,
    removeProductImage, 
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

// PATCH (add image)
router.patch("/:id/add-image", addProductImage);

// PATCH (remove image)
router.patch("/:id/remove-image", removeProductImage);

// DELETE
router.delete("/:id", deleteProduct);

module.exports = router;