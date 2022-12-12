import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from "../../API/index"

const initialState = {
  allTags: [],
  status: 'idle' || 'loading' || 'succeeded' || 'failed',
  error: "" || null
}

export const addCategoryTag = createAsyncThunk("/categories", async (data) => {
    const response = await api.addCategoryTag(data)
    return response.data
})

export const fetchAllTags = createAsyncThunk("/categories", async () => {
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
        const [ {tags} ] = action.payload
        return state = {
          ...state,
          allTags: tags,
          status: 'succeeded',
        }
      })
      .addCase(fetchAllTags.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addCategoryTag.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(addCategoryTag.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allTags = state.allTags.push(action.payload.newTag);
      })
      .addCase(addCategoryTag.rejected, (state) => {
        state.status = "failed";
        state.error = "Tag already exists for this category"
      })
  }
})

// export const { } = categorySlice.actions


export default categorySlice.reducer
