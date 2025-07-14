const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('../config/congif.json')[env]

const Board = require('./board')
const Member = require('./member')

const db = {}
const sequelize = new Sequelize(config.database, config.username, config.password, config) // 데이터베이스 연결 설정

db.sequelize = sequelize // sequelize 인스턴스를 db 객체에 추가
db.Board = Board
db.Member = Member

Board.init(sequelize)
Member.init(sequelize)

Board.associate(db)
Member.associate(db)

module.exports = db
