import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Typography, Box } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { deleteBoardThunk } from '../../features/boardSlice'

function BoardItem({ boards, isAuthenticated, member }) {
   const dispatch = useDispatch()

   const onClickDelete = (id) => {
      if (confirm('정말 삭제하시겠습니까?')) {
         dispatch(deleteBoardThunk(id))
            .unwrap()

            .catch((err) => {
               console.error('삭제 오류:', err)
               alert('삭제 실패: ' + err.message)
            })
      }
   }

   return (
      <Box>
         <Typography variant="h5" sx={{ mb: 3 }}>
            게시판 목록
         </Typography>
         <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
            <Table>
               <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                     <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>제목</TableCell>
                     <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>작성자</TableCell>
                     <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>작성일</TableCell>
                     <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
                        수정/삭제
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {(boards || []).map((board) => (
                     <TableRow key={board.id} hover>
                        <TableCell>{board.title}</TableCell>
                        <TableCell>{board.Member?.name || '알 수 없음'}</TableCell>
                        <TableCell>{dayjs(board.createdAt).format('YYYY-MM-DD HH:mm')}</TableCell>

                        <TableCell align="center">
                           {isAuthenticated && board.Member?.id === member?.id && (
                              <>
                                 <Tooltip title="수정">
                                    <Link to={`/boards/edit/${board.id}`}>
                                       <IconButton color="info" size="small">
                                          <EditIcon />
                                       </IconButton>
                                    </Link>
                                 </Tooltip>
                                 <Tooltip title="삭제">
                                    <IconButton color="error" size="small" onClick={() => onClickDelete(board.id)}>
                                       <DeleteIcon />
                                    </IconButton>
                                 </Tooltip>
                              </>
                           )}
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
      </Box>
   )
}

export default BoardItem
