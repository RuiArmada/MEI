
class Game {
    constructor(id, homeTeam, awayTeam, commenceTime, oddsKey) {
        this.id = id
        this.homeTeam = homeTeam
        this.awayTeam = awayTeam
        this.commenceTime = commenceTime
        this.oddsKey = oddsKey
        this.odds = {}
    }
}

exports.Game = Game