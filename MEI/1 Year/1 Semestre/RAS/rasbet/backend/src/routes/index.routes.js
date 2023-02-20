const express = require('express')
const { gamesRouter } = require('./games.routes.js')
const { authRouter } = require('./auth.routes.js')
const { betsRouter } = require('./bets.routes.js')
const { notifsRouter } = require("./notifications.routes.js")
const { functionsRouter } = require("./functions.routes.js")
const { transactionsRouter } = require("./transactions.routes.js")

const router = express.Router()

router.use('/auth', authRouter)
router.use('/games', gamesRouter)
router.use('/bets', betsRouter)
router.use("/notifications", notifsRouter)
router.use("/functions", functionsRouter);
router.use("/transactions", transactionsRouter);


module.exports = router