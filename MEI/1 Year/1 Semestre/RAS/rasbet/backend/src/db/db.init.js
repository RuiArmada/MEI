const { Sequelize } = require('sequelize')

const dbName = process.env.DB_NAME
const dbUser = process.env.DB_USER
const dbHost = process.env.DB_HOST
const dbDriver = 'mysql'
const dbPassword = process.env.DB_PASSWORD

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDriver
})

const dbInit = (sequelize) => {
    sequelize.sync({ alter: true });
}

exports.sequelizeConnection = sequelizeConnection
exports.dbInit = dbInit