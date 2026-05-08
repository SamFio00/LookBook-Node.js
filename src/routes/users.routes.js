const express = require("express");
const router = express.Router();

const { 
    getUsers, 
    createUser, 
    getUserById, 
    updateUser, 
    deleteUser 
} = require("../controllers/users.controller");

// GET
router.get("/", getUsers);

// POST
router.post("/", createUser);

// GET by id
router.get("/:id", getUserById);

// PUT
router.put("/:id", updateUser);

// DELETE
router.delete("/:id", deleteUser);

module.exports = router;