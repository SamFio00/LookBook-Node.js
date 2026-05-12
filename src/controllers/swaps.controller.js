const mongoose = require("mongoose");

const Swap = require("../models/swap.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");

const populateSwap = (query) => {
    return query
        .populate("requesterUser", "name surname email")
        .populate("receiverUser", "name surname email")
        .populate("requesterProduct", "name images")
        .populate("receiverProduct", "name images");
};

// GET ALL SWAPS
const getSwaps = async (req, res) => {

    try {

        const { status, productId, date } = req.query;

        const filters = {};

        if (status) {

            const allowedStatus = [
                "pending",
                "accepted",
                "rejected"
            ];

            if (!allowedStatus.includes(status)) {
                return res.status(400).json({
                    message: "Status non valido"
                });
            }

            filters.status = status;
        }

        if (date) {

            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

            if (!dateRegex.test(date)) {
                return res.status(400).json({
                    message: "Formato data non valido (YYYY-MM-DD)"
                });
            }

            const startDate = new Date(date);
            const endDate = new Date(date);

            endDate.setHours(23, 59, 59, 999);

            filters.createdAt = {
                $gte: startDate,
                $lte: endDate
            };
        }

        if (productId) {

            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({
                    message: "Product ID non valido"
                });
            }

            const productExists = await Product.findById(productId);

            if (!productExists) {
                return res.status(404).json({
                    message: "Prodotto non trovato"
                });
            }

            filters.$or = [
                { requesterProduct: productId },
                { receiverProduct: productId }
            ];
        }

        const swaps = await populateSwap(
            Swap.find(filters)
        );

        res.status(200).json({
            message: "Lista swaps",
            results: swaps.length,
            data: swaps
        });

    } catch (error) {

        res.status(500).json({
            message: "Errore server",
            error: error.message
        });
    }
};

// CREATE SWAP
const createSwap = async (req, res) => {

    try {

        const {
            requesterUser,
            receiverUser,
            requesterProduct,
            receiverProduct
        } = req.body;

        if (
            !requesterUser ||
            !receiverUser ||
            !requesterProduct ||
            !receiverProduct
        ) {
            return res.status(400).json({
                message: "Tutti i campi sono obbligatori"
            });
        }

        if (
            !mongoose.Types.ObjectId.isValid(requesterUser) ||
            !mongoose.Types.ObjectId.isValid(receiverUser) ||
            !mongoose.Types.ObjectId.isValid(requesterProduct) ||
            !mongoose.Types.ObjectId.isValid(receiverProduct)
        ) {
            return res.status(400).json({
                message: "Uno o più ID non validi"
            });
        }

        if (requesterUser === receiverUser) {
            return res.status(400).json({
                message: "Uno user non può fare swap con sé stesso"
            });
        }

        if (requesterProduct === receiverProduct) {
            return res.status(400).json({
                message: "Non puoi scambiare lo stesso prodotto"
            });
        }

        const requesterUserExists = await User.findById(requesterUser);
        const receiverUserExists = await User.findById(receiverUser);

        if (!requesterUserExists || !receiverUserExists) {
            return res.status(404).json({
                message: "Utente non trovato"
            });
        }

        const requesterProductExists = await Product.findById(requesterProduct);
        const receiverProductExists = await Product.findById(receiverProduct);

        if (!requesterProductExists || !receiverProductExists) {
            return res.status(404).json({
                message: "Prodotto non trovato"
            });
        }

        const newSwap = await Swap.create({
            requesterUser,
            receiverUser,
            requesterProduct,
            receiverProduct
        });

        const populatedSwap = await populateSwap(
            Swap.findById(newSwap._id)
        );

        res.status(201).json({
            message: "Swap creato",
            data: populatedSwap
        });

    } catch (error) {

        res.status(500).json({
            message: "Errore server",
            error: error.message
        });
    }
};

// GET SWAP BY ID
const getSwapById = async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "ID swap non valido"
            });
        }

        const swap = await populateSwap(
            Swap.findById(req.params.id)
        );

        if (!swap) {
            return res.status(404).json({
                message: "Swap non trovato"
            });
        }

        res.status(200).json({
            message: "Swap trovato",
            data: swap
        });

    } catch (error) {

        res.status(500).json({
            message: "Errore server",
            error: error.message
        });
    }
};

// DELETE SWAP
const deleteSwap = async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "ID swap non valido"
            });
        }

        const deletedSwap = await Swap.findByIdAndDelete(req.params.id);

        if (!deletedSwap) {
            return res.status(404).json({
                message: "Swap non trovato"
            });
        }

        res.status(200).json({
            message: "Swap eliminato",
            data: deletedSwap
        });

    } catch (error) {

        res.status(500).json({
            message: "Errore server",
            error: error.message
        });
    }
};

// UPDATE SWAP STATUS
const updateSwapStatus = async (req, res, status) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "ID swap non valido"
            });
        }

        const swap = await Swap.findById(req.params.id);

        if (!swap) {
            return res.status(404).json({
                message: "Swap non trovato"
            });
        }

        if (swap.status !== "pending") {
            return res.status(400).json({
                message: "Swap già gestito"
            });
        }

        swap.status = status;

        await swap.save();

        const populatedSwap = await populateSwap(
            Swap.findById(swap._id)
        );

        res.status(200).json({
            message: `Swap ${status}`,
            data: populatedSwap
        });

    } catch (error) {

        res.status(500).json({
            message: "Errore server",
            error: error.message
        });
    }
};

const acceptSwap = (req, res) => {
    updateSwapStatus(req, res, "accepted");
};

const rejectSwap = (req, res) => {
    updateSwapStatus(req, res, "rejected");
};

module.exports = {
    getSwaps,
    createSwap,
    getSwapById,
    deleteSwap,
    acceptSwap,
    rejectSwap
};