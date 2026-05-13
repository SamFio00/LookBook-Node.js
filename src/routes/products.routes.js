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

router.route("/")
    .get(getProducts)
    .post(createProduct);

router.route("/:id")
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);

router.patch("/:id/add-image", addProductImage);
router.patch("/:id/remove-image", removeProductImage);


module.exports = router;