const mongoose = require("mongoose");

const Swap = require("../models/swap.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");

const AppError = require("../utils/AppError");

const populateSwap = (query) => {
    return query
        .populate("requesterUser", "name surname email")
        .populate("receiverUser", "name surname email")
        .populate("requesterProduct", "name images")
        .populate("receiverProduct", "name images");
};

// GET ALL SWAPS
const getSwaps = async (req, res, next) => {

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
                return next(new AppError("Stato non valido", 400));
            }

            filters.status = status;
        }

        if (date) {

            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

            if (!dateRegex.test(date)) {
                return next(new AppError("Data non valida, formato: YYYY-MM-DD", 400));
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
                return next(new AppError("ID prodotto non valido", 400));
            }

            const productExists = await Product.findById(productId);

            if (!productExists) {
                return next(new AppError("Prodotto non trovato", 404));
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
        error.statusCode = 500;
        next(error);
    }
};

// CREATE SWAP
const createSwap = async (req, res, next) => {

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
            return next(new AppError("Tutti i campi sono obbligatori", 400));
        }

        if (
            !mongoose.Types.ObjectId.isValid(requesterUser) ||
            !mongoose.Types.ObjectId.isValid(receiverUser) ||
            !mongoose.Types.ObjectId.isValid(requesterProduct) ||
            !mongoose.Types.ObjectId.isValid(receiverProduct)
        ) {
            return next(new AppError("Uno o più ID non sono validi", 400));
        }

        if (requesterUser === receiverUser) {
            return next(new AppError("Utenti devono essere diversi", 400));
        }

        if (requesterProduct === receiverProduct) {
            return next(new AppError("Prodotti devono essere diversi", 400));
        }

        const requesterUserExists = await User.findById(requesterUser);
        const receiverUserExists = await User.findById(receiverUser);

        if (!requesterUserExists || !receiverUserExists) {
            return next(new AppError("Uno o più utenti non trovati", 404));
        }

        const requesterProductExists = await Product.findById(requesterProduct);
        const receiverProductExists = await Product.findById(receiverProduct);

        if (!requesterProductExists || !receiverProductExists) {
            return next(new AppError("Uno o più prodotti non trovati", 404));
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
        error.statusCode = 500;
        next(error);
    }
};

// GET SWAP BY ID
const getSwapById = async (req, res, next) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(new AppError("ID swap non valido", 400));
        }

        const swap = await populateSwap(
            Swap.findById(req.params.id)
        );

        if (!swap) {
            return next(new AppError("Swap non trovato", 404));
        }

        res.status(200).json({
            message: "Swap trovato",
            data: swap
        });

    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

// DELETE SWAP
const deleteSwap = async (req, res, next) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(new AppError("ID swap non valido", 400));
        }

        const deletedSwap = await Swap.findByIdAndDelete(req.params.id);

        if (!deletedSwap) {
            return next(new AppError("Swap non trovato", 404));
        }

        res.status(200).json({
            message: "Swap eliminato",
            data: deletedSwap
        });

    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

// UPDATE SWAP STATUS
const updateSwapStatus = async (req, res, next, status) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(new AppError("ID swap non valido", 400));
        }

        const swap = await Swap.findById(req.params.id);

        if (!swap) {
            return next(new AppError("Swap non trovato", 404));
        }

        if (swap.status !== "pending") {
            return next(new AppError("Swap già accettato o rifiutato", 400));
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
        error.statusCode = 500;
        next(error);
    }
};

const acceptSwap = (req, res, next) => {
    updateSwapStatus(req, res, next, "accepted");
};

const rejectSwap = (req, res, next) => {
    updateSwapStatus(req, res, next, "rejected");
};

module.exports = {
    getSwaps,
    createSwap,
    getSwapById,
    deleteSwap,
    acceptSwap,
    rejectSwap
};