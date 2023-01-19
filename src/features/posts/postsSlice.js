import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from "../../API/index"

const initialState = {
  posts: [],
  lastId: "",
  currentCategory: "",
  fullscreen: false,
  selectedPost: "",
  status: 'idle' || 'loading' || 'succeeded' || 'failed',
  error: "" || null
}

export const addPost = createAsyncThunk("api/posts/new", async (formData) => {
  const response = await api.addPost(formData)
  return response.data
})

export const deletePost = createAsyncThunk("api/posts/delete", async ([postId, category, token]) => {
  const response = await api.deletePost([postId, category, token])
  return response.data
})

export const fetchPostsByCategory = createAsyncThunk("/api/posts/get", async (category) => {
  const response = await api.fetchPostsByCategory(category)
  return response.data
})

export const fetchPostById = createAsyncThunk("/api/posts/post", async (params) => {
  const response = await api.fetchPostById(params)
  return response.data
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    toggleFullscreen(state) {
      state.fullscreen = !state.fullscreen
    },
    resetStatus(state){
      state.status = "idle"
    },
    clearState() {

    }
  },
  extraReducers(builder) {
    builder
      .addCase(addPost.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(addPost.fulfilled, (state, action) => {
        return state = {
          ...state,
          lastId: action.payload._id,
          status: 'succeeded',
          selectedPost: action.payload
        }
      })
      .addCase(addPost.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(deletePost.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = 'succeeded'
        return state
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchPostsByCategory.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPostsByCategory.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.currentCategory = action.meta.arg
        state.posts = [...action.payload]
      })
      .addCase(fetchPostsByCategory.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchPostById.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        return state = {
          ...state,
          status: 'succeeded',
          currentCategory: action.payload.category,
          selectedPost: action.payload
       }
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
    }
})

export const { toggleFullscreen, resetStatus, clearResults } = postsSlice.actions

export default postsSlice.reducer
