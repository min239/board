import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createBoard, getBoards, getBoardById, updateBoard, deleteBoard } from '../api/boApi'

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
// 게시물 삭제
export const deleteBoardThunk = createAsyncThunk('boards/deleteBoard', async (id, { rejectWithValue }) => {
   try {
      await deleteBoard(id) //api 호출만 하고
      return id //삭제한 id 반환
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})
// 게시물 수정
export const updateBoardThunk = createAsyncThunk('boards/updateBoard', async (data, { rejectWithValue }) => {
   try {
      const { id, boardData } = data
      console.log('data:', data)

      const response = await updateBoard(id, boardData)

      console.log(response)
      return response.data.board
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})
// 특정 게시물 가져오기
export const fetchBoardByIdThunk = createAsyncThunk('boards/fetchBoardById', async (id, { rejectWithValue }) => {
   try {
      console.log('포스트 id: ', id)
      const response = await getBoardById(id)

      console.log(response)
      return response.data
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
            state.boards = action.payload.boards
            state.pagination = action.payload.pagination
         })
         .addCase(fetchBoardsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
      //  게시물 수정
      builder
         .addCase(updateBoardThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateBoardThunk.fulfilled, (state, action) => {
            state.loading = false
            state.board = action.payload
         })
         .addCase(updateBoardThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
      // 특정 게시물 불러오기
      builder
         .addCase(fetchBoardByIdThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchBoardByIdThunk.fulfilled, (state, action) => {
            state.loading = false
            state.board = action.payload.board //특정 게시물 데이터
         })
         .addCase(fetchBoardByIdThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
      // 게시물삭제
      builder
         .addCase(deleteBoardThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deleteBoardThunk.fulfilled, (state, action) => {
            state.loading = false
            state.boards = state.boards.filter((b) => b.id !== action.payload)
            // deleteBoardThunk.fulfilled에서 boards 배열에서 제거,boards 배열에서 해당 id 제거
            //fulfilled 액션이 날아오고 boards 배열에서 해당 게시물 제거
            //리스트를 렌더링하는 컴포넌트가 즉시 재렌더 → 화면에서 사라짐
         })
         .addCase(deleteBoardThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})
export default boardSlice.reducer
