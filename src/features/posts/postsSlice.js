import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from "../../API/index"

const initialState = {
  posts: [],
  status: 'idle' || 'loading' || 'succeeded' || 'failed',
  error: "" || null
}

export const fetchPosts = createAsyncThunk("/posts/fetchPosts", async () => {
  const response = await api.fetchPosts()
  console.log("data is",response.data)
  return response.data
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
    extraReducers(builder) {
      builder
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
    }
    // postDeleted(state, action) {
    //   const todo = state.find(todo => todo.id === action.payload)
    //   todo.completed = !todo.completed
    // }
})

// export const { fetchPosts } = postsSlice.actions
export default postsSlice.reducer



// selectors
export const allPosts = state => state.posts
export const postById = (state, postId) =>
  state.posts.find(post => post.id === postId)
