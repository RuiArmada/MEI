const { Bet, MbWayPayment, CardPayment, Odd, Game } = require('../model/db/model.db')

const getBets = async userId => {
    const dbBets = await Bet.findAll({
        where: {
            userId: userId
        },
        order: [    
            ['createdAt', 'DESC'],
        ],
    })

    const parsedBets = await Promise.all(await dbBets.map(async dbBet => {
        const bet = dbBet.dataValues
        bet.odd = await Odd.findOne({ where: { id: bet.oddId }})
        bet.game = await Game.findOne({ where: { id: bet.gameId }})

        bet.odd = bet.odd.dataValues
        bet.game = bet.game.dataValues

        return bet
    }))

    return parsedBets
}

exports.getBetsHistory = async (req, res) => {
    const userData = req.jwt
    const betsHistory = await getBets(userData.id)

    return res.status(200).json(betsHistory)
}

exports.cancelBet = async (req, res) => {
    const {
        betId
    } = req.body
    const userData = req.jwt
    
    const result = await Bet.destroy({
        where: {
            userId: userData.id,
            id: betId
        }
    })

    console.log(result)

    const betsHistory = await getBets(userData.id)
    
    return res.status(200).json({
        status: true,
        betsHistory
    })
}

exports.placeBet = async (req, res) => {
    const {
        bets,
        payment
    } = req.body
    const { paymentType, paymentData } = payment
    const userData = req.jwt

    // Insert bets and payments
    bets.forEach(async bet => {
        const {
            gameId,
            oddId,
            value
        } = bet

        const newBet = await Bet.create({
            userId: userData.id,
            gameId: gameId,
            oddId: oddId,
            total: value
        })

        if(paymentType === 'MBWAY') {
            await MbWayPayment.create({
                phone: paymentData.phone,
                value: newBet.total,
                betId: newBet.id
            })
        } else if(paymentType === 'CARD') {
            await CardPayment.create({
                phone: paymentData.phone,
                value: newBet.total,
                betId: newBet.id
            })
        }
    })
    
    return res.status(200).json({
        status: true
    })
}