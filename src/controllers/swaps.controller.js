const swaps = require("../data/swaps.data");
const users = require("../data/users.data");
const products = require("../data/products.data");

const getSwaps = (req, res) => {

    let filteredSwaps = [...swaps];

    const { status, productId, date } = req.query;

    // filter by status
    if (status) {

        const allowedStatus = [
            "pending",
            "accepted",
            "rejected"
        ];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Status not valid, allowed values: pending, accepted, rejected"
            });
        }

        filteredSwaps = filteredSwaps.filter(
            swap => swap.status === status
        );
    }

    // filter by productId
    if (productId) {

        const parsedProductId = parseInt(productId);

        if (isNaN(parsedProductId)) {
            return res.status(400).json({
                message: "productId must be a number"
            });
        }

        filteredSwaps = filteredSwaps.filter(
            swap =>
                swap.requesterProductId === parsedProductId ||
                swap.receiverProductId === parsedProductId
        );
    }

    // filter by date
    if (date) {

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!dateRegex.test(date)) {
            return res.status(400).json({
                message: "Date format must be YYYY-MM-DD"
            });
        }

        filteredSwaps = filteredSwaps.filter(swap => {

            const swapDate = new Date(swap.createdAt)
                .toISOString()
                .split("T")[0];

            return swapDate === date;
        });
    }

    res.status(200).json({
        message: "Swaps trovati",
        results: filteredSwaps.length,
        data: filteredSwaps
    });
};

// POST
const createSwap = (req, res) => {
    const {
        requesterUserId,
        receiverUserId,
        requesterProductId,
        receiverProductId
    } = req.body;

    if (
        requesterUserId == null ||
        receiverUserId == null ||
        requesterProductId == null ||
        receiverProductId == null
    ) {
        return res.status(400).json({
            message: "Tutti i campi sono obbligatori"
        });
    }

    const requesterUser = users.find(u => u.id === requesterUserId);
    const receiverUser = users.find(u => u.id === receiverUserId);

    if (!requesterUser || !receiverUser) {
        return res.status(404).json({
            message: "Uno o entrambi gli utenti non trovati"
        });
    }

    const requesterProduct = products.find(p => p.id === requesterProductId);
    const receiverProduct = products.find(p => p.id === receiverProductId);

    if (!requesterProduct || !receiverProduct) {
        return res.status(404).json({
            message: "Uno o entrambi i prodotti non trovati"
        });
    }

    const newSwap = {
        id: swaps.length + 1,

        requesterUserId,
        receiverUserId,

        requesterProductId,
        receiverProductId,

        status: "pending",

        createdAt: new Date()
    };

    swaps.push(newSwap);

    res.status(201).json({
        message: "Scambio creato",
        data: newSwap
    });
};

// Get by id
const getSwapById = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "ID scambio non valido"
        });
    }

    const swap = swaps.find(s => s.id === id);

    if (!swap) {
        return res.status(404).json({
            message: "Scambio non trovato"
        });
    }

    res.json({
        message: "Scambio trovato",
        data: swap
    });
};

// PATCH
const acceptSwap = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "ID scambio non valido"
        });
    }

    const swap = swaps.find(s => s.id === id);

    if (!swap) {
        return res.status(404).json({
            message: "Scambio non trovato"
        });
    }

    if (swap.status !== "pending") {
        return res.status(400).json({
            message: "Scambio non in attesa di accettazione"
        });
    }

    swap.status = "accepted";

    res.json({
        message: "Scambio accettato",
        data: swap
    });
};

const rejectSwap = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "ID scambio non valido"
        });
    }

    const swap = swaps.find(s => s.id === id);

    if (!swap) {
        return res.status(404).json({
            message: "Scambio non trovato"
        });
    }

    if (swap.status !== "pending") {
        return res.status(400).json({
            message: "Scambio non in attesa di accettazione"
        });
    }

    swap.status = "rejected";

    res.json({
        message: "Scambio rifiutato",
        data: swap
    });
};


module.exports = {
    getSwaps,
    createSwap,
    getSwapById,
    acceptSwap,
    rejectSwap
};