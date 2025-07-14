const Sequelize = require('sequelize')

module.exports = class Member extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {
            email: {
               type: Sequelize.STRING(40),
               allowNull: false,
            },
            name: {
               type: Sequelize.STRING(100),
               allowNull: false,
            },
            password: {
               type: Sequelize.STRING(100),
               allowNull: false,
            },
         },
         {
            sequelize,
            timestamps: true, //createAt, updateAt 자동 생성
            underscored: false,
            modelName: 'Member', // 모델 이름
            tableName: 'members', // 테이블 이름
            paranoid: true, // deleteAt 자동생성, 소프트 삭제
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
         }
      )
   }
   static associate(db) {
      db.Member.hasMany(db.Board, {
         foreignKey: 'member_id',
         sourceKey: 'id',
      })
   }
}
