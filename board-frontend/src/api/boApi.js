import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL

//axios 인스턴스 생성
const boApi = axios.create({
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
      console.log('memberData: ', memberData)
      const response = await boApi.post('/auth/join', memberData)

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
      const response = await boApi.post('/auth/login', credentials)

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
      const response = await boApi.get('/auth/logout')
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}
//로그인 상태 확인
export const checkAuthStatus = async () => {
   try {
      const response = await boApi.get('/auth/status')
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

//보드 등록
export const createBoard = async (boardData) => {
   try {
      console.log('boardData:', boardData)

      // ★서버에 파일 전송시 반드시 해야하는 headers 설정
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data', // 파일 전송시 반드시 지정
         },
      }
      const response = await boApi.post('/board', boardData, config)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

//전체 보트 가져오기(페이징)
export const getBoards = async (page) => {
   try {
      const response = await boApi.get(`/board?page=${page}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

//특정 보드 가져오기
export const getBoardById = async (id) => {
   try {
      const response = await boApi.get(`/board/${id}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

//포스트 수정
export const updateBoard = async (id, boardData) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data', // 파일 전송시 반드시 지정
         },
      }
      const response = await boApi.put(`/board/${id}`, boardData, config)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}
//보드 삭제
export const deleteBoard = async (id) => {
   try {
      const response = await boApi.delete(`/board/${id}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}