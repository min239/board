import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL

//axios 인스턴스 생성
const snsApi = axios.create({
   baseURL: BASE_URL,
   headers: {
      'Content-Type': 'application/json', 
   },
   // localhost:5173 -> 프론트엔드
   // localhost:8000 -> 백엔드
 
   withCredentials: true, 
})

//회원가입
export const registerMember = async (memberData) => {
   try {
      // localhost:8000/auth/join
      console.log('userData: ', memberData)
      const response = await snsApi.post('/auth/join', memberData)

      console.log('response: ', response) // response: {data: {user: {id, email, name}}}
     
      return response
   } catch (error) {
    
      console.error(`API Request 오류: ${error.message}`)
      throw error 
   }
}

//로그인
export const loginMember = async (credentials) => {
   try {
      console.log('credentials: ', credentials)
      const response = await snsApi.post('/auth/login', credentials)

      console.log('response: ', response) 
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}
//로그아웃
export const logoutMember = async () => {
   try {
      const response = await snsApi.get('/auth/logout')
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}
//로그인 상태 확인
export const checkAuthStatus = async () => {
   try {
      const response = await snsApi.get('/auth/status')
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}