const express = require('express')
const authRouter = express.Router()
const authController = require('../controller/auth.controller')

// The secret should be an unguessable long string (you can use a password generator for this!)

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.get("/validateToken", [
    authController.validateJWT,
    authController.validateToken
]);

exports.authRouter = authRouter