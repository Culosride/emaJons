import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from "../../API/index"

const initialState = {
  posts: [],
  allTags: [],
  status: 'idle' || 'loading' || 'succeeded' || 'failed',
  error: "" || null
}

export const fetchPosts = createAsyncThunk("/posts/fetchPosts", async () => {
  const response = await api.fetchPosts()
  return response.data
})

export const fetchPostsByCategory = createAsyncThunk("/api/posts/fetchPostsByCategory", async (params) => {
  const response = await api.fetchPostsByCategory(params)
  // console.log("data", response.data)
  return response.data
})

export const fetchPostById = createAsyncThunk("/api/posts/fetchPostById", async (params) => {
  const response = await api.fetchPostById(params)
  // console.log("data", response.data)
  return response.data
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state) => {
      return state
    },
    addTag: (state, action) => {
      state.allTags = state.allTags.concat(action.payload);
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPostsByCategory.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPostsByCategory.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        state.posts = state.posts.concat(action.payload)
      })
      .addCase(fetchPostsByCategory.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        state.posts = state.posts.concat(action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchPostById.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        state.posts = action.payload
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
    }
    // postDeleted(state, action) {
    //   const todo = state.find(todo => todo.id === action.payload)
    //   todo.completed = !todo.completed
    // }
})

export const { addTag, addPost } = postsSlice.actions


export default postsSlice.reducer
