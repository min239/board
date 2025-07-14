import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthError, loginMemberThunk } from '../../features/authSlice'

function Login() {
   const [email, setEmail] = useState('') // 이메일
   const [password, setPassword] = useState('') //비밀번호
   const dispatch = useDispatch() // 리덕스 디스패치 함수
   const navigate = useNavigate() // 페이지 이동 함수
   const { loading, error } = useSelector((state) => state.auth) // auth 상태에서 loading과 error 가져오기

   useEffect(() => {
      //로그인 컴포넌트를 벗어날대 error state가 NUUL로 초기화
      return () => {
         dispatch(clearAuthError())
      }
   }, [dispatch])

   // 로그인 버튼 눌렀을때 handlelogin 함수 실행
   const handleLogin = (e) => {
      e.preventDefault()
      if (!email.trim() || !password.trim()) {
         alert('이메일과 비밀번호를 입력해주세요.')
         return
      }
      dispatch(loginMemberThunk({ email, password })) // 로그인 액션 디스패치 loginUserThunk로 감
         .unwrap()
         .then(() => navigate('/')) // 로그인 성공시 메인페이지로 이동
         .catch((err) => console.error('로그인 실패:', err)) // 로그인 실패시 에러 출력
   }

   return (
      <Container maxWidth="sm">
         <Typography variant="h4" gutterBottom>
            로그인
         </Typography>

         {error && (
            <Typography color="error" align="center">
               {error}
            </Typography>
         )}

         <form onSubmit={handleLogin}>
            <TextField label="이메일" name="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />

            <TextField label="비밀번호" type="password" name="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading} sx={{ position: 'relative', marginTop: '20px' }}>
               {loading ? (
                  <CircularProgress
                     size={24}
                     sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                     }}
                  />
               ) : (
                  '로그인'
               )}
            </Button>
         </form>

         <p>
            계정이 없으신가요? <Link to="/signup">회원가입</Link>
         </p>
      </Container>
   )
}

export default Login
