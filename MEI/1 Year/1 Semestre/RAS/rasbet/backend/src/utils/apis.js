const Game = require('../model/Game').Game

exports.fetchFootballGames = async () => {
    const data = await fetch(process.env.FOOTBALL_API)
        .then(res => res.json());
    const games = {}

    data.forEach(game => {
        const oddsListKey = game.bookmakers[0].markets[0].key
        const newGame = new Game(
            game.id,
            game.homeTeam,
            game.awayTeam,
            game.commenceTime,
            oddsListKey
        )

        game.bookmakers[0].markets[0].outcomes.forEach(odd => {
            newGame.odds[game.id + '_' + odd.name] = {
                name: odd.name,
                value: odd.price,
            }
        })

        // games.push(newGame)
        games[game.id] = newGame
    });

    return games
};

exports.fetchBasketballGames = async () => {
    const data = await fetch(process.env.BASKETBALL_API)
        .then(res => res.json())
    const games = {}

    data.forEach(game => {
        if(!game.bookmakers[0]) return

        const oddsListKey = game.bookmakers[0].markets[0].key
        const newGame = new Game(
            game.id,
            game.home_team,
            game.away_team,
            game.commence_time,
            oddsListKey
        )

        game.bookmakers[0].markets[0].outcomes.forEach(odd => {
            newGame.odds[game.id + '_' + odd.name] = {
                name: odd.name,
                value: odd.price,
            }
        })

        // games.push(newGame)
        games[game.id] = newGame
    })
    
    return games
}

// Not working rn
exports.fetchTenisGames = async () => {
    const data = await fetch("https://tennis-odds.p.rapidapi.com/odds/prematch")
        .then(res => res.json())
    const games = {}

    data.forEach(game => {
        const oddsListKey = game.bookmakers[0].markets[0].key
        const newGame = new Game(
            game.id,
            game.home_team,
            game.away_team,
            game.commence_time,
            oddsListKey
        )

        game.bookmakers[0].markets[0].outcomes.forEach(odd => {
            newGame.odds[game.id + '_' + odd.name] = {
                name: odd.name,
                value: odd.price,
            }
        })

        // games.push(newGame)
        games[game.id] = newGame
    })
    
    return games
}