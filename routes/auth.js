const db = require('../database');
const express = require("express");
const router = express.Router();

// Import your login and register controllers
const authController = require('./notify');

//grab from login
router.post('/login', authController.login);
router.post('/register', authController.register);


module.exports = router;
