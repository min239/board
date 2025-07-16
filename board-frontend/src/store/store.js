import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import boardsReducer from '../features/boardSlice'
const store = configureStore({
   reducer: {
      auth: authReducer, // authSlice에서 만든 리듀서를 등록
      boards: boardsReducer,
   },
})

export default store
