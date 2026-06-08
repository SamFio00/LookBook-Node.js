const express = require("express");
const router = express.Router();
const { createProductValidator, updateProductValidator } = require("../middlewares/validators/product.validator");
const validateRequest = require("../middlewares/validateRequest.middleware");
const multer = require("multer");
const AppError = require("../utils/AppError");
const validateObjectId = require("../middlewares/validateObjectId.middleware");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError("Sono consentite solo immagini (JPG, PNG, WEBP)", 400), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

const uploadImages = (req, res, next) => {
    upload.array("images", 5)(req, res, (err) => {

        if (err) {

            if (err.code === "LIMIT_FILE_SIZE") {
                return next(new AppError("File troppo grande (max 5MB)", 400));
            }

            return next(new AppError(err.message, 400));
        }

        next();
    });
};

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
        uploadImages,
        createProductValidator,
        validateRequest,
        createProduct
    );

router.route("/:id")
    .get(validateObjectId, getProductById)
    .put(validateObjectId, updateProductValidator, validateRequest, updateProduct) 
    .delete(validateObjectId, deleteProduct); 

router.patch("/:id/add-image", uploadImages, validateObjectId, addProductImage);
router.patch("/:id/remove-image", validateObjectId, removeProductImage);


module.exports = router;