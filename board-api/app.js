const express = require('express')
const path = require('path') // 경로 처리 유틸리티
const cookieParser = require('cookie-parser') // 쿠키 처리 미들웨어
const morgan = require('morgan') // HTTP 요청 로깅 미들웨어
const session = require('express-session') // 세션 관리 미들웨어
require('dotenv').config() // 환경 변수 관리
const cors = require('cors') // CORS 미들웨어->api 서버는 반드시 설정

const indexRouter =require('./routes')
const authRouter = require('./routes/auth')
const boardRouter = require('./routes/board')
const userRouter =require('./routes/user')





//미들웨어 설정
app.use(
   cors({
      origin: 'http://localhost:1573',
      credentials: true,
   })
)
app.use(morgan('dev')) // 로그
app.use(express.static(path.join(__dirname, 'uploads'))) // 정적 파일 제공
app.use(express.json()) // JSON 데이터 파싱
app.use(express.urlencoded({ extended: false })) // URL-encoded 데이터 파싱
app.use(cookieParser(process.env.COOKIE_SECRET)) //쿠키 설정
//세션 설정
app.use(
   session({
      resave: false, //세션 데이터가 변경사항이 없어도 재저장 할지 여부 -> 변경사항이 있어야 재저장
      saveUninitialized: true, //초기화 되지 않은 세션 저장 여부 -> 초기화 되지 않은 빈 세션도 저장
      secret: process.env.COOKIE_SECRET, //세션 암호화 키
      cookie: {
         // maxAge를 설정하지 않으면 브라우저가 꺼지면 쿠키도 삭제됨
         httpOnly: true, //javascript로 쿠키에 접근가능한지 여부 -> true 일경우 접근 X
         secure: false, //https를 사용할때만 쿠키 전송 여부 -> http, https 둘다 사용가능
      },
   })
)

//라우터 등록
app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/board', boardRouter)
app.use('/page', pageRouter)
app.use('/user', userRouter)

//잘못된 라우터 경로 처리
app.use((req, res, next) => {
   const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`)
   error.status = 404
   next(error)
})

//에러 미들웨어
app.use((err, req, res, next) => {
   console.error(err)

   const statusCode = err.status || 500
   const errorMessage = err.message || '서버 내부 오류'

   //클라이언트에 에러 json객체 response
   res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: err,
   })
})
app.listen(app.get('port'), () => {
   console.log(`${app.get('port')}번 포트에서 대기중`)
})
