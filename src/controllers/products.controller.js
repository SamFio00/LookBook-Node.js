const mongoose = require("mongoose");
const Product = require("../models/product.model");

// GET
const getProducts = async (req, res) => {

    try {

        const products = await Product.find();

        res.status(200).json({
            message: "Lista prodotti",
            results: products.length,
            data: products
        });
    } catch (error) {

        res.status(500).json({
            message: "Errore interno del server",
            error: error.message
        });
    }
}

// POST
const createProduct = async (req, res) => {

    try {

        const { name, images } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Nome obbligatorio"
            });
        }

        if (!images) {
            return res.status(400).json({
                message: "Images obbligatorie"
            });
        }

        if (!Array.isArray(images)) {
            return res.status(400).json({
                message: "Images deve essere un array"
            });
        }

        if (images.length === 0) {
            return res.status(400).json({
                message: "Devi inserire almeno un'immagine"
            });
        }

        const newProduct = await Product.create({
            name,
            images
        });

        res.status(201).json({
            message: "Prodotto inserito",
            data: newProduct
        });

    } catch (error) {

        res.status(500).json({
            message: "Errore server",
            error: error.message
        });
    }
};

// GET by id
const getProductById = async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "ID prodotto non valido"
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Prodotto non trovato"
            });
        }

        res.status(200).json({
            message: "Prodotto trovato",
            data: product
        });

    } catch (error) {

        res.status(500).json({
            message: "Errore server",
            error: error.message
        });
    }
};


// PUT
const updateProduct = async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "ID prodotto non valido"
            });
        }

        const { name, images } = req.body;

        const updateData = {};

        if (name) updateData.name = name;

        if (images) {
            if (!Array.isArray(images)) {
                return res.status(400).json({
                    message: "Images deve essere un array"
                });
            }
            updateData.images = images;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Prodotto non trovato"
            });
        }

        res.status(200).json({
            message: "Prodotto aggiornato",
            data: updatedProduct
        });

    } catch (error) {

        res.status(500).json({
            message: "Errore server",
            error: error.message
        });
    }
};

// PATCH (add image)
const addProductImage = async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "ID prodotto non valido"
            });
        }

        const { image } = req.body;

        if (!image) {
            return res.status(400).json({
                message: "Image obbligatoria"
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Prodotto non trovato"
            });
        }

        product.images.push(image);

        await product.save();

        res.status(200).json({
            message: "Immagine aggiunta",
            data: product
        });

    } catch (error) {

        res.status(500).json({
            message: "Errore server",
            error: error.message
        });
    }
};

// PATCH (remove image)
const removeProductImage = async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "ID prodotto non valido"
            });
        }

        const { image } = req.body;

        if (!image) {
            return res.status(400).json({
                message: "Image obbligatoria"
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Prodotto non trovato"
            });
        }

        const initialLength = product.images.length;

        product.images = product.images.filter(img => img !== image);

        if (product.images.length === initialLength) {
            return res.status(404).json({
                message: "Immagine non trovata"
            });
        }

        await product.save();

        res.status(200).json({
            message: "Immagine rimossa",
            data: product
        });

    } catch (error) {

        res.status(500).json({
            message: "Errore server",
            error: error.message
        });
    }
};

// DELETE
const deleteProduct = async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "ID prodotto non valido"
            });
        }

        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Prodotto non trovato"
            });
        }

        res.status(200).json({
            message: "Prodotto eliminato",
            data: deletedProduct
        });

    } catch (error) {

        res.status(500).json({
            message: "Errore server",
            error: error.message
        });
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