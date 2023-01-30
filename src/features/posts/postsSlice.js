import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from "../../API/index"

const initialState = {
  posts: [],
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
  console.log(payload)
  const response = await api.editPost(formData, postId)
  return response.data
})

export const deletePost = createAsyncThunk("deletePost", async ([postId, category]) => {
  const response = await api.deletePost([postId, category])
  return response.data
})

export const fetchPosts = createAsyncThunk("getPosts", async () => {
  const response = await api.fetchPosts()
  return response.data
})
export const fetchPostsByCategory = createAsyncThunk("getPostsByCategory", async (category) => {
  const response = await api.fetchPostsByCategory(category)
  return response.data
})

export const fetchPostById = createAsyncThunk("getPostById", async (params) => {
  const response = await api.fetchPostById(params)
  return response.data
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    resetStatus(state){
      state.status = "idle"
    },
    toggleFullscreen(state, action) {
      state.fullscreen = action.payload ?
      action.payload :
      !state.fullscreen
    },
    setCurrentPost(state, action) {
      return state = {
        ...state,
        selectedPost: action.payload,
        currentCategory: action.payload.category,
        fullscreen: false
      }
    },
    setCurrentCategory(state, action) {
      state.status = "succeeded"
      state.error = null
      state.currentCategory = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(createPost.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(createPost.fulfilled, (state, action) => {
        console.log('reducer', action)
        return state = {
          ...state,
          status: 'succeeded',
          selectedPost: action.payload,
          posts: state.posts.concat(action.payload),
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
        const filteredPosts = state.posts.filter(post => post._id !== action.payload._id)
        return state = {
          ...state,
          posts: [...filteredPosts, action.payload],
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
        console.log("payload", state, action.payload)
        state.status = 'succeeded'
        state.error= ""
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        let cat = state.currentCategory
        if(state.currentCategory === "") {cat = action.payload[0].category}

        return state = {
          ...state,
          status: 'succeeded',
          currentCategory: cat,
          posts: action.payload,
          error: null
       }
      })
      .addCase(fetchPosts.rejected, (state, action) => {
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

export const { resetStatus, clearResults, setCurrentPost, setCurrentCategory, toggleFullscreen } = postsSlice.actions

export default postsSlice.reducer
