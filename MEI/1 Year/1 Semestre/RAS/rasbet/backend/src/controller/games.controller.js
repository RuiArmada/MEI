const gamesApi = require('../utils/apis')
const { Game, Odd } = require('../model/db/model.db')
// const { Odds } = require('../model/db/Odds')

const updateDbGames = async (gameType) => {
    const gameFetchFunctions = {
      football: gamesApi.fetchFootballGames,
      basketball: gamesApi.fetchBasketballGames,
      // tenis: ,
      // motoGP: ,
    }
    try{
        const gamesData = await gameFetchFunctions[gameType]()

        Object.values(gamesData).forEach(async game => {
            const newGame = (await Game.upsert({
                id: game.id,
                homeTeam: game.homeTeam,
                awayTeam: game.awayTeam,
                commenceTime: game.commenceTime,
                oddsKey: game.oddsKey,
                gameType: gameType.toUpperCase()
            }))[0]
    
            Object.keys(game.odds).map(async oddKey => {
                const odd = game.odds[oddKey]
                return await Odd.upsert({
                    id: oddKey,
                    name: odd.name,
                    value: odd.value,
                    gameId: newGame.dataValues.id
                }, { include: [ Game ] })
            })
        })
    } catch(err) {
        console.error(err)
    }
}

exports.getGames = async (req, res) => {
    const { game } = req.params

    // First fetch the existing data in the db since it's faster
    let gamesData = await Game.findAll({
        where: {
            gameType: game.toUpperCase(),
        },
        order: [
            ['commenceTime', 'ASC']
        ]
    })

    gamesData = await Promise.all(await gamesData.map(async game => {
        const odds = {}
        const dbOdds = await Odd.findAll({ where: { gameId: game.id }})
        dbOdds.forEach(odd => {
            odd = odd.dataValues
            odds[game.id + '_' + odd.name] = odd
        })

        return {
            ...game.dataValues,
            odds
        }
    }))

    // Then fetches the apis and updates the games in the db in async mode
    // so the client doensn't have to wait as much
    updateDbGames(game)
    
    return res.status(200).json(gamesData)
}