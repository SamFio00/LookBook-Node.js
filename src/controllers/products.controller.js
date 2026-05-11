const products = require("../data/products.data");
const getProducts = (req, res) => {
    res.json({
        message: "Lista prodotti",
        results: products.length,
        data: products
    });
};

// POST
const createProduct = (req, res) => {
    const { name, images } = req.body;

    if (!name || !Array.isArray(images)) {
        return res.status(400).json({
            message: "Tutti i campi sono obbligatori"
        });
    }

    const newProduct = {
        id: products.length + 1,
        name,
        images
    };

    products.push(newProduct);

    res.status(201).json({
        message: "Prodotto inserito",
        data: newProduct
    });
};

// GET by id
const getProductById = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "ID prodotto non valido"
        });
    }

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Prodotto non trovato"
        });
    }

    res.json({
        message: "Prodotto trovato",
        data: product
    });
};

// PUT
const updateProduct = (req, res) => {
    const id = parseInt(req.params.id);

    const { name, images } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({
            message: "ID prodotto non valido"
        });
    }

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Prodotto non trovato"
        });
    }

    if (images && !Array.isArray(images)) {
        return res.status(400).json({
            message: "Images deve essere un array"
        });
    }

    if (name) product.name = name;
    if (images) product.images = images;

    res.json({
        message: "Prodotto aggiornato",
        data: product
    });
};

// DELETE
const deleteProduct = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "ID prodotto non valido"
        });
    }

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Prodotto non trovato"
        });
    }

    const deletedProduct = products.splice(index, 1);

    res.json({
        message: "Prodotto eliminato",
        data: deletedProduct[0]
    });
};

module.exports = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
};