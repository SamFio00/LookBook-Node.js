const mongoose = require("mongoose");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");

// GET all users
const getUsers = async (req, res, next) => {

    try {

        const users = await User.find();

        res.status(200).json({
            message: "Lista utenti",
            results: users.length,
            data: users
        });

    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

// POST create user
const createUser = async (req, res, next) => {

    try {

        const { name, surname, email } = req.body;

        if (!name || !surname || !email) {
            return next(new AppError("Tutti i campi sono obbligatori", 400));
        }

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

    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};
// GET by id
const getUserById = async (req, res, next) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(new AppError("ID utente non valido", 400));
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new AppError("Utente non trovato", 404));
        }

        res.status(200).json({
            message: "Utente trovato",
            data: user
        });

    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

// PUT
const updateUser = async (req, res, next) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(new AppError("ID utente non valido", 400));
        }

        const { name, surname, email } = req.body;

        const updateData = {};

        if (name) updateData.name = name;
        if (surname) updateData.surname = surname;
        if (email) updateData.email = email;

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

    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

// DELETE
const deleteUser = async (req, res, next) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(new AppError("ID utente non valido", 400));
        }

        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return next(new AppError("Utente non trovato", 404));
        }

        res.status(200).json({
            message: "Utente eliminato",
            data: deletedUser
        });

    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
};