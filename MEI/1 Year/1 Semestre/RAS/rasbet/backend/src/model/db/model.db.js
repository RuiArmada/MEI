const { Model, DataTypes } = require('sequelize')
const { sequelizeConnection } = require('../../db/db.init');

class Game extends Model {}
Game.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    homeTeam: DataTypes.STRING,
    awayTeam: DataTypes.STRING,
    commenceTime: DataTypes.DATE,
    oddsKey: DataTypes.STRING,
    gameType: DataTypes.STRING
}, {
    sequelize: sequelizeConnection,
    modelName: 'game'
});

class Bet extends Model {}
Bet.init({
    // id: {
    //     type: DataTypes.STRING,
    //     primaryKey: true
    // },
    total: DataTypes.FLOAT,
}, {
    timestamps: true,
    sequelize: sequelizeConnection,
    modelName: 'bet'
});

class Odd extends Model {}
Odd.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: DataTypes.STRING,
    value: DataTypes.FLOAT,
}, {
    sequelize: sequelizeConnection,
    modelName: 'odd'
});

class User extends Model {}
User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: {
        type: DataTypes.STRING,
        unique: true
    },
    password: DataTypes.STRING,
    email: { 
        type: DataTypes.STRING,
        unique: true
    },
    NIC: DataTypes.STRING,
    NIF: DataTypes.STRING,
    birthday: DataTypes.DATE,
    wallet: DataTypes.FLOAT,
}, {
    sequelize: sequelizeConnection,
    modelName: 'user'
});

class Transaction extends Model {}
Transaction.init({
    type: DataTypes.STRING,
    value: DataTypes.FLOAT
}, {
    sequelize: sequelizeConnection,
    modelName: 'transactions'
});

class MbWayPayment extends Model {}
MbWayPayment.init({
    phone: DataTypes.STRING,
    value: DataTypes.FLOAT
},{
    sequelize: sequelizeConnection,
    modelName: 'mbwaypayment'
})

class CardPayment extends Model {}
CardPayment.init({
    phone: DataTypes.STRING,
    value: DataTypes.FLOAT
},{
    sequelize: sequelizeConnection,
    modelName: 'cardpayment'
})

User.hasMany(Bet)
Bet.belongsTo(User)

Bet.belongsTo(Game)
Game.hasMany(Bet)

Odd.hasMany(Bet)
Bet.belongsTo(Odd)

Game.hasMany(Odd)
Odd.belongsTo(Game)

User.hasMany(Transaction)
Transaction.belongsTo(User)

// MbWayPayment.hasOne(Bet)
Bet.hasOne(MbWayPayment)

// CardPayment.hasOne(Bet)
Bet.hasOne(CardPayment)

exports.User = User
exports.Transaction = Transaction
exports.Game = Game
exports.Odd = Odd
exports.Bet = Bet
exports.CardPayment = CardPayment
exports.MbWayPayment = MbWayPayment