const mongoose = require("mongoose");
const Product = require("../models/product.model");
const AppError = require("../utils/AppError");

// GET
const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            message: "Lista prodotti",
            results: products.length,
            data: products
        });

    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

// POST (create product with images via multer)
const createProduct = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            return next(new AppError("Nome obbligatorio", 400));
        }

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

    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

// GET by id
const getProductById = async (req, res, next) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(new AppError("ID prodotto non valido", 400));
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new AppError("Prodotto non trovato", 404));
        }

        res.status(200).json({
            message: "Prodotto trovato",
            data: product
        });

    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

// PUT (update only text fields)
const updateProduct = async (req, res, next) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(new AppError("ID prodotto non valido", 400));
        }

        const { name } = req.body;

        const updateData = {};
        if (name) updateData.name = name;

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return next(new AppError("Prodotto non trovato", 404));
        }

        res.status(200).json({
            message: "Prodotto aggiornato",
            data: updatedProduct
        });

    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

// PATCH (add images via multer)
const addProductImage = async (req, res, next) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(new AppError("ID prodotto non valido", 400));
        }

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

    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

// PATCH (remove image)
const removeProductImage = async (req, res, next) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(new AppError("ID prodotto non valido", 400));
        }

        const { image } = req.body;

        if (!image) {
            return next(new AppError("Immagine obbligatoria", 400));
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new AppError("Prodotto non trovato", 404));
        }

        const filteredImages = product.images.filter(img => img !== image);

        if (filteredImages.length === product.images.length) {
            return next(new AppError("Immagine non trovata", 404));
        }

        product.images = filteredImages;

        await product.save();

        res.status(200).json({
            message: "Immagine rimossa",
            data: product
        });

    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

// DELETE
const deleteProduct = async (req, res, next) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(new AppError("ID prodotto non valido", 400));
        }

        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return next(new AppError("Prodotto non trovato", 404));
        }

        res.status(200).json({
            message: "Prodotto eliminato",
            data: deletedProduct
        });

    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

module.exports = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    addProductImage,
    removeProductImage,
    deleteProduct
};