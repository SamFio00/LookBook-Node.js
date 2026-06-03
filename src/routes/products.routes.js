const express = require("express");
const router = express.Router();
const multer = require("multer");
const validateObjectId = require("../middlewares/validateObjectId.middleware");

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
    .get(validateObjectId, getProductById)
    .put(validateObjectId, updateProduct)
    .delete(validateObjectId, deleteProduct);

router.patch("/:id/add-image", validateObjectId, upload.array("images", 5), addProductImage);
router.patch("/:id/remove-image", validateObjectId, removeProductImage);


module.exports = router;