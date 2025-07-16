const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { Board, Member } = require('../models')
const { isLoggedIn } = require('./middlewares')

const router = express.Router()

// uploads 폴더가 없을 경우 폴더 생성
try {
   fs.readdirSync('uploads') // 해당 폴더가 있는지 확인
} catch (error) {
   console.log('uploads 폴더가 없어 uploads 폴더를 생성합니다.')
   fs.mkdirSync('uploads') // 폴더 생성
}

// 이미지 업로드를 위한 multer 설정
const upload = multer({
   // 저장할 위치와 파일명 지정
   storage: multer.diskStorage({
      destination(req, file, cb) {
         cb(null, 'uploads/') // uploads 폴더에 파일 저장
      },
      filename(req, file, cb) {
         // 제주도.jpg
         const decodeFileName = decodeURIComponent(file.originalname) // 파일명 디코딩(한글 파일명 깨짐 방지)
         const ext = path.extname(decodeFileName) // 확장자 추출 -> .jpg
         const basename = path.basename(decodeFileName, ext) //
         cb(null, basename + Date.now() + ext)
      },
   }),
   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 파일크기 제한
})
//게시물 등록 localhost:8000/board
router.post('/', isLoggedIn, upload.single('img'), async (req, res, next) => {
   try {
      console.log('파일정보:', req.file)
      console.log('formData:', req.body)
      //업로드 파일 없을 경우
      if (!req.file) {
         const error = new Error('파일 업로드에 실패했습니다.')
         error.status = 400
         return next(error)
      }

      //게시물 등록
      const board = await Board.create({
         title: req.body.title, //제목
         content: req.body.content, //내용
         img: `/${req.file.filename}`, //이미지url
         member_id: req.member_id, //id
      })
      res.status(200).json({
         success: true,
         board: {
            id: board.id,
            title: board.title,
            content: board.content,
            img: board.img,
            memberId: board.member_id,
         },
         message: '게시물이 성공적으로 등록되었습니다.',
      })
   } catch (error) {
      error.status = 500
      error.message = '게시물 등록 중 오류 발생했습니다.'
      next(error)
   }
})

// // 게시물 수정 localhost:8000/post/:id
// router.put('/:id', isLoggedIn, upload.single('img'), async (req, res, next) => {
//    try {
//    } catch (error) {
//       error.status = 500
//       error.message = '게시물 수정 중 오류가 발생했습니다.'
//       next(error)
//    }
// })

// // 게시물 삭제 localhost:8000/post/:id
// router.delete('/:id', isLoggedIn, async (req, res, next) => {
//    try {
//    } catch (error) {
//       error.status = 500
//       error.message = '게시물 삭제 중 오류가 발생했습니다.'
//       next(error)
//    }
// })
//게시물을 가지고 오지 못했을 떄

//전체 게시물 불러오기 localhost:8000/post?page=1
router.get('/', async (req, res, next) => {
   try {
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 3
      const offset = (page - 1) * limit

      //1게시물 레코드의 전체 갯수 가져오기
      const count = await Post.count()

      //2 게시물 레코드 가져오기
      const boards = await Board.findAll({
         limit,
         offset,
         order: [['createdAt', 'DESC']], //-> 최근 날짜순
         include: [
            {
               model: Member,
               attributes: ['id', 'name', 'email'],
            },
         ],
      })
      console.log('boards:', boards)

      res.status(200).json({
         success: true,
         boards,
         pagination: {
            totalBoards: count, //전체 게시물 수
            cuurentPage: page, //현재 페이지
            totlaPage: Math.ceil(count / limit), //총 페이지 수
            limit, //페이지당 게시물 수
         },
         message: '전체 게시물 리스트를 성공적으로 불러왔습니다.',
      })
   } catch (error) {
      error.status = 500
      error.message = '게시물 리스트를 불러오는 중 오류가 발생했습니다.'
      next(error)
   }
})
module.exports = router
