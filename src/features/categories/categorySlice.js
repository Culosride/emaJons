import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from "../../API/index"

const initialState = {
  allTags: [],
  status: 'idle' || 'loading' || 'succeeded' || 'failed',
  error: "" || null
}

export const addNewTag = createAsyncThunk("api/categories/tags", async (tag) => {
  const response = await api.addNewTag(tag)
  return response.data
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
      .addCase(addNewTag.rejected, (state) => {
        state.status = "failed";
        state.error = action.payload.err
      })
  }
})

// export const { } = categorySlice.actions


export default categorySlice.reducer
