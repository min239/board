const express = require('express')
const passport = require('passport') // 인증 미들웨어
const bcrypt = require('bcrypt') // 비밀번호 암호화를 위한 bcrypt 모듈
const router = express.Router()
const Member = require('../models/member') // Member 모델 불러오기
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')

//회원가입 localhost:8000/auth/join

router.post('/join', isNotLoggedIn, async (req, res, next) => {
   /*req.body에는 클라이언트에서 전달된 회원가입 정보가 담겨있음
   예: {email: , nick: , password:}
    */
   try {
      console.log(req.body)
      const { email, name, password } = req.body
      // 이메일, 닉네임, 비밀번호가 모두 존재하는지 확인
      //select * from Members where email = ? limit 1;
      const exMember = await Member.findOne({
         where: { email },
      })
     
      if (exMember) {
         const error = new Error('이미 존재하는 사용자입니다.') //에러객체 생성
         error.status = 409 // Conflict
         return next(error) //에러미들웨어로 전달(app.js에서 설정한 에러 미들웨어로 전달)
      }
    

      // 비밀번호 암호화
      const hash = await bcrypt.hash(password, 12) // 12는 salt(해시 

      //새로운 사용자 생성
      const newMember = await Member.create({
         email, //:email생략,
         name, //:nick생략,
         password: hash, // 암호화된 비밀번호 저장
      })

      //성공 응답 반환
      res.status(201).json({
         success: true,
         message: '사용자가 성공적으로 등록되었습니다',
        
         member: {
            id: newMember.id,
            email: newMember.email,
            name: newMember.name,
         },
      })
   } catch (error) {
      //에러발생시 미들웨어로 전달
      error.status = 500 
      error.message = '회원가입 중 오류가 발생했습니다.' 
      next(error) // 에러가 발생하면 에러 미들웨어로 전달(app.js에서 설정한 에러 미들웨어로 전달)
   }
})

//로그인 localhost:8000/auth/login 버튼누르면 여기로

router.post('/login', isNotLoggedIn, async (req, res, next) => {
   passport.authenticate('local', (authError, member, info) => {
      
      if (authError) {
         authError.status = 500 //err.status에 500을 넣어 에러 미들웨어에서 500 상태코드로 응답할 수 있도록 한다
         authError.message = '인증 중 오류 발생'
         return next(authError) //에러미들 로 전달(app.js에서 설정한 에러 미들웨어로 전달)
      }
      if (!member) {
       
         //401:unauthorized,로그인 과정에서 인증이 안된경우 사용
         const err = new Error(info.message || '로그인 실패')
         err.status = 401 
         return next(err) //에러미들 로 전달(app.js에서 설정한 에러 미들웨어로 전달)
      }
  

      req.logIn(member, (loginError) => {
         if (loginError) {
            //로그인 상태로 바꾸는 중 오류 발생 시
            loginError.status = 500
            loginError.message = '로그인 중 오류 발생'
            return next(loginError)
         }

         //로그인 성공시 user객체와 함꼐 response
         res.status(200).json({
            success: true,
            message: '로그인 성공',
            member: {
               id: member.id,
               name: member.name,
            },
         })
      })
   })(req, res, next)
})
//로그아웃localhost:8000/auth/logout
//로그인이 된 상태일 때만 로그아웃을 하도록 한다
router.get('/logout', isLoggedIn, async (req, res, next) => {
   req.logout((logoutError) => {
      if (logoutError) {
         //로그아웃 상태로 바꾸는 중 에러 발생시
         logoutError.status = 500
         logoutError.message = '로그아웃 중 오류 발생'
         return next(logoutError)
      }
   
      res.status(200).json({
         success: true,
         message: '로그아웃 성공',
      })
   })
})

//현재 로그인 상태 확인 localhost:8000/auth/status
router.get('/status', async (req, res, next) => {
   try {
      if (req.isAuthenticated()) {
        

         res.status(200).json({
            isAuthenticated: true, //로그인 상태
            member: {
               id: req.member.id,
               name: req.member.name, 
            },
         })
      } else {
         //로그인이 되지 않았을 떄
         res.status(200).json({
            isAuthenticated: false, //로그인 상태가 아님
         })
      }
   } catch (error) {
      error.status = 500
      error.message = '로그인 상태확인 중 오류가 발생했습니다.'
      next(error) //에러가 발생하면 에러 미들웨어로 전달(app.js에서 설정한 에러 미들웨어로 전달)
   }
})
module.exports = router
