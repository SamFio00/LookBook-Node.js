const express = require("express");
const router = express.Router();
const validateObjectId = require("../middlewares/validateObjectId.middleware");

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
    .get(validateObjectId, getUserById)
    .put(validateObjectId, updateUser)
    .delete(validateObjectId, deleteUser);

module.exports = router;