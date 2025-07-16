import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createBoard, getBoards } from '../api/boApi'

// 보드 등록
export const createBoardThunk = createAsyncThunk('boards/createBoard', async (boardData, { rejectWithValue }) => {
   try {
      console.log('boardData: ', boardData)
      const response = await createBoard(boardData)

      console.log(response)
      return response.data.board
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})
//전체 보드 리스트 가져오기
export const fetchBoardsThunk = createAsyncThunk('boards/fetchBoard', async (page, { rejectWithValue }) => {
   try {
      console.log('page:', page)
      const response = await getBoards(page)
      console.log(response)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

const boardSlice = createSlice({
   name: 'boards',
   initialState: {
      board: null, // 보드 데이터
      boards: [], // 보드 리스트
      pagination: null, // 페이징 객체
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      // 보드 등록
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
      //  리스트 가지고 오기
      builder
         .addCase(fetchBoardsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchBoardsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.board = action.payload.pagination
         })
         .addCase(fetchBoardsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})
export default boardSlice.reducer
