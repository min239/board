import { Card, CardMedia, CardContent, Typography, Box, CardActions, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import dayjs from 'dayjs' //날짜 시간 포맷해주는 패키지

import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { deleteBoardThunk } from '../../features/boardSlice'

function BoardItem({ board, isAuthenticated, member }) {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   // 게시물 삭제
   const onClickDelete = (id) => {
      const result = confirm('삭제하시겠습니까?')

      if (result) {
         dispatch(deleteBoardThunk(id))
            .unwrap()
            .then(() => {
               navigate('./')
            })
            .catch((error) => {
               console.error('게시물 삭제 중 오류 발생:', error)
               alert('게시물 삭제에 실패했습니다' + error)
            })
      }
   }

   return (
      <Card style={{ margin: '20px 0' }}>
         <CardMedia sx={{ height: 240 }} image={`${import.meta.env.VITE_APP_API_URL}${board.img}`} title={board.content} />
         <CardContent>
            <Typography sx={{ color: 'primary.main' }}>제목:{board.title}</Typography>

            <Typography>작성자:{board.Member.name} </Typography>

            <Typography>작성일:{dayjs(board.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
            <Typography>내용:{board.content}</Typography>
         </CardContent>
         <CardActions>
            <Button size="small" color="primary">
               <FavoriteBorderIcon fontSize="small" />
            </Button>

            {isAuthenticated && board.Member.id === member.id && (
               <Box sx={{ p: 2 }}>
                  <Link to={`/boards/edit/${board.id}`}>
                     <IconButton aria-label="edit" size="small">
                        <EditIcon fontSize="small" />
                     </IconButton>
                  </Link>
                  <IconButton aria-label="delete" size="small" onClick={() => onClickDelete(board.id)}>
                     <DeleteIcon fontSize="small" />
                  </IconButton>
               </Box>
            )}
         </CardActions>
      </Card>
   )
}

export default BoardItem
