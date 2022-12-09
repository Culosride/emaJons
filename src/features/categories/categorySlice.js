import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from "../../API/index"

export const addCategoryTag = createAsyncThunk("/categories", async (data) => {
    const response = await api.addCategoryTag(data)
    return response.data
})


const initialState = {
  categoryTags: [],
  status: 'idle' || 'loading' || 'succeeded' || 'failed',
  error: "" || null
}

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(addCategoryTag.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(addCategoryTag.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categoryTags = state.categoryTags.concat(action.payload.categoryTags);
      })
      .addCase(addCategoryTag.rejected, (state) => {
        state.status = "failed";
        state.error = "Tag already exists for this category"
      })
  }
})

export const { } = categorySlice.actions


export default categorySlice.reducer
