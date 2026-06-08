const express = require("express");
const router = express.Router();
const { createUserValidator, updateUserValidator } = require("../middlewares/validators/user.validator");
const validateRequest = require("../middlewares/validateRequest.middleware");
const validateObjectId = require("../middlewares/validateObjectId.middleware");

const { 
    getUsers, 
    createUser, 
    getUserById, 
    updateUser, 
    deleteUser 
} = require("../controllers/users.controller");

// get and create users
router.route("/")
    .get(getUsers)
    .post(createUserValidator, validateRequest, createUser);

// GET by id, update and delete user
router.route("/:id")
    .get(validateObjectId, getUserById)
    .put(validateObjectId, updateUserValidator, validateRequest, updateUser)
    .delete(validateObjectId, deleteUser);

module.exports = router;