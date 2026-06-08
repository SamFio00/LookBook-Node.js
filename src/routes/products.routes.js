const express = require("express");
const router = express.Router();
const { createProductValidator, updateProductValidator } = require("../middlewares/validators/product.validator");
const validateRequest = require("../middlewares/validateRequest.middleware");
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
    .post(
        upload.array("images", 5),
        createProductValidator,
        validateRequest,
        createProduct
    );

router.route("/:id")
    .get(validateObjectId, getProductById)
    .put(validateObjectId, updateProductValidator, validateRequest, updateProduct) 
    .delete(validateObjectId, deleteProduct); 

router.patch("/:id/add-image", upload.array("images", 5), validateObjectId, addProductImage);
router.patch("/:id/remove-image", validateObjectId, removeProductImage);


module.exports = router;