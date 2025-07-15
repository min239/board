import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createPost, getBoards } from '../api/boApi'

// 게시물 등록
export const createBoardThunk = createAsyncThunk('boards/createBoard', async (boardData, { rejectWithValue }) => {
   try {
      console.log('boardData: ', boardData)
      const response = await createPost(boardData)

      console.log(response)
      return response.data.board
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

const boardSlice = createSlice({
   name: 'boards',
   initialState: {
      board: null, // 게시글 데이터
      boards: [], // 게시글 리스트
      pagination: null, // 페이징 객체
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      // 게시물 등록
      builder
         .addCase(createBoardThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createBoardThunk.fulfilled, (state, action) => {
            state.loading = false
            state.board = action.payload // 등록한 게시물 데이터
         })
         .addCase(createBoardThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})
export default boardSlice.reducer
