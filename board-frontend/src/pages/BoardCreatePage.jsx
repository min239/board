// import { Container } from '@mui/material'
// import PostCreateForm from '../components/post/PostCreateForm'
// import { useDispatch } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import { createPostThunk } from '../features/postSlice'

// function PostCreatePage() {
//    const navigate = useNavigate()
//    const dispatch = useDispatch()

//    const onPostCreate = (postData) => {

//       dispatch(createPostThunk(postData))
//          .unwrap()
//          .then(() => {
//             // 게시물 등록 성공 후 홈으로 이동
//             navigate('/')
//          })
//          .catch((error) => {
//             // 게시물 등록 실패 시 에러 처리
//             console.error('게시물 등록 에러:', error)
//             alert('게시물 등록에 실패했습니다.', error)
//          })
//    }
//    return (
//       <Container maxWidth="md">
//          <h1>게시물 등록</h1>
//          <PostCreateForm onPostCreate={onPostCreate} />
//       </Container>
//    )
// }

// export default PostCreatePage
