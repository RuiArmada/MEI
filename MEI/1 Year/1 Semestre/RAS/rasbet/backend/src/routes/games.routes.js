const express = require('express')
const gamesRouter = express.Router()
const gamesController = require('../controller/games.controller')
const authController = require('../controller/auth.controller')

gamesRouter.get('/:game/', [
  authController.validateJWT,
  gamesController.getGames
])

gamesRouter.post('/', async (req, res) => {
  const msg = {
    msg: 'POST request to /games',
    data: req.body
  }
  return res.status(200).send(msg)
})

exports.gamesRouter = gamesRouter