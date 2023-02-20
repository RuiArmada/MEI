const { User, Transaction } = require('../model/db/model.db')
// const { Odds } = require('../model/db/Odds')

exports.createTransaction = async (req, res) => {
    const userData = req.jwt
    const { type, value } = req.body

    await Transaction.create({
        userId: userData.id,
        type: type, // ADD or REMOVE
        value: value
    })

    // Update user's wallet
    const user = await User.findByPk(userData.id)
    if(type === 'ADD')
        user.wallet += value
    else if(type === 'REMOVE') {
        user.wallet -= value
        if(user.wallet < 0) user.wallet = 0        
    }

    await user.save()
    
    return res.status(200).json()
}

exports.getTransactionsHistory = async (req, res) => {
    const userData = req.jwt

    const transactions = (await Transaction.findAll({
        where: { userId: userData.id }
    })).map(transaction => transaction.dataValues)
    
    return res.status(200).json({ transactions })
}