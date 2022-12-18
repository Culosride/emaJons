import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from "../../API/index"

const initialState = {
  posts: [],
  lastId: "",
  selectedPost: "",
  status: 'idle' || 'loading' || 'succeeded' || 'failed',
  error: "" || null
}

export const fetchPosts = createAsyncThunk("/posts/fetchPosts", async (token) => {
  const response = await api.fetchPosts(token)
  console.log(response)
  return response.data
})

export const addPost = createAsyncThunk("/posts", async (formData) => {
  const response = await api.addPost(formData)
  return response.data
})
// export const addPost = createAsyncThunk("/posts", async (data) => {
//   const { formData, token } = data
//   // console.log("slice", formData, token)
//   const response = await api.addPost(formData, token)
//   // console.log("response", response.data)
//   return response.data
// })

export const deletePost = createAsyncThunk("api/posts/:postId", async ([postId, category, token]) => {
  const response = await api.deletePost([postId, category, token])
  return response.data
})

export const fetchPostsByCategory = createAsyncThunk("/api/posts/fetchPostsByCategory", async (category) => {
  const response = await api.fetchPostsByCategory(category)
  return response.data
})

export const fetchPostById = createAsyncThunk("/api/posts/fetchPostById", async (params) => {
  const response = await api.fetchPostById(params)
  return response.data
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
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
        console.log(action)
        state.error = action.error.message
      })
      .addCase(deletePost.pending, (state, action) => {
        state.status = 'loading'
      })
      // .addCase(deletePost.fulfilled, (state, action) => {
      //   state.status = 'succeeded'
      //   console.log(action.payload.message)
      //   // need  to get the posts again
      //   return state
      // })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchPostsByCategory.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPostsByCategory.fulfilled, (state, action) => {
        state.status = 'succeeded'
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
          selectedPost: action.payload
       }
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
    }
})

// export const { addPost } = postsSlice.actions

export default postsSlice.reducer
