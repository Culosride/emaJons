import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from "../../API/index"

const initialState = {
  categoryTags: [],
  status: 'idle' || 'loading' || 'succeeded' || 'failed',
  error: "" || null
}

export const addCategoryTag = createAsyncThunk("/categories", async (data) => {
    const response = await api.addCategoryTag(data)
    return response.data
})

export const fetchCategoryTags = createAsyncThunk("/api/categories/fetchCategoryTags", async (category) => {
  const response = await api.fetchCategoryTags(category)
  return response.data
})


const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCategoryTags.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchCategoryTags.fulfilled, (state, action) => {
        const [ {categoryTags} ] = action.payload
        return state = {
          ...state,
          categoryTags: categoryTags,
          status: 'succeeded',
        }
      })
      .addCase(fetchCategoryTags.rejected, (state) => {
        state.status = "failed";
      })
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

// export const { } = categorySlice.actions


export default categorySlice.reducer
