import { Container, Typography, Pagination, Stack } from '@mui/material'
import BoardItem from '../components/post/BoardItem'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoardsThunk } from '../features/boardSlice'

function Home({ isAuthenticated, member }) {
   const [page, setPage] = useState(1) //현재 페이지
   const dispatch = useDispatch()
   const { boards, pagination, loading, error } = useSelector((state) => state.boards)

   useEffect(() => {
      dispatch(fetchBoardsThunk(page)) //전체 리스트 가져오기
   }, [dispatch, page])

   //페이지 변경
   const handlePageChange = (event, value) => {
      setPage(value)
   }

   return (
      <Container maxWidth="xs">
         <Typography variant="h4" align="center" gutterBottom>
            게시판
         </Typography>

         {loading && (
            <Typography variant="body1" align="center">
               로딩 중...
            </Typography>
         )}

         {error && (
            <Typography variant="body1" align="center" color="error">
               에러 발생: {error}
            </Typography>
         )}
         {/* 
         수정전 코드
      {boards.map((board) => (
      <BoardItem key={board.id} board={board} isAuthenticated={isAuthenticated} member={member} />
       ))}
      BoaardItem은 단일 게시글(board)을 받아야하는 구조가 아니라 전체목록(boards)을 배열로 받아야 동작한다 하지만 위에 처럼 map으로 감싸서 BoardItem을 여러번 렌더링하면 Table이 중복되고 TableHead도 여려 번 렌더링 된다.
      BoardItem을 한 번만 호출하고, boards배열을 한번에 넘겨줘야 한다
      */}
         {boards.length > 0 ? (
            <>
               <BoardItem boards={boards} isAuthenticated={isAuthenticated} member={member} />
               <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
                  <Pagination count={pagination.totalPages} page={page} onChange={handlePageChange} />
               </Stack>
            </>
         ) : (
            !loading && (
               <Typography variant="body1" align="center">
                  게시물이 없습니다.
               </Typography>
            )
         )}
      </Container>
   )
}

export default Home
