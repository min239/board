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

         {boards.length > 0 ? (
            <>
               {boards.map((board) => (
                  <BoardItem key={board.id} board={board} isAuthenticated={isAuthenticated} member={member} />
               ))}
               <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
                  <Pagination
                     count={pagination.totalPages} //총페이지 수 Pagination
                     page={page}
                     onChange={handlePageChange}
                  />
                  {/* count={10} 페이지 10개 보여줌 */}
                  {/* totalpage:총페이지 수 board.js에서 */}
               </Stack>
            </>
         ) : (
            // boards 데이터가 0개 이면서 로딩중이 아닐때
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
