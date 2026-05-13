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
router.route("/")
    .get(getUsers)
    .post(createUser);

// GET by id
router.route("/:id")
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;