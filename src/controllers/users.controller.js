const mongoose = require("mongoose");
const User = require("../models/user.model");

// GET all users
const getUsers = async (req, res) => {

    try {

        const users = await User.find();

        res.status(200).json({
            message: "Lista utenti",
            results: users.length,
            data: users
        });

    } catch (error) {

        res.status(500).json({
            message: "Errore server",
            error: error.message
        });
    }
};

// POST create user
const createUser = async (req, res) => {

    try {

        const { name, surname, email } = req.body;

        if (!name || !surname || !email) {
            return res.status(400).json({
                message: "Tutti i campi sono obbligatori"
            });
        }

        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return res.status(409).json({
                message: "Email già esistente"
            });
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

        res.status(500).json({
            message: "Errore server",
            error: error.message
        });
    }
};
// GET by id
const getUserById = async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "ID utente non valido"
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "Utente non trovato"
            });
        }

        res.status(200).json({
            message: "Utente trovato",
            data: user
        });

    } catch (error) {

        res.status(500).json({
            message: "Errore server",
            error: error.message
        });
    }
};

// PUT
const updateUser = async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "ID utente non valido"
            });
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
            return res.status(404).json({
                message: "Utente non trovato"
            });
        }

        res.status(200).json({
            message: "Utente aggiornato",
            data: updatedUser
        });

    } catch (error) {

        res.status(500).json({
            message: "Errore server",
            error: error.message
        });
    }
};

// DELETE
const deleteUser = async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "ID utente non valido"
            });
        }

        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({
                message: "Utente non trovato"
            });
        }

        res.status(200).json({
            message: "Utente eliminato",
            data: deletedUser
        });

    } catch (error) {

        res.status(500).json({
            message: "Errore server",
            error: error.message
        });
    }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
};