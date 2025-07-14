import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { checkAuthStatus, loginMember, logoutMember, registerMember } from '../api/boApi'

// 회원가입
export const registerMemberThunk = createAsyncThunk('auth/registerMember', async (memberData, { rejectWithValue }) => {
   // memberData: 회원가입 정보
   try {
      console.log('memberData: ', memberData)
      const response = await registerMember(memberData)
      return response.data.member
   } catch (error) {
      console.log(error)
      return rejectWithValue(error.response?.data?.message)
   }
})

// 로그인
export const loginMemberThunk = createAsyncThunk('auth/loginMember', async (credentials, { rejectWithValue }) => {
   try {
      const response = await loginMember(credentials)
      return response.data.member
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

// 로그아웃
// _(언더바)는 매개변수 값이 없을 때 사용
export const logoutMemberThunk = createAsyncThunk('auth/logoutMember', async (_, { rejectWithValue }) => {
   try {
      const response = await logoutMember()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

// 로그인 상태확인
export const checkAuthStatusThunk = createAsyncThunk('auth/checkAuthStatus', async (_, { rejectWithValue }) => {
   try {
      const response = await checkAuthStatus() // 로그인 상태 확인 API 호출
      // response.data는 { isAuthenticated: true/false, member: memberInfo }
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

const authSlice = createSlice({
   name: 'auth',
   initialState: {
      member: null, // 사용자 정보 객체
      isAuthenticated: false, // 로그인 상태(true: 로그인, false: 로그아웃)
      loading: false,
      error: null,
   },
   reducers: {
      clearAuthError: (state) => {
         state.error = null // 에러 초기화
      },
   },
   extraReducers: (builder) => {
      builder
         // 회원가입
         .addCase(registerMemberThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(registerMemberThunk.fulfilled, (state, action) => {
            state.loading = false
            state.member = action.payload
         })
         .addCase(registerMemberThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // 로그인
         .addCase(loginMemberThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(loginMemberThunk.fulfilled, (state, action) => {
            state.loading = false
            state.isAuthenticated = true
            state.member = action.payload
         })
         .addCase(loginMemberThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // 로그아웃
         .addCase(logoutMemberThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(logoutMemberThunk.fulfilled, (state) => {
            state.loading = false
            state.isAuthenticated = false
            state.member = null // 로그아웃 후 유저 정보 초기화
         })
         .addCase(logoutMemberThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         .addCase(checkAuthStatusThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(checkAuthStatusThunk.fulfilled, (state, action) => {
            state.loading = false
            // 로그인 상태일지 로그아웃 상태일지 모르기 때문에 아래와 같이 값을 준다
            state.isAuthenticated = action.payload.isAuthenticated
            state.member = action.payload.member || null
         })
         .addCase(checkAuthStatusThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.isAuthenticated = false
            state.member = null
         })
   },
})

export const { clearAuthError } = authSlice.actions
export default authSlice.reducer
