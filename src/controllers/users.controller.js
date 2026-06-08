const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler"); 
const AppError = require("../utils/AppError");

// GET all users
const getUsers = asyncHandler(async (req, res) => {

    const users = await User.find();

    res.status(200).json({
        message: "Lista utenti",
        results: users.length,
        data: users
    });
});

// POST create user
const createUser = asyncHandler(async (req, res, next) => {

    const { name, surname, email } = req.body;

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
        return next(new AppError("Email già in uso", 409));
    }

    const newUser = await User.create({
        name,
        surname,
        email
    });

    res.status(201).json({
        message: "Utente creato",
        data: newUser
    });
});

// GET by id
const getUserById = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new AppError("Utente non trovato", 404));
    }

    res.status(200).json({
        message: "Utente trovato",
        data: user
    });
});

// PUT
const updateUser = asyncHandler(async (req, res, next) => {

    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        return next(new AppError("Utente non trovato", 404));
    }

    res.status(200).json({
        message: "Utente aggiornato",
        data: updatedUser
    });
});

// DELETE
const deleteUser = asyncHandler(async (req, res, next) => {

    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
        return next(new AppError("Utente non trovato", 404));
    }

    res.status(200).json({
        message: "Utente eliminato",
        data: deletedUser
    });
});

module.exports = {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser
};