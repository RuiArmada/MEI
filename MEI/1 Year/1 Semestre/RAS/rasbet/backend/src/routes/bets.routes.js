const express = require('express')
const betsRouter = express.Router()
const betsController = require('../controller/bets.controller')
const authController = require('../controller/auth.controller')

// Place bet
betsRouter.post('/',[
    authController.validateJWT,
    betsController.placeBet
])

// Get bets history
betsRouter.get('/',[
    authController.validateJWT,
    betsController.getBetsHistory
]) 

// Get bets history
betsRouter.delete('/',[
    authController.validateJWT,
    betsController.cancelBet
]) 

exports.betsRouter = betsRouter