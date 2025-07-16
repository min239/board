import { Container } from '@mui/material'
import BoardCreateForm from '../components/post/BoardCreateForm'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createBoardThunk } from '../features/boardSlice'

function BoardCreatePage() {
   const navigate = useNavigate()
   const dispatch = useDispatch()

   const onBoardCreate = (boardData) => {
      // boardData는 BoardCreateForm에서 생성한 FormData 객체
      dispatch(createBoardThunk(boardData))
         .unwrap() // createBoardThunk의 결과를 Promise로 반환
         .then(() => {
            // 게시물 등록 성공 후 홈으로 이동
            navigate('/')
         })
         .catch((error) => {
            // 게시물 등록 실패 시 에러 처리
            console.error('게시물 등록 에러:', error)
            alert('게시물 등록에 실패했습니다.', error)
         })
   }
   return (
      <Container maxWidth="md">
         <h1>게시물 등록</h1>
         <BoardCreateForm onBoardCreate={onBoardCreate} />
      </Container>
   )
}

export default BoardCreatePage
