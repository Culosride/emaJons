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

export const createPost = createAsyncThunk("createPost", async (formData) => {
  const response = await api.createPost(formData)
  return response.data
})

export const editPost = createAsyncThunk("updatePost", async (payload) => {
  const { formData, postId } = payload
  console.log("at index, formdata",formData, "id",postId)
  const response = await api.editPost(formData, postId)
  return response.data
})

export const deletePost = createAsyncThunk("deletePost", async ([postId, category, token]) => {
  const response = await api.deletePost([postId, category, token])
  return response.data
})

export const fetchPostsByCategory = createAsyncThunk("getPosts", async (category) => {
  const response = await api.fetchPostsByCategory(category)
  return response.data
})

export const fetchPostById = createAsyncThunk("getPost", async (params) => {
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

    },
    setCurrentPost(state, action) {
      state.selectedPost = action.payload
    },
    setCurrentCategory(state, action) {
      state.currentCategory = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(createPost.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(createPost.fulfilled, (state, action) => {
        return state = {
          ...state,
          lastId: action.payload._id,
          status: 'succeeded',
          selectedPost: action.payload,
          error: ""
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(editPost.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(editPost.fulfilled, (state, action) => {
        return state = {
          ...state,
          lastId: action.payload._id,
          status: 'succeeded',
          selectedPost: action.payload,
          error: ""
        }
      })
      .addCase(editPost.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(deletePost.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error= ""
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
        console.log(action.payload)
        const filteredPosts = action.payload.filter(post => state.posts._id !== post._id )
        state.status = 'succeeded'
        state.currentCategory = action.meta.arg
        state.posts = [...filteredPosts]
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

export const { toggleFullscreen, resetStatus, clearResults, setCurrentPost, setCurrentCategory } = postsSlice.actions

export default postsSlice.reducer
