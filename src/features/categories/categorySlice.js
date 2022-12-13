import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from "../../API/index"

const initialState = {
  allTags: [],
  status: 'idle' || 'loading' || 'succeeded' || 'failed',
  error: "" || null
}

export const addNewTag = createAsyncThunk("api/categories/tags", async (tag, { rejectWithValue }) => {
  try {
    const response = await api.addNewTag(tag)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data.message)
  }
})

export const deleteTag = createAsyncThunk("api/categories/deleteTag", async (tagToDelete, { rejectWithValue }) => {
  try {
    const response = await api.deleteTag(tagToDelete)
    // console.log("at slicer",tagToDelete)
    console.log("data", response.data)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data.message)
  }
})

export const fetchAllTags = createAsyncThunk("/api/categories/", async () => {
  const response = await api.fetchAllTags()
  return response.data
})


const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllTags.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchAllTags.fulfilled, (state, action) => {
        return state = {
          ...state,
          allTags: [...action.payload],
          status: 'succeeded',
        }
      })
      .addCase(fetchAllTags.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addNewTag.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(addNewTag.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allTags = state.allTags.concat(action.payload)
      })
      .addCase(addNewTag.rejected, (state, action) => {
        state.status = "failed";
        console.log()
        state.error = action.payload
      })
      .addCase(deleteTag.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteTag.fulfilled, (state, {payload}) => {
        const filteredTags = state.allTags.filter(tag => tag !== payload.deletedTag)
        return state = {
          ...state,
          allTags: [...filteredTags],
          status: 'succeeded',
        }
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.status = "failed";
        console.log()
        state.error = action.payload.message
      })
  }
})

// export const { } = categorySlice.actions


export default categorySlice.reducer
