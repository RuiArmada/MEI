const express = require('express')
const transactionsRouter = express.Router()
const transactionsController = require('../controller/transactions.controller')
const authController = require('../controller/auth.controller')

// Place bet
transactionsRouter.post('/',[
    authController.validateJWT,
    transactionsController.createTransaction
])

// Get bets history
transactionsRouter.get('/',[
    authController.validateJWT,
    transactionsController.getTransactionsHistory
]) 


exports.transactionsRouter = transactionsRouter