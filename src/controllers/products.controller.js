const Product = require("../models/product.model");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const fs = require("fs");

const Swap = require("../models/swap.model");

// GET
const getProducts = asyncHandler(async (req, res) => {

        const products = await Product.find();

        res.status(200).json({
            message: "Lista prodotti",
            results: products.length,
            data: products
        });
});

// POST (create product with images via multer)
const createProduct = asyncHandler(async (req, res, next) => {

        const { name } = req.body;

        if (!req.files || req.files.length === 0) {
            return next(new AppError("Devi caricare almeno un'immagine", 400));
        }

        const images = req.files.map(file => file.path);

        const newProduct = await Product.create({
            name,
            images
        });

        res.status(201).json({
            message: "Prodotto inserito",
            data: newProduct
        });

});

// GET by id
const getProductById = asyncHandler(async (req, res, next) => {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new AppError("Prodotto non trovato", 404));
        }

        res.status(200).json({
            message: "Prodotto trovato",
            data: product
        });
});

// PUT (update solo del nome)
const updateProduct = asyncHandler(async (req, res, next) => {

        const { name } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return next(new AppError("Prodotto non trovato", 404));
        }

        res.status(200).json({
            message: "Prodotto aggiornato",
            data: updatedProduct
        });
});

// PATCH (add images via multer)
const addProductImage = asyncHandler(async (req, res, next) => {

        if (!req.files || req.files.length === 0) {
            return next(new AppError("Devi caricare almeno un'immagine", 400));
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new AppError("Prodotto non trovato", 404));
        }

        const newImages = req.files.map(file => file.path);

        product.images.push(...newImages);

        await product.save();

        res.status(200).json({
            message: "Immagini aggiunte",
            data: product
        });
});

// PATCH (remove image)
const removeProductImage = asyncHandler(async (req, res, next) => {

        const { image } = req.body;

        if (!image) {
            return next(new AppError("Immagine obbligatoria", 400));
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new AppError("Prodotto non trovato", 404));
        }

        if (!product.images.includes(image)) {
            return next(new AppError("Immagine non trovata", 404));
        }

        fs.unlink(image, (err) => {
            if (err) {
                console.error(err.message);
            }
        });

        const filteredImages = product.images.filter(img => img !== image);

        product.images = filteredImages;

        await product.save();

        res.status(200).json({
            message: "Immagine rimossa",
            data: product
        });
});

// DELETE
const deleteProduct = asyncHandler(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new AppError("Prodotto non trovato", 404));
    }

    // elimina immagini dal filesystem
    product.images.forEach((imagePath) => {
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    });

    await Swap.deleteMany({
        $or: [
            { requesterProduct: product._id },
            { receiverProduct: product._id }
        ]
    });

    await Product.findByIdAndDelete(product._id);

    res.status(200).json({
        message: "Prodotto eliminato",
        data: product
    });
});

module.exports = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    addProductImage,
    removeProductImage,
    deleteProduct
};