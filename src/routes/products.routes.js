const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

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
    .post(upload.array("images", 5), createProduct);

router.route("/:id")
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);

router.patch("/:id/add-image", upload.array("images", 5), addProductImage);
router.patch("/:id/remove-image", removeProductImage);


module.exports = router;