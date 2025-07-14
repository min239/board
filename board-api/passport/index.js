const passport = require('passport')
const local = require('./localStrategy')
const Member = require('../models/member')

module.exports = () => {
   //직렬화(serializeUser): 로그인 성공 후 사용자 정보를 세션에 저장
   passport.serializeUser((member, done) => {
      console.log('✅member:', member)
      done(null, member.id)
   })

   passport.deserializeUser(async (id, done) => {
      //select id, name, email, createdAt, updatedAt from users where id = ? limit 1
      Member.findOne({
         where: { id },
         attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt'], //id, name, email, createdAt, updatedAt 컬럼 조회
      })
         .then((member) => done(null, member))
         .catch((err) => done(err))
   })

   local()
}
