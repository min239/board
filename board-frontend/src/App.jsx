import './styles/common.css'
import Navbar from './components/shared/Navbar'
import Home from './pages/Home'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'

import { Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { checkAuthStatusThunk } from './features/authSlice'
import BoardCreatePage from './pages/BoardCreatePage'
import BoardEditPage from './pages/BoardEditPage'

function App() {
   const dispatch = useDispatch()
   const { isAuthenticated, member } = useSelector((state) => state.auth) // 로그인 상태, 로그인한 사용자 정보(로그아웃 상태일때는 null)

   console.log('location.key:', location.key)
   // 새로고침시 redux 에서 사용하는 state가 사라지므로 지속적인 로그인 상태 확인을 위해 사용
   useEffect(() => {
      dispatch(checkAuthStatusThunk())
   }, [dispatch])
   return (
      <>
         <Navbar isAuthenticated={isAuthenticated} member={member} />
         <Routes>
            <Route path="/" element={<Home isAuthenticated={isAuthenticated} member={member} key={location.key} />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/boards/create" element={<BoardCreatePage />} />
            <Route path="/boards/edit/:id" element={<BoardEditPage />} />
         </Routes>
      </>
   )
}
export default App
