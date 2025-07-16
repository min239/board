import { Card, CardMedia, CardContent, Typography, Box, CardActions, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import dayjs from 'dayjs' //날짜 시간 포맷해주는 패키지

import { Link } from 'react-router-dom'

function BoardItem({ board, isAuthenticated, member }) {
   // 게시물 삭제
   const onClickDelete = () => {}

   return (
      <Card style={{ margin: '20px 0' }}>
         <CardMedia sx={{ height: 240 }} image={`${import.meta.env.VITE_APP_API_URL}${board.img}`} title={board.content} />
         <CardContent>
            <Typography>{board.Member.title}</Typography>
            <Link to={`/my/${board.Member.id}`} style={{ textDecoration: 'none' }}>
               <Typography sx={{ color: 'primary.main' }}>@{board.Member.name} </Typography>
            </Link>
            <Typography>{dayjs(board.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
            <Typography>{board.content}</Typography>
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
