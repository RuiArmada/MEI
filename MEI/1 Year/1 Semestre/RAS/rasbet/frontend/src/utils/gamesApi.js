import { Game } from '../models/Game.js'

const parseGame = (gameData) => {
    const games = {}

    Object.keys(gameData).forEach(gameId => {
        const game = gameData[gameId]

        const newGame = new Game(
            game.id,
            game.homeTeam,
            game.awayTeam,
            game.commenceTime,
            game.oddsKey
        )

        Object.keys(game.odds).forEach(oddId => {
            const odd = game.odds[oddId]
            newGame.odds[oddId] = {
                id: oddId,
                name: odd.name,
                value: odd.value,
                selected: false
            }
        })

        // games.push(newGame)
        games[game.id] = newGame
    })

    return games
}

export const getFootballGames = async () => {
    const userToken = localStorage.getItem("user_token")

    const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/games/football/`, {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    }).then(res => {
        if(res.status != 200)
            return new Error(res.status)
        return res.json()
    })
    .catch(res => res)
        
    if(data.name == 'Error')
        return data

    return parseGame(data)
}

export const getBasketballGames = async () => {
    const userToken = localStorage.getItem("user_token")

    const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/games/basketball/`, {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    }).then(res => {
        if(res.status != 200)
            return new Error(res.status)
        return res.json()
    })
    .catch(res => res)

    if(data.name == 'Error')
        return data

    return parseGame(data)
}